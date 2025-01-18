import { LitElement, html } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'

/**
 * @typedef {import('../SpritesheetController').default} SpritesheetController
 */

/**
 * Custom element to preview an animation. Insert into the page with:
 *
 * <lpc-animation-preview></lpc-animation-preview>
 *
 * Then, get the element with JavaScript to set a source and call start().
 *
 * This class makes use of private fields (variables starting with a "#") to
 * prevent access to internal state.
 */
export default class LPCAnimationPreview extends LitElement {
  static properties = {
    spritesheetController: { type: Object }
  }

  #canvasRef = createRef()
  #selectedAnimation = 'walk'

  get #canvas() { return this.#canvasRef.value }
  get #ctx() { return this.#canvas?.getContext('2d') }

  /**
   * The pending requestAnimationFrame id. Used by stop() to cancel the
   * animation frame.
   *
   * @type {number|undefined}
   */
  #animationLoopId = undefined

  /**
   * When the animation was started. Used to calculate the current frame.
   *
   * @type {DOMHighResTimeStamp|undefined}
   */
  #animationStart = undefined

  get animationNames() { return this.spritesheetController?.animationNames || [] }

  /**
   * The image or canvas element for the full spritesheet
   *
   * @returns {CanvasImageSource|undefined}
   */
  get source() { return this.spritesheetController?.canvas }

  #currentFrameIndex = 0 // The index of the currently displayed frame
  #framesPerSecond = 8 // Default value, individual animations can set a different frame rate
  #numberOfDirections = 4 // The number of directions a character can face in

  animationLength = 0 // This is calculated from the selected animation

  get animations() {
    return this.spritesheetController?.animationDefinitions ?? {}
  }

  /**
   * @return {object} The currently selected animation
   */
  get animation() {
    return this.animationNames.find(animation => animation === this.#selectedAnimation)
  }

  /**
   * Start the animation
   */
  start() {
    this.updateFrameSize()
    this.#animationStart = performance.now()
    this.#animationLoopId = requestAnimationFrame(this.#animate)
  }

  /**
   * Stop the animation
   */
  stop() {
    cancelAnimationFrame(this.#animationLoopId)
    this.#animationLoopId = undefined
  }

  /**
   * Reset the animation, used whenever the selected animation is changed
   */
  restart() {
    this.stop()
    this.start()
  }

  /**
   * Loads the frame size for the current animation. Called from start(), and
   * whenever the user selects an asset.
   */
  updateFrameSize() {
    const animationName = this.#selectedAnimation
    const frameSizes = this.spritesheetController.largestAnimationFrameSizes()
    this.frameSize = frameSizes[animationName]

    this.animationLength = this.animations[animationName].columns
    this.#canvas.width = this.frameSize * this.#numberOfDirections
    this.#canvas.height = this.frameSize
  }

  /**
   * Callback for the requestAnimationFrame loop. Displays the appropriate frame
   * based on the time since the animation started and the frames per second.
   *
   * @param {DOMHighResTimeStamp} timestamp
   */
  #animate = timestamp => {
    this.#animationLoopId = requestAnimationFrame(this.#animate)

    const timeSinceStart = timestamp - this.#animationStart
    const framePerSecond = this.animation.framesPerSecond ?? this.#framesPerSecond
    const nextFrameIndex = Math.floor(timeSinceStart / 1000 * framePerSecond) % this.animationLength

    if (nextFrameIndex === this.#currentFrameIndex) return

    this.#draw(nextFrameIndex)

    this.#currentFrameIndex = nextFrameIndex
  }

  /**
   * Draw the specified frame of the current animation, for all facing
   * directions.
   *
   * @param {number} frameIndex
   */
  #draw(frameIndex) {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

    const startX = this.spritesheetController.animationStartX(this.#selectedAnimation)
    const startY = this.spritesheetController.animationStartY(this.#selectedAnimation)

    for (let direction = 0; direction < this.#numberOfDirections; direction++) {
      const sx = startX + frameIndex * this.frameSize
      const sy = startY + direction * this.frameSize
      const dx = direction * this.frameSize
      const dy = 0 // Draw each direction in a horizontal row

      this.#ctx.drawImage(
        this.source,
        sx, sy, this.frameSize, this.frameSize,
        dx, dy, this.frameSize, this.frameSize
      )
    }
  }

  /**
   * Handle user selection of which animation
   *
   * @param {Event} event
   */
  #updateSelectedAnimation = (event) => {
    this.#selectedAnimation = event.target.value

    if (this.#animationLoopId) {
      this.restart()
    }
  }

  render() {
    return html`
      <div part="base">
        <div part="select-base">
          <span part="select-label">Preview</span>
          <select part="animation-select" @change=${this.#updateSelectedAnimation}>
            ${this.animationNames.map(name => html`<option value=${name} ?selected=${name === this.#selectedAnimation}>${name}</option>`)}
            </select>
        </div>
        <canvas ${ref(this.#canvasRef)} part="animation"></canvas>
      </div>
    `
  }
}

window.customElements.define('lpc-animation-preview', LPCAnimationPreview)

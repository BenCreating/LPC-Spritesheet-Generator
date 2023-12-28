/**
 * @typedef {import('./SpritesheetController').default} SpritesheetController
 */

/**
 * Custom element to preview an animation. Insert into the page with:
 *
 * <animation-preview></animation-preview>
 *
 * Then, get the element with JavaScript to set a source and call start().
 *
 * This class makes use of private fields (variables starting with a "#") to
 * prevent access to internal state.
 */
class AnimationPreview extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const wrapper = document.createElement('div')

    const selectAnimationWrapper = document.createElement('div')

    const label = document.createElement('span')
    label.textContent = 'Preview'

    const select = document.createElement('select')
    select.addEventListener('change', this.#updateSelectedAnimation)
    this.selectorElement = select

    selectAnimationWrapper.append(label, select)
    wrapper.append(selectAnimationWrapper, this.#canvas)

    // Normally, global page CSS can't target these elements, because they are
    // in a shadow root. Setting a "part" allows targeting them with the
    // ::part() selector. For example:
    //
    // animation-preview::part(select-label) {
    //   background-color: red;
    // }
    wrapper.part = 'base'
    selectAnimationWrapper.part = 'select-base'
    label.part = 'select-label'
    select.part = 'animation-select'
    this.#canvas.part = 'animation'

    this.shadowRoot.append(wrapper)
  }

  #selectedAnimation = 'walk'
  #canvas = document.createElement('canvas')
  #ctx = this.#canvas.getContext('2d')

  /**
   * The pending requestAnimationFrame id. Used by stop() to cancel the
   * animation frame.
   *
   * @type {number}
   */
  #animationLoopId = undefined

  /**
   * When the animation was started. Used to calculate the current frame.
   *
   * @type {DOMHighResTimeStamp}
   */
  #animationStart = undefined

  /**
   * The object storing the information for building the spritesheet. Set this
   * before calling start().
   *
   * @type {SpritesheetController}
   */
  spritesheetController = undefined

  /**
   * The image or canvas element for the full spritesheet
   *
   * @returns {CanvasImageSource}
   */
  get source() { return this.spritesheetController.canvas }

  #currentFrameIndex = 0 // The index of the currently displayed frame
  #framesPerSecond = 8 // Default value, individual animations can set a different frame rate
  #numberOfDirections = 4 // The number of directions a character can face in

  animationLength = 0 // This is calculated from the selected animation

  get animations() {
    if (!this.spritesheetController) return {}
    return this.spritesheetController.animationDefinitions
  }

  /**
   * @return {object} The currently selected animation
   */
  get animation() {
    const animationNames = this.spritesheetController.animationNames
    return animationNames.find(animation => animation === this.#selectedAnimation)
  }

  /**
   * Adds an option to the select menu for each animation. Call this before
   * calling start().
   */
  setupAnimationOptions() {
    const select = this.selectorElement
    const animationNames = this.spritesheetController.animationNames

    animationNames.forEach(animation => {
      const option = document.createElement('option')
      option.value = animation
      option.textContent = animation
      option.selected = animation === this.#selectedAnimation
      select.options.add(option)
    })
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
}

window.customElements.define('animation-preview', AnimationPreview)

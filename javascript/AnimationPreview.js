import animations from "./animations.js"

class AnimationPreview extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const wrapper = document.createElement('div')
    wrapper.part = 'base'

    const selectAnimationWrapper = document.createElement('div')
    selectAnimationWrapper.part = 'select-base'

    const label = document.createElement('span')
    label.textContent = 'Preview'
    label.part = 'select-label'

    const select = document.createElement('select')
    select.part = 'animation-select'

    animations.forEach(animation => {
      const option = document.createElement('option')
      option.value = animation.name
      option.textContent = animation.name
      option.selected = animation.name === this.#selectedAnimation
      select.options.add(option)
    })

    select.addEventListener('change', this.#updateSelectedAnimation)

    selectAnimationWrapper.append(label, select)
    wrapper.append(selectAnimationWrapper, this.#canvas)
    this.#canvas.part = 'animation'

    this.shadowRoot.append(wrapper)
  }

  #selectedAnimation = 'walk'
  #canvas = document.createElement('canvas')
  #ctx = this.#canvas.getContext('2d')

  #animationLoopId = undefined
  #animationStart = undefined
  #source = undefined
  #shadowRoot = undefined

  #currentFrameIndex = 0
  #framesPerSecond = 8
  #numberOfDirections = 4 // The number of directions a character can face in

  animationLength = 0
  frameSize = 64

  get source() { return this.#source }
  set source(newSource) {
    this.#source = newSource
  }

  get animation() {
    return animations.find(animation => animation.name === this.#selectedAnimation)
  }

  start() {
    this.animationLength = this.animation.width / this.frameSize
    this.#canvas.width = this.frameSize * this.#numberOfDirections
    this.#canvas.height = this.frameSize

    this.#animationStart = performance.now()
    this.#animationLoopId = requestAnimationFrame(this.#animate)
  }

  stop() {
    cancelAnimationFrame(this.#animationLoopId)
    this.#animationLoopId = undefined
  }

  restart() {
    this.stop()
    this.start()
  }

  /**
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

  #draw(frameIndex) {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

    for (let direction = 0; direction < this.#numberOfDirections; direction++) {
      const sx = this.animation.x + frameIndex * this.frameSize
      const sy = this.animation.y + direction * this.frameSize
      const dx = direction * this.frameSize
      const dy = 0 // Draw each direction in a horizontal row

      this.#ctx.drawImage(
        this.source,
        sx, sy, this.frameSize, this.frameSize,
        dx, dy, this.frameSize, this.frameSize
      )
    }
  }

  #updateSelectedAnimation = (event) => {
    this.#selectedAnimation = event.target.value

    if (this.#animationLoopId) {
      this.restart()
    }
  }
}

window.customElements.define('animation-preview', AnimationPreview)

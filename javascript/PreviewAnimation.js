export default class PreviewAnimation {
  currentFrameIndex = 0
  framesPerSecond = 8
  numberOfDirections = 4 // The number of directions a character can face in

  /**
   * @param {CanvasImageSource} source
   * @param {HTMLCanvasElement} destinationCanvas
   * @param {object} [options]
   * @param {number} [options.frameSize=64]
   */
  constructor(source, destinationCanvas, { frameSize = 64 } = {}) {
    this.source = source
    this.canvas = destinationCanvas
    this.ctx = destinationCanvas.getContext('2d')
    this.sourceFrameSize = frameSize
  }

  start() {
    this.length = this.source.width / this.sourceFrameSize
    this.canvas.width = this.sourceFrameSize * this.numberOfDirections
    this.canvas.height = this.sourceFrameSize

    this.animationStart = performance.now()
    this.animationLoopId = requestAnimationFrame(this.animate)
  }

  stop() {
    cancelAnimationFrame(this.animationLoopId)
  }

  /**
   * @param {DOMHighResTimeStamp} timestamp
   */
  animate = timestamp => {
    this.animationLoopId = requestAnimationFrame(this.animate)

    const timeSinceStart = timestamp - this.animationStart
    const nextFrameIndex = Math.floor(timeSinceStart / 1000 * this.framesPerSecond) % this.length

    if (nextFrameIndex === this.currentFrameIndex) return

    this.draw(nextFrameIndex)

    this.currentFrameIndex = nextFrameIndex
  }

  draw(frameIndex) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let direction = 0; direction < this.numberOfDirections; direction++) {
      const sx = frameIndex * this.sourceFrameSize
      const sy = direction * this.sourceFrameSize
      const dx = direction * this.sourceFrameSize
      const dy = 0 // Draw each direction in a horizontal row

      this.ctx.drawImage(
        this.source,
        sx, sy, this.sourceFrameSize, this.sourceFrameSize,
        dx, dy, this.sourceFrameSize, this.sourceFrameSize
      )
    }
  }
}

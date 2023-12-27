/**
 * One animation (cast, hurt, idle, etc.) for an element (body, hair, etc.) of
 * a spritesheet
 */
export default class SpritesheetElementAnimation {
  constructor(categoryName, animationName, imagePath, animationDefinition, frameSize = 64) {
    this.categoryName = categoryName
    this.name = animationName
    this.imagePath = imagePath
    this.animationDefinition = animationDefinition
    this.frameSize = frameSize
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
  }

  get inline() { return this.animationDefinition.inline }
  get columns() { return this.animationDefinition.columns }
  get rows() { return this.animationDefinition.rows }

  width(frameSize) { return this.columns * frameSize }
  height(frameSize) { return this.rows * frameSize }

  /**
   * Loads the image for this element's animation
   */
  async load() {
    const image = new Image()
    const animation = this.animationDefinition
    image.src = this.imagePath

    await image.decode()

    if (animation.width === undefined || image.width > animation.width) animation.width = image.width

    this.canvas.width = image.width
    this.canvas.height = image.height
    this.context.drawImage(image, 0, 0)

    this.originalImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
    this.recoloredImageData = new ImageData(this.originalImageData.width, this.originalImageData.height)
  }

  /**
   * Recolors the image
   *
   * @param {*} mapping
   */
  recolor(mapping) {
    this.recoloredImageData.data.set(this.originalImageData.data)
    const view = new DataView(this.originalImageData.data.buffer)

    for (let i = 0; i < this.originalImageData.data.length; i += 4) {
      const key = view.getUint32(i)
      const replacement = mapping[key]

      if (replacement) {
        this.recoloredImageData.data.set(replacement, i)
      }
    }

    this.context.putImageData(this.recoloredImageData, 0, 0)
  }

  /**
   * Adds the animation for this element to the spritesheet
   */
  draw(ctx, x = 0, y = 0, frameSize) {
    if (frameSize === this.frameSize) {
      ctx.drawImage(this.canvas, x, y)
    } else {
      this.drawWithDifferentFrameSize(ctx, x, y, frameSize)
    }
  }

  /**
   * Splits the image into individual frames and adds them to the spritesheet at
   * with different frame size than the source image
   */
  drawWithDifferentFrameSize(ctx, x = 0, y = 0, targetFrameSize) {
    const sourceFrameSize = this.frameSize
    const columns = this.columns
    const rows = this.rows

    const centerOffset = Math.ceil(Math.abs(targetFrameSize - sourceFrameSize) / 2)

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const targetFrameX = x + (targetFrameSize * column) + centerOffset
        const targetFrameY = y + (targetFrameSize * row) + centerOffset
        const sourceFrameX = sourceFrameSize * column
        const sourceFrameY = sourceFrameSize * row

        ctx.drawImage(
          this.canvas,
          sourceFrameX,
          sourceFrameY,
          sourceFrameSize,
          sourceFrameSize,
          targetFrameX,
          targetFrameY,
          sourceFrameSize,
          sourceFrameSize
        )
      }
    }
  }
}

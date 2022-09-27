/**
 * One animation (cast, hurt, idle, etc.) for an element (body, hair, etc.) of
 * a spritesheet
 */
export default class SpritesheetElementAnimation {
  constructor(categoryName, variant, spritesheetDefinition, animationDefinition) {
    this.categoryName = categoryName
    this.variant = variant
    this.spritesheetDefinition = spritesheetDefinition
    this.animationDefinition = animationDefinition
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
  }

  /**
   * Loads the image for this element's animation
   */
  async load() {
    const categoryName = this.categoryName
    const animation = this.animationDefinition
    const variant = this.variant
    const image = new Image()
    image.src = `resources/spritesheets/${categoryName}/${animation.name}/${variant}.png`
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
   *
   * @param {*} ctx
   */
  draw(ctx) {
    ctx.drawImage(this.canvas, this.animationDefinition.x, this.animationDefinition.y)
  }
}

/**
 * One animation (cast, hurt, idle, etc.) for an element (body, hair, etc.) of
 * a spritesheet
 */
export default class SpritesheetElementAnimation {
  constructor(category, variant, spritesheetDefinition, animationDefintion) {
    this.category = category
    this.variant = variant
    this.spritesheetDefinition = spritesheetDefinition
    this.animationDefintion = animationDefintion
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
  }

  async load() {
    const category = this.category
    const animation = this.animationDefintion
    const variant = this.variant
    const image = new Image()
    image.src = `resources/spritesheets/${category}/${animation.name}/${variant}.png`
    await image.decode()
    animation.width = image.width

    this.canvas.width = image.width
    this.canvas.height = image.height
    this.context.drawImage(image, 0, 0)

    this.originalImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
    this.recoloredImageData = new ImageData(this.originalImageData.width, this.originalImageData.height)
  }

  recolor(mapping) {
    this.recoloredImageData.data.set(this.originalImageData.data)

    for (let i = 0; i < this.originalImageData.data.length; i += 4) {
      const originalRGBA = this.originalImageData.data.slice(i, i + 4)
      const hex = this.rgbToHex(originalRGBA.slice(0, 3))
      const replacement = mapping[hex]

      if (replacement) {
        const replacementRGB = this.hexToRGB(replacement)
        const replacementRGBA = [...replacementRGB, 255]
        this.recoloredImageData.data.set(replacementRGBA, i)
      }
    }

    this.context.putImageData(this.recoloredImageData, 0, 0)
  }

  hexToRGB(hexCode) {
    const colorOffsets = [
      [1, 3], // r
      [3, 5], // g
      [5, 7], // b
    ]

    return colorOffsets.map(([start, end]) => parseInt(hexCode.slice(start, end), 16))
  }

  rgbToHex(rgbArray) {
    return `#${[...rgbArray].map(i => i.toString(16).padStart(2, '0')).join('')}`.toLowerCase()
  }

  draw(ctx) {
    ctx.drawImage(this.canvas, this.animationDefintion.x, this.animationDefintion.y)
  }
}

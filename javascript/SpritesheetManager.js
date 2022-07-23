import animations from "./animations.js"

export default class SpritesheetManager {
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
  }

  optionManager() {
    return this.characterGenerator.optionManager
  }

  async update() {
    const canvas = document.getElementById('spritesheet')

    // TODO: set width and height dynamically based on the animations displayed
    canvas.width = 832
    canvas.height = 1344

    const context = canvas.getContext('2d')

    const categories = this.optionManager().optionCategories()

    await Promise.all(categories.map(async category => {
      await Promise.all(animations.map(async animation => {
        const selectedItem = this.optionManager().getSelectedOption(category)
        if (selectedItem === 'none') return

        const image = new Image()
        image.src = `resources/spritesheets/${category}/${animation.name}/${selectedItem}.png`
        await image.decode()
        animation.width = image.width

        context.drawImage(image, animation.x, animation.y)
      }))
    }))

    this.canvas = canvas
  }

  getCanvasBlob() {
    return new Promise(resolve => {
      this.canvas.toBlob(resolve, 'image/png')
    })
  }

  async getPNG() {
    const blob = await this.getCanvasBlob()

    const arrayBuffer = await blob.arrayBuffer()
    return new Uint8Array(arrayBuffer)
  }
}

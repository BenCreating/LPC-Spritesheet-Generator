/**
 * @typedef {import('./CharacterGenerator').default} CharacterGenerator
 */
import animations from "./animations.js"
import SpritesheetElement from "./SpritesheetElement.js"

export default class SpritesheetManager {
  /**
   * @param {CharacterGenerator} characterGenerator
   */
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
    this.canvas = document.getElementById('spritesheet')
  }

  get sheetDefinitions() { return this.characterGenerator.sheetDefinitions }
  get colorManager() { return this.characterGenerator.colorManager }

  optionManager() {
    return this.characterGenerator.optionManager
  }

  async update() {
    // TODO: set width and height dynamically based on the animations displayed
    this.canvas.width = 832
    this.canvas.height = 1344

    const categories = this.optionManager().optionCategories()

    this.spritesheetElements = categories.map((category, layer) => {
      const selectedItem = this.optionManager().getSelectedOption(category)
      if (selectedItem === 'none') return

      const definition = this.sheetDefinitions[category][selectedItem]

      return new SpritesheetElement(category, selectedItem, definition, layer, animations)
    }).filter(item => item)

    await Promise.all(this.spritesheetElements.map(element => {
      return element.load()
    }))

    this.spritesheetElements.sort(SpritesheetElement.layerComparitor)
    this.applyRecolor()
  }

  applyRecolor() {
    this.spritesheetElements.forEach(element => {
      const category = element.category
      const mapping = this.colorManager.getRecolor(category)
      element.recolor(mapping)
    })
    this.draw()
  }

  draw() {
    const context = this.canvas.getContext('2d')
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.spritesheetElements.forEach(element => element.draw(context))
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

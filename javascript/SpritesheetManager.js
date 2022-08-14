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
  get optionManager() { return this.characterGenerator.optionManager }

  async update() {
    // TODO: set width and height dynamically based on the animations displayed
    this.canvas.width = 832
    this.canvas.height = 1344

    const categories = this.optionManager.categories

    this.spritesheetElements = categories.map((category, layer) => {
      const selectedOption = category.selectedOption
      if (selectedOption.name === 'none') return

      const definition = this.sheetDefinitions[category.name][selectedOption.name]

      return new SpritesheetElement(category.name, selectedOption.name, definition, layer, animations)
    }).filter(item => item)

    await Promise.all(this.spritesheetElements.map(element => {
      return element.load()
    }))

    this.spritesheetElements.sort(SpritesheetElement.layerComparitor)
    this.applyRecolor()
  }

  applyRecolor() {
    this.spritesheetElements.forEach(element => {
      const category = this.optionManager.lookupCategoryByName(element.categoryName)
      const mapping = category.getRecolor()
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

/**
 * @typedef {import('./CharacterGenerator').default} CharacterGenerator
 */
import AssetCategory from './AssetCategory.js'

export default class OptionController {
  /**
   * @param {CharacterGenerator} characterGenerator
   */
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
  }

  get urlParameterController() { return this.characterGenerator.urlParameterController }
  get spritesheetController() { return this.characterGenerator.spritesheetController }
  get attributionController() { return this.characterGenerator.attributionController }
  get sheetDefinitions() { return this.characterGenerator.sheetDefinitions }
  get paletteDefinitions() { return this.characterGenerator.paletteDefinitions }

  update() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.innerHTML = ''

    this.buildOptionsHTML()
  }

  async setupOptionButtons() {
    const categoryNames = Object.keys(this.sheetDefinitions)
    this.categories = categoryNames.map(categoryName => {
      const categoryData = this.sheetDefinitions[categoryName]
      const urlParameterSelectedOption = this.urlParameterController.getParameterValue(categoryName)

      return new AssetCategory(this, categoryName, categoryData, urlParameterSelectedOption)
    })

    await this.loadIcons()

    this.buildOptionsHTML()
  }

  async loadIcons() {
    const options = this.categories.flatMap(category => category.options)

    await Promise.all(options.map(option => {
      return option.loadIcon()
    }))
  }

  buildOptionsHTML() {
    const sidebar = document.querySelector('.sidebar')

    this.categories.forEach(category => {
      sidebar.appendChild(category.html())
    })
  }

  /**
   * Returns the selected option for a category
   *
   * @param {string} categoryName
   * @returns {AssetOption} the selected option
   */
  getSelectedOption(categoryName) {
    const category = this.lookupCategoryByName(categoryName)
    return category.selectedOption
  }

  /**
   * Returns an array of all selected options
   *
   * @returns {AssetOption[]}
   */
  selectedOptions() {
    return this.categories.map(category => category.selectedOption)
  }

  /**
   * Returns an array of all tags for the selected options
   *
   * @returns {string[]}
   */
  selectedTags() {
    const tags = this.categories.flatMap(category => category.tags())
    const uniqueTags = new Set(tags)

    return [...uniqueTags]
  }

  /**
   * Finds the AssetCategory matching the category name
   *
   * @param {string} categoryName
   * @returns {AssetCategory}
   */
  lookupCategoryByName(categoryName) {
    return this.categories.find(category => category.name === categoryName)
  }

  /**
   * Called whenever a new color is selected
   *
   * @param {Palette} palette the palette that the selected color belongs to
   */
  colorChanged(palette, applyRecolor = true) {
    this.urlParameterController.setURLParameters({ name: palette.urlParameterKey(), value: palette.indexOfSelectedColorRamp() })
    if (applyRecolor) this.spritesheetController.applyRecolor()
  }

  /**
   * Randomly picks options and colors for the spritesheet
   */
  randomize() {
    this.categories.forEach(category => category.randomize())

    this.update()
    this.spritesheetController.update()
    this.attributionController.update()
  }
}

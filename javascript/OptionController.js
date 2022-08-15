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

  setupOptionButtons() {
    const categoryNames = Object.keys(this.sheetDefinitions)
    this.categories = categoryNames.map(categoryName => {
      const categoryData = this.sheetDefinitions[categoryName]
      const urlParameterSelectedOption = this.urlParameterController.getParameterValue(categoryName)

      return new AssetCategory(this, categoryName, categoryData,urlParameterSelectedOption)
    })

    this.buildOptionsHTML()
  }

  buildOptionsHTML() {
    const sidebar = document.querySelector('.sidebar')

    this.categories.forEach(category => {
      sidebar.appendChild(category.html())
    })
  }

  getSelectedOption(categoryName) {
    const category = this.lookupCategoryByName(categoryName)
    return category.selectedOption
  }

  selectedOptions() {
    return this.categories.map(category => category.selectedOption)
  }

  selectedTags() {
    const tags = this.categories.flatMap(category => category.tags())
    const uniqueTags = new Set(tags)

    return [...uniqueTags]
  }

  lookupCategoryByName(categoryName) {
    return this.categories.find(category => category.name === categoryName)
  }

  colorChanged(palette) {
    this.urlParameterController.setURLParameters({ name: palette.urlParameterKey(), value: palette.indexOfSelectedColorRamp() })
    this.spritesheetController.applyRecolor()
  }
}

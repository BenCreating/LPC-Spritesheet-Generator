/**
 * @typedef {import('./CharacterGenerator').default} CharacterGenerator
 */
import AssetCategory from './AssetCategory.js'

export default class OptionManager {
  /**
   * @param {CharacterGenerator} characterGenerator
   */
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
  }

  get urlParameterManager() { return this.characterGenerator.urlParameterManager }
  get spritesheetManager() { return this.characterGenerator.spritesheetManager }
  get attributionManager() { return this.characterGenerator.attributionManager }
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
      const urlParameterSelectedOption = this.urlParameterManager.getParameterValue(categoryName)

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
    this.urlParameterManager.setURLParameters({ name: palette.urlParameterKey(), value: palette.indexOfSelectedColorRamp() })
    this.spritesheetManager.applyRecolor()
  }
}

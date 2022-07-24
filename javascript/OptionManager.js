export default class OptionManager {
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
  }

  get urlParameterManager() { return this.characterGenerator.urlParameterManager }
  get spritesheetManager() { return this.characterGenerator.spritesheetManager }
  get attributionManager() { return this.characterGenerator.attributionManager }
  get sheetDefinitions() { return this.characterGenerator.sheetDefinitions }
  get colorManager() { return this.characterGenerator.colorManager }

  setupOptionButtons() {
    this.buildOptionsHTML()
  }

  buildOptionsHTML() {
    const sidebar = document.querySelector('.sidebar')

    this.optionCategories().forEach(categoryName => {
      const category = this.buildCategory(categoryName)
      sidebar.appendChild(category)
    })
  }

  buildCategory(category) {
    const categoryContainer = document.createElement('fieldset')
    categoryContainer.id = `${category}-options`
    const categoryLabel = document.createElement('legend')
    categoryLabel.textContent = category
    categoryContainer.appendChild(categoryLabel)

    const radioButton = this.buildRadioButton(category, 'none', true)
    categoryContainer.appendChild(radioButton)

    const sheetDefinitions = this.sheetDefinitions

    const options = Object.keys(sheetDefinitions[category])
    options.forEach(option => {
      const isDefault = sheetDefinitions[category][option]['default']
      const radioButton = this.buildRadioButton(category, option, isDefault)
      categoryContainer.appendChild(radioButton)
    })

    return categoryContainer
  }

  buildRadioButton(category, option, checked = false) {
    const radioButton = document.createElement('input')
    radioButton.setAttribute('type', 'radio')
    radioButton.setAttribute('name', category)
    radioButton.setAttribute('value', option)
    radioButton.addEventListener('click', this.selectOption.bind(this))

    radioButton.checked = checked

    const radioButtonContainer = document.createElement('label')
    radioButtonContainer.textContent = option
    radioButtonContainer.appendChild(radioButton)

    return radioButtonContainer
  }

  selectOption(event) {
    const option = event.target

    this.urlParameterManager.setURLParameters(option)
    this.spritesheetManager.update()
    this.attributionManager.update()
    this.colorManager.update(option.name)
  }

  getSelectedOption(categoryName) {
    const selectedButton = document.querySelector(`.sidebar input[type=radio][name=${categoryName}]:checked`)
    return selectedButton.value
  }

  optionCategories() {
    return Object.keys(this.sheetDefinitions)
  }
}

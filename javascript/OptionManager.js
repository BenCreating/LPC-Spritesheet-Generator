export default class OptionManager {
  constructor(characterGenerator) {
    this._characterGenerator = characterGenerator

    window.addEventListener('popstate', () => {
      this.setOptions(this.urlParameterManager().getURLParameters())
    })
  }

  characterGenerator() {
    return this._characterGenerator
  }

  urlParameterManager() {
    return this.characterGenerator().urlParameterManager()
  }

  spritesheetManager() {
    return this.characterGenerator().spritesheetManager()
  }

  async setupOptionButtons(urlParameters = {}) {
    await this.loadSheetDefinitions()

    this.buildOptionsHTML()
    this.setOptions(urlParameters)
  }

  buildOptionsHTML() {
    const sheetDefinitions = this.sheetDefinitions
    this.optionCategories = Object.keys(sheetDefinitions)

    const sidebar = document.querySelector('.sidebar')

    this.optionCategories.forEach(categoryName => {
      const category = this.buildCategory(categoryName)
      sidebar.appendChild(category)
    })
  }

  buildCategory(category) {
    const categoryContainer = document.createElement('fieldset')
    const categoryLabel = document.createElement('legend')
    categoryLabel.textContent = category
    categoryContainer.appendChild(categoryLabel)

    const radioButton = this.buildRadioButton(category, 'none', true)
    categoryContainer.appendChild(radioButton)

    const options = Object.keys(this.sheetDefinitions[category])
    options.forEach(option => {
      const isDefault = this.sheetDefinitions[category][option]['default']
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

  async loadSheetDefinitions() {
    const response = await fetch('resources/sheet-definitions.json')

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

    this.sheetDefinitions = await response.json()
  }

  selectOption(event) {
    const option = event.target

    this.urlParameterManager().setURLParameters(option)
    this.spritesheetManager().update()
  }

  setOptions(urlParameters = {}) {
    const optionNames = [...urlParameters.keys()]

    optionNames.forEach(name => {
      const value = urlParameters.get(name)
      const radioButton = document.querySelector(`.sidebar input[type=radio][name=${name}][value=${value}]`)
      if (radioButton) radioButton.checked = true
    })
  }

  getSelectedOption(categoryName) {
    const selectedButton = document.querySelector(`.sidebar input[type=radio][name=${categoryName}]:checked`)
    return selectedButton.value
  }

  categories() {
    // TODO: fix sheetDefinitions being undefined the first time this is called
    const sheetDefinitions = this.sheetDefinitions ?? {}
    return Object.keys(sheetDefinitions)
  }
}

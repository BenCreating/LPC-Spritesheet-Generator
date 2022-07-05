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

  setupOptionButtons() {
    const buttons = document.querySelectorAll('.sidebar input[type=radio]')

    buttons.forEach(button => {
      button.addEventListener('click', this.selectOption.bind(this))
    })
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
    const buttons = [...document.querySelectorAll('.sidebar input[type=radio]')]
    const categoryNames = buttons.map(button => button.name)

    const uniqueCategories = new Set(categoryNames)

    return [...uniqueCategories]
  }
}

export default class OptionManager {
  constructor(urlParameterManager, spritesheetManager) {
    this._urlParameterManager = urlParameterManager
    this._spritesheetManager = spritesheetManager
  }

  urlParameterManager() {
    return this._urlParameterManager
  }

  spritesheetManager() {
    return this._spritesheetManager
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
      radioButton.checked = true
    })
  }
}
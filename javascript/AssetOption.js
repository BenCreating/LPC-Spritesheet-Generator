import Attribution from './Attribution.js'

export default class AssetOption {
  constructor(name, category, optionData = {}) {
    this.name = name
    this.category = category

    this.default = optionData['default'] ?? false
    this.tags = optionData['tags'] ?? []
    this.excludedBy = optionData['excluded-by'] ?? []
    this.palettes = optionData['palettes'] ?? []

    this.attribution = new Attribution(this, optionData)
  }

  isAvailable(selectedTags) {
    const excludedByTags = this.excludedBy
    return !excludedByTags.find(excludedTag => selectedTags.includes(excludedTag))
  }

  html() {
    const name = this.name

    const radioButton = document.createElement('input')
    radioButton.setAttribute('type', 'radio')
    radioButton.setAttribute('name', this.category.name)
    radioButton.setAttribute('value', name)
    radioButton.addEventListener('click', this.selectOption.bind(this))

    radioButton.checked = this === this.category.selectedOption

    const radioButtonContainer = document.createElement('label')
    radioButtonContainer.textContent = name
    radioButtonContainer.appendChild(radioButton)

    return radioButtonContainer
  }

  selectOption(_event) {
    this.category.setSelectedOption(this)
  }

  attributionHTML() {
    return this.attribution.html()
  }

  attributionPlainText() {
    return this.attribution.plainText()
  }

  authors() {
    return this.attribution.authors
  }
}
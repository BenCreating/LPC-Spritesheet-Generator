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
    const buttonId = `option-${this.category.name}-${name}`

    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'item-button'

    const radioButton = document.createElement('input')
    radioButton.setAttribute('type', 'radio')
    radioButton.setAttribute('name', this.category.name)
    radioButton.setAttribute('value', name)
    radioButton.id = buttonId
    radioButton.addEventListener('click', this.selectOption.bind(this))
    buttonContainer.appendChild(radioButton)

    radioButton.checked = this === this.category.selectedOption

    const label = document.createElement('label')
    label.htmlFor = buttonId
    buttonContainer.appendChild(label)

    if (this.icon) label.appendChild(this.icon)

    const labelText = document.createElement('span')
    labelText.textContent = name
    label.appendChild(labelText)

    return buttonContainer
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

  async loadIcon() {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64

    const image = new Image()
    let frameOffsetY = 0

    if (this.name === 'none') {
      image.src = `resources/none.png`
    } else {
      const categoryName = this.category.name
      image.src = `resources/spritesheets/${categoryName}/idle/${this.name}.png`
      frameOffsetY = -128
    }

    await image.decode()

    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, frameOffsetY)

    this.icon = canvas
  }

}
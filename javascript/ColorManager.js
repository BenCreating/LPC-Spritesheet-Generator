export default class ColorManager {
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
  }

  get urlParameterManager() { return this.characterGenerator.urlParameterManager }
  get optionManager() { return this.characterGenerator.optionManager }
  get sheetDefinitions() { return this.characterGenerator.sheetDefinitions }
  get paletteDefinitions() { return this.characterGenerator.paletteDefinitions }

  update(category) {
    this.buildCategoryColors(category)
  }

  buildCategoryColors(category) {
    const colorsContatinerID = `${category}-colors`
    const previousColors = document.getElementById(colorsContatinerID)
    if (previousColors) previousColors.remove()

    const colorsContainer = document.createElement('div')
    colorsContainer.id = colorsContatinerID

    const categoryContainer = document.getElementById(`${category}-options`)
    categoryContainer.prepend(colorsContainer)

    const palettes = this.palettesForCategory(category)

    palettes.forEach(palette => {
      const paletteContainer = document.createElement('fieldset')
      const paletteLabel = document.createElement('legend')
      paletteLabel.textContent = palette
      paletteContainer.appendChild(paletteLabel)

      const paletteColorRamps = this.paletteDefinitions[palette]

      paletteColorRamps.forEach((ramp, index) => {
        const checked = index === 0
        const radioButton = this.buildRadioButton(category, palette, ramp, index, checked)
        paletteContainer.appendChild(radioButton)
      })

      colorsContainer.appendChild(paletteContainer)
    })


    return categoryContainer
  }

  buildRadioButton(category, palette, ramp, rampIndex, checked = false) {
    const radioButton = document.createElement('input')
    radioButton.setAttribute('type', 'radio')
    radioButton.setAttribute('name', `${category}-color-${palette}`)
    radioButton.setAttribute('value', rampIndex)
    radioButton.addEventListener('click', this.selectColor.bind(this))

    radioButton.checked = checked

    radioButton.className = 'color-option'
    radioButton.style.backgroundColor = ramp[0]
    radioButton.style.borderColor = ramp[1]

    return radioButton
  }

  selectColor(event) {
    const color = event.target

    this.urlParameterManager.setURLParameters(color)
  }

  setupColorButtons() {
    const categories = this.optionManager.optionCategories()

    categories.forEach(category => {
      this.buildCategoryColors(category)
    })
  }

  palettesForCategory(category) {
    const sheetDefinitions = this.sheetDefinitions
    const selectedOption = this.optionManager.getSelectedOption(category)

    if (selectedOption === 'none') return []

    return sheetDefinitions[category][selectedOption].palettes
  }
}

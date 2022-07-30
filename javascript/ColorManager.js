/**
 * @typedef {import('./CharacterGenerator').default} CharacterGenerator
 */

export default class ColorManager {
  /**
   * @param {CharacterGenerator} characterGenerator
   */
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
  }

  get urlParameterManager() { return this.characterGenerator.urlParameterManager }
  get optionManager() { return this.characterGenerator.optionManager }
  get spritesheetManager() { return this.characterGenerator.spritesheetManager }
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
    this.spritesheetManager.applyRecolor()
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

  getSelectedRampIndex(category, palette) {
    const inputName = `${category}-color-${palette}`
    const radioButton = document.querySelector(`input[type=radio][name="${inputName}"]:checked`)
    return parseInt(radioButton.value, 10)
  }

  getRecolor(category) {
    const paletteNames = this.palettesForCategory(category)
    const recolor = {}

    paletteNames.forEach(palette => {
      const paletteColorRamps = this.paletteDefinitions[palette]
      const selectedRampIndex = this.getSelectedRampIndex(category, palette)
      if (selectedRampIndex === 0) return // no recolor

      const originalRamp = paletteColorRamps[0]
      const newRamp = paletteColorRamps[selectedRampIndex]

      originalRamp.forEach((originalColor, index) => {
        recolor[originalColor.toLowerCase()] = newRamp[index]
      })
    })

    return recolor
  }
}

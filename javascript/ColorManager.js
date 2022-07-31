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
    colorsContainer.className = 'item-color-options'

    const categoryContainer = document.getElementById(`${category}-options`)
    categoryContainer.prepend(colorsContainer)

    const palettes = this.palettesForCategory(category)

    palettes.forEach(palette => {
      const paletteContainer = document.createElement('fieldset')
      const paletteLabel = document.createElement('legend')
      paletteLabel.textContent = palette
      paletteContainer.appendChild(paletteLabel)

      const paletteColorRamps = this.paletteDefinitions[palette]

      const urlParameterName = this.urlParameterName(category, palette)
      const parameterValue = this.urlParameterManager.getParameterValue(urlParameterName)
      const selectedRamp = Number(parameterValue) || 0

      paletteColorRamps.forEach((ramp, index) => {
        const checked = index === selectedRamp
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
    radioButton.setAttribute('name', this.urlParameterName(category, palette))
    radioButton.setAttribute('value', rampIndex)
    radioButton.addEventListener('click', this.selectColor.bind(this))

    radioButton.checked = checked

    radioButton.className = 'color-option'
    radioButton.style.backgroundColor = ramp[0]
    radioButton.style.borderColor = ramp[1]

    return radioButton
  }

  urlParameterName(category, palette) {
    return `${category}-color-${palette}`
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
    const inputName = this.urlParameterName(category, palette)
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
        // Regular Number gives negatives with some left shifts, but BigInt
        // behaves correctly. Key is RGBA because that's what a DataView can
        // pull from an array buffer in a single operation.
        const [r, g, b] = this.hexToRGB(originalColor).map(n => BigInt(n))
        const key = (r << 24n) + (g << 16n) + (b << 8n) + 255n
        recolor[key] = this.hexToRGB(newRamp[index])
      })
    })

    return recolor
  }

  hexToRGB(hexCode) {
    const colorOffsets = [
      [1, 3], // r
      [3, 5], // g
      [5, 7], // b
    ]

    return colorOffsets.map(([start, end]) => parseInt(hexCode.slice(start, end), 16))
  }
}

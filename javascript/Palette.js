import ColorRamp from './ColorRamp.js'
import PaletteMatchRamp from './PaletteMatchRamp.js'

/**
 * A collection of color ramps
 */
export default class Palette {
  constructor(category, name, colorRamps, matchCategory) {
    this.categoryName = category.name
    this.optionController = category.optionController

    this.name = name
    this.colorRamps = colorRamps.map(colorRamp => new ColorRamp(this, colorRamp))
    this.originalColorRamp = this.colorRamps[0]

    if (matchCategory) {
      this.colorRamps.unshift(new PaletteMatchRamp(this, matchCategory))
    }

    const urlParameterController = this.optionController.urlParameterController
    const preselectedColorRampIndex = urlParameterController.getParameterValue(this.urlParameterKey())
    this.selectedColorRamp = this.colorRamps[preselectedColorRampIndex] ?? this.colorRamps[0]
  }

  html() {
    const container = document.createElement('fieldset')

    const label = document.createElement('legend')
    label.textContent = this.name
    container.appendChild(label)

    this.colorRamps.forEach(colorRamp => {
      const colorRampHTML = colorRamp.html()

      container.appendChild(colorRampHTML)
    })

    return container
  }

  /**
   * Sets the selected color ramp
   *
   * @param {ColorRamp} colorRamp
   * @param {Boolean} applyRecolor controls if a recolor will be triggered. Defaults to true
   */
  setSelectedColorRamp(colorRamp, applyRecolor = true) {
    this.selectedColorRamp = colorRamp
    this.optionController.colorChanged(this, applyRecolor)
  }

  urlParameterKey() {
    return `${this.categoryName}-color-${this.name}`
  }

  indexOfColorRamp(colorRamp) {
    return this.colorRamps.findIndex(ramp => ramp === colorRamp)
  }

  indexOfSelectedColorRamp() {
    return this.indexOfColorRamp(this.selectedColorRamp)
  }

  /**
   * Randomly picks a color ramp
   */
  randomize() {
    const colorRamps = this.colorRamps
    const chosenColorRampIndex = Math.floor(Math.random() * colorRamps.length)
    const colorRamp = colorRamps[chosenColorRampIndex]

    this.setSelectedColorRamp(colorRamp, false)
  }
}

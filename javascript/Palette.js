import ColorRamp from './ColorRamp.js'

export default class Palette {
  constructor(category, name, colorRamps) {
    this.categoryName = category.name
    this.optionManager = category.optionManager

    this.name = name
    this.colorRamps = colorRamps.map(colorRamp => new ColorRamp(this, colorRamp))

    const urlParameterManager = this.optionManager.urlParameterManager
    const preselectedColorRampIndex = urlParameterManager.getParameterValue(this.urlParameterKey())
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

  setSelectedColorRamp(colorRamp) {
    this.selectedColorRamp = colorRamp
    this.optionManager.colorChanged(this)
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
}

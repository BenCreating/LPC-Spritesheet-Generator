export default class ColorRamp {
  constructor(palette, colors) {
    this.palette = palette
    this.colors = colors
  }

  html() {
    const checked = this === this.palette.selectedColorRamp

    const radioButton = document.createElement('input')
    radioButton.setAttribute('type', 'radio')
    radioButton.setAttribute('name', this.palette.urlParameterKey())
    radioButton.setAttribute('value', this.palette.indexOfColorRamp(this))
    radioButton.addEventListener('click', this.selectColor.bind(this))

    radioButton.checked = checked

    radioButton.className = 'color-option'
    radioButton.style.backgroundColor = this.colors[0]
    radioButton.style.borderColor = this.colors[1]

    return radioButton
  }

  selectColor(_event) {
    this.palette.setSelectedColorRamp(this)
  }
}

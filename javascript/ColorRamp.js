/**
 * @typedef {import('./Palette.js').default} Palette
 */

/**
 * A set of colors used to recolor an asset
 */
export default class ColorRamp {
  /**
   * @param {Palette} palette the palette this color ramp is part of
   * @param {string} name the name of the color ramp
   * @param {string[]} colors an array of colors in hexcode format
   */
  constructor(palette, name, colors) {
    this.palette = palette
    this.name = name
    this.colors = colors
  }

  /**
   * The HTML for this color option
   *
   * @returns {HTMLElement}
   */
  html() {
    const checked = this === this.palette.selectedColorRamp

    const radioButton = document.createElement('input')
    radioButton.setAttribute('type', 'radio')
    radioButton.setAttribute('name', this.palette.urlParameterKey())
    radioButton.setAttribute('value', this.name)
    radioButton.addEventListener('click', this.selectColor.bind(this))

    radioButton.checked = checked

    radioButton.className = 'color-option'
    radioButton.style.backgroundColor = this.colors[0]
    radioButton.style.borderColor = this.colors[1]

    return radioButton
  }

  /**
   * Called when the user clicks on a color to select it
   *
   * @param {Event} _event
   */
  selectColor(_event) {
    this.palette.setSelectedColorRamp(this)
  }
}

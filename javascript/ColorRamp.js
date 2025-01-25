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
    this.colorList = colors
  }

  get colors() {
    return this.colorList
  }

  /**
   * Called when the user clicks on a color to select it
   *
   * @param {Event} _event
   */
  selectColor(_event) {
    this.palette.setSelectedColorRamp(this)
  }

  isSelected() {
    return this === this.palette.selectedColorRamp
  }
}

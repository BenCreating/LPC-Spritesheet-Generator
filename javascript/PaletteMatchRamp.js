/**
 * @typedef {import('./Palette.js').default} Palette
 */

/**
 * A special color option that matches the palette of another selection
 */
export default class PaletteMatchRamp {
  /**
   * @param {Palette} palette the palette this color ramp is part of
   * @param {string} matchCategoryName the name of the category to match
   */
  constructor(palette, matchCategoryName) {
    this.palette = palette
    this.name = `match-${matchCategoryName}`
    this.matchCategoryName = matchCategoryName
  }

  matchCategory() {
    const allCategories = this.palette.optionController.categories
    return allCategories.find(category => category.name === this.matchCategoryName)
  }

  get colors() {
    const paletteName = this.palette.name
    const categoryPalettes = this.matchCategory().selectedPalettes()
    const matchPalette = categoryPalettes.find(palette => palette.name === paletteName)

    if (!matchPalette) return this.palette.originalColorRamp.colors

    return matchPalette.selectedColorRamp.colors
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

    radioButton.className = 'color-option palette-match-option'
    radioButton.style.backgroundColor = '#ffffff'
    radioButton.style.borderColor = '#000000'

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

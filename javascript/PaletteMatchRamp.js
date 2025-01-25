import ColorRamp from './ColorRamp.js'

/**
 * @typedef {import('./Palette.js').default} Palette
 */

/**
 * A special color option that matches the palette of another selection
 */
export default class PaletteMatchRamp extends ColorRamp {
  /**
   * @param {Palette} palette the palette this color ramp is part of
   * @param {string} matchCategoryName the name of the category to match
   */
  constructor(palette, matchCategoryName) {
    super(palette, `match-${matchCategoryName}`)
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
}

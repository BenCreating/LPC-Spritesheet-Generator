import AssetOption from './AssetOption.js'
import Palette from './Palette.js'

/**
 * A category (Body, Hair, etc.) containing many options
 */
export default class AssetCategory {
  /**
   * @param {OptionController} optionController
   * @param {string} categoryName
   * @param {Object} categoryData the sheet definition data for this category
   * @param {string} preselectedOptionName the option selected on page load
   */
  constructor(optionController, categoryName, categoryData, preselectedOptionName) {
    this.optionController = optionController
    this.name = categoryName
    this.zPosition = this.categoryDefinitions[categoryName].z_position ?? 15
    this.paletteMatch = this.categoryDefinitions[categoryName]['palette-match'] ?? {}

    const optionNames = Object.keys(categoryData)
    this.options = optionNames.map(name => {
      const optionData = categoryData[name]

      if (!this.optionHasAttribution(name, optionData)) return undefined

      return new AssetOption(name, this, optionData)
    }).filter(option => option)
    this.options.unshift(new AssetOption('none', this))

    const preselectedOption = this.options.find(option => option.name === preselectedOptionName)
    this.selectedOption = preselectedOption ?? this.defaultOption() ?? this.options[0]

    this.palettes = this.createPalettes()
  }

  get urlParameterController() { return this.optionController.urlParameterController }
  get spritesheetController() { return this.optionController.spritesheetController }
  get attributionController() { return this.optionController.attributionController }
  get paletteDefinitions() { return this.optionController.paletteDefinitions }
  get categoryDefinitions() { return this.optionController.categoryDefinitions }

  categoryId() {
    return `${this.name}-category`
  }

  /**
   * Returns the tags for the selected option
   *
   * @returns {string[]}
   */
  tags() {
    return this.selectedOption.tags
  }

  /**
   * Returns the tags for the selected options of all categories
   *
   * @returns {string[]}
   */
  allCategoryTags() {
    return this.optionController.selectedTags()
  }

  /**
   * Returns an array of authors who created of the selected option
   * @returns {string[]}
   */
  authors() {
    return this.selectedOption.authors()
  }

  /**
   * Returns an array of all options that have not been excluded by the active
   * tags
   *
   * @returns {AssetOption[]}
   */
  availableOptions() {
    const tags = this.allCategoryTags()
    return this.options.filter(option => option.isAvailable(tags))
  }

  /**
   * Called when the user selects an option belonging to this category
   *
   * @param {AssetOption} option
   * @param {Boolean} redrawSpritesheet controls if a redraw will be triggered. Defaults to true
   */
  async setSelectedOption(option, redrawSpritesheet = true) {
    this.selectedOption = option
    this.urlParameterController.setURLParameters({ name: this.name, value: option.name })

    if (redrawSpritesheet) {
      this.optionController.fixExcludedOptions(this)
      await this.spritesheetController.update()
      this.attributionController.update()
      this.optionController.updatePreviewFrameSize()
    }
  }

  /**
   * Gets the option marked as the default (if there is one). If there is more
   * than one option marked as default, it will return the first.
   *
   * @returns {AssetOption|undefined}
   */
  defaultOption() {
    return this.options.find(option => option.default)
  }

  /**
   * Returns the names of the palettes of the selected option
   *
   * @returns {string[]}
   */
  selectedPaletteNames() {
    return this.selectedOption.palettes
  }

  /**
   * Returns the palettes of the selected option
   *
   * @returns {Palette[]}
   */
  selectedPalettes() {
    const selectedPaletteNames = this.selectedPaletteNames()

    const palettes = []
    selectedPaletteNames.forEach(name => {
      const palette = this.palettes[name]
      if (palette) palettes.push(palette)
    })

    return palettes
  }

  /**
   * Checks if an option has all the required attribution data and reports if it
   * does not
   *
   * @param {Object} optionData
   */
  optionHasAttribution(optionName, optionData) {
    const authors = optionData.authors ?? []
    const licenses = optionData.licenses ?? []
    const links = optionData.links ?? []

    const missingAttributionWarnings = []
    if (authors.length === 0) missingAttributionWarnings.push('authors')
    if (licenses.length === 0) missingAttributionWarnings.push('licenses')
    if (links.length === 0) missingAttributionWarnings.push('links')

    if (missingAttributionWarnings.length > 0) {
      console.warn(`${this.name}: ${optionName} is missing required data: ${missingAttributionWarnings.join(', ')}`)

      return false
    }

    return true
  }

  /**
   * Generates all palettes for the options in the category and returns
   * key-value list of names and the corresponding palette
   *
   * @returns {Object}
   */
  createPalettes() {
    const palettes = {}

    const paletteNames = this.options.flatMap(option => option.palettes)
    const uniquePaletteNames = [...new Set(paletteNames)]

    uniquePaletteNames.forEach(paletteName => {
      const colorRamps = this.paletteDefinitions[paletteName]
      const matchCategory = this.paletteMatch[paletteName]
      palettes[paletteName] = new Palette(this, paletteName, colorRamps, matchCategory)
    })

    return palettes
  }

  /**
   * Randomly picks options and colors for the category
   */
  randomize() {
    const options = this.availableOptions()

    // Removes the "none" option for the body and the head. If we ever want to
    // prevent more categories from randomly returning "none" then we should
    // add a parameter to the category-definitions file to control that
    if (this.name === 'body' || this.name === 'head') options.shift()

    const chosenOptionIndex = Math.floor(Math.random() * options.length)
    const option = options[chosenOptionIndex]

    this.setSelectedOption(option, false)

    const palettes = this.selectedPalettes()
    palettes.forEach(palette => palette.randomize())
  }

  getRecolor() {
    const palettes = this.selectedPalettes()
    const recolor = {}

    palettes.forEach(palette => {
      const targetColorRamp = palette.selectedColorRamp
      const originalRamp = palette.originalColorRamp

      if (targetColorRamp === originalRamp) return // no recolor

      originalRamp.colors.forEach((originalColor, index) => {
        // Regular Number gives negatives with some left shifts, but BigInt
        // behaves correctly. Key is RGBA because that's what a DataView can
        // pull from an array buffer in a single operation.
        const [r, g, b] = this.hexToRGB(originalColor).map(n => BigInt(n))
        const key = (r << 24n) + (g << 16n) + (b << 8n) + 255n
        recolor[key] = this.hexToRGB(targetColorRamp.colors[index])
      })
    })

    return recolor
  }

  hexToRGB(hexCode) {
    const colorOffsets = [
      [1, 3], // r
      [3, 5], // g
      [5, 7] // b
    ]

    return colorOffsets.map(([start, end]) => parseInt(hexCode.slice(start, end), 16))
  }

  /**
   * Finds and sets a valid option if the selection is invalid. This will pick
   * an option with the same label as the previous selection if one is
   * available, otherwise it will use the first valid option ("none" in most
   * cases).
   */
  fixExcludedOptions() {
    const tags = this.allCategoryTags()
    const selectedOption = this.selectedOption

    if (selectedOption.isAvailable(tags)) return

    const label = selectedOption.label
    const availableOptions = this.availableOptions()
    const newOption = availableOptions.find(option => option.label === label) ?? availableOptions[0]

    this.setSelectedOption(newOption, false)
  }
}

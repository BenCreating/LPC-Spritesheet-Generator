import Attribution from './Attribution.js'

/**
 * A single asset (shirt, human male body, etc.)
 */
export default class AssetOption {
  /**
   * @param {string} name the name of the asset
   * @param {AssetCategory} category the category the asset belongs to
   * @param {Object} optionData the sheet definition data for the asset
   */
  constructor(name, category, optionData = {}) {
    this.name = name
    this.category = category

    this.default = optionData.default ?? false
    this.label = optionData.label ?? name
    this.tags = optionData.tags ?? []
    this.excludedBy = optionData['excluded-by'] ?? []
    this.palettes = optionData.palettes ?? []
    this.sublayers = optionData.sublayers ?? []
    this.zPosition = optionData.z_position ?? category.zPosition

    this.attribution = new Attribution(this, optionData)
  }

  /**
   * Checks if the asset should be available as an option, or is excluded by any
   * of the active tags
   *
   * @param {string[]} selectedTags
   * @returns {boolean}
   */
  isAvailable(selectedTags) {
    const excludedByTags = this.excludedBy
    return !excludedByTags.find(excludedTag => selectedTags.includes(excludedTag))
  }

  isSelected() {
    return this === this.category.selectedOption
  }

  /**
   * Called when the user clicks on this option to select it
   *
   * @param {Event} _event
   */
  selectOption(_event) {
    this.category.setSelectedOption(this)
  }

  /**
   * Returns the attribution for this asset as HTML
   *
   * @returns {HTMLElement}
   */
  attributionHTML() {
    return this.attribution.html()
  }

  /**
   * Returns the attribution for this asset as plain text
   *
   * @returns {string}
   */
  attributionPlainText() {
    return this.attribution.plainText()
  }

  /**
   * Returns an array of authors who contributed to the creation of this asset
   *
   * @returns {string[]}
   */
  authors() {
    return this.attribution.authors
  }

  /**
   * Loads the icon for this asset
   */
  async loadIcon() {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64

    const image = new Image()
    let frameOffsetY = 0

    if (this.name === 'none') {
      image.src = 'resources/none.png'
    } else {
      image.src = `${this.imageFolderPath()}/idle.png`
      frameOffsetY = -128
    }

    await image.decode()

    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, frameOffsetY)

    this.icon = canvas
  }

  imageFolderPath() {
    const categoryName = this.category.name

    return `resources/spritesheets/${categoryName}/${this.name}`
  }
}

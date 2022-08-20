import AssetOption from './AssetOption.js'
import Palette from './Palette.js'

export default class AssetCategory {
  constructor(optionController, categoryName, categoryData, preselectedOptionName) {
    this.optionController = optionController
    this.name = categoryName

    const optionNames = Object.keys(categoryData)
    this.options = optionNames.map(name => {
      const optionData = categoryData[name]
      return new AssetOption(name, this, optionData)
    })
    this.options.unshift(new AssetOption('none', this))

    const preselectedOption = this.options.find(option => option.name === preselectedOptionName)
    this.selectedOption = preselectedOption ?? this.defaultOption() ?? this.options[0]

    this.palettes = this.createPalettes()
  }

  get urlParameterController() { return this.optionController.urlParameterController }
  get spritesheetController() { return this.optionController.spritesheetController }
  get attributionController() { return this.optionController.attributionController }
  get paletteDefinitions() { return this.optionController.paletteDefinitions }

  tags() {
    return this.selectedOption.tags
  }

  allCategoryTags() {
    return this.optionController.selectedTags()
  }

  authors() {
    return this.selectedOption.authors()
  }

  availableOptions() {
    const tags = this.allCategoryTags()
    return this.options.filter(option => option.isAvailable(tags))
  }

  setSelectedOption(option) {
    this.selectedOption = option
    this.urlParameterController.setURLParameters({ name: this.name, value: option.name })

    this.optionController.update()
    this.spritesheetController.update()
    this.attributionController.update()
  }

  defaultOption() {
    return this.options.find(option => option.default)
  }

  selectedPaletteNames() {
    return this.selectedOption.palettes
  }

  html() {
    const name = this.name

    const container = document.createElement('fieldset')
    container.id = `${name}-options`

    const label = document.createElement('legend')
    label.textContent = name
    container.appendChild(label)

    container.appendChild(this.colorsHTML())

    const optionsContainer = document.createElement('div')
    optionsContainer.className = 'category-item-options'
    container.appendChild(optionsContainer)

    const options = this.availableOptions()
    options.forEach(option => {
      optionsContainer.appendChild(option.html())
    })

    return container
  }

  colorsHTML() {
    const colorsContatinerID = `${this.name}-colors`
    const previousColors = document.getElementById(colorsContatinerID)
    if (previousColors) previousColors.remove()

    const container = document.createElement('div')
    container.id = colorsContatinerID
    container.className = 'item-color-options'

    this.selectedPaletteNames().forEach(paletteName => {
      const palette = this.palettes[paletteName]
      container.appendChild(palette.html())
    })

    return container
  }

  createPalettes() {
    const palettes = {}

    const paletteNames = this.options.flatMap(option => option.palettes)
    const uniquePaletteNames = [...new Set(paletteNames)]

    uniquePaletteNames.forEach(paletteName => {
      const colorRamps = this.paletteDefinitions[paletteName]
      palettes[paletteName] = new Palette(this, paletteName, colorRamps)
    })

    return palettes
  }

  getRecolor() {
    const palettes = Object.values(this.palettes)
    const recolor = {}

    palettes.forEach(palette => {
      const targetColorRamp = palette.selectedColorRamp
      const originalRamp = palette.colorRamps[0]

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
      [5, 7], // b
    ]

    return colorOffsets.map(([start, end]) => parseInt(hexCode.slice(start, end), 16))
  }
}
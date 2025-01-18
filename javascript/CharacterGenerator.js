import { zipSync } from 'fflate'
import AttributionController from './AttributionController.js'
import OptionController from './OptionController.js'
import SpritesheetController from './SpritesheetController.js'
import URLParameterController from './URLParameterController.js'

/**
 * Sets up the page, loads and stores the definition files, and manages the
 * download
 */
export default class CharacterGenerator {
  urlParameterController = new URLParameterController()
  spritesheetController = new SpritesheetController(this)
  optionController = new OptionController(this)
  attributionController = new AttributionController(this)

  /**
   * Loads the resources and sets up the page
   */
  async setup() {
    this.sheetDefinitions = await this.loadDefinitions('sheet')
    this.paletteDefinitions = await this.loadDefinitions('palette')
    this.categoryDefinitions = await this.loadDefinitions('category')
    this.animationDefinitions = await this.loadDefinitions('animation')

    this.sortAnimationDefinitions()

    const downloadButton = document.querySelector('#download-button')
    downloadButton.addEventListener('click', this.download)

    const randomButton = document.querySelector('#random-button')
    randomButton.addEventListener('click', this.optionController.randomize.bind(this.optionController))

    const copyAttributionButton = document.querySelector('#copy-attribution-button')
    copyAttributionButton.addEventListener('click', this.attributionController.copy.bind(this.attributionController))

    await this.optionController.setupOptionButtons()
    await this.spritesheetController.update()
    this.attributionController.update()

    const preview = document.querySelector('lpc-animation-preview')
    preview.spritesheetController = this.spritesheetController
    preview.start()
  }

  /**
   * Loads a definition file
   *
   * @param {string} type the kind of definition to load (palette, sheet, etc.)
   * @returns {Object}
   */
  async loadDefinitions(type) {
    const response = await fetch(`resources/${type}-definitions.json`)
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

    return await response.json()
  }

  /**
   * Sorts the animation definitions so the animations will be drawn in the
   * correct order
   */
  sortAnimationDefinitions() {
    const definitions = this.animationDefinitions
    const keys = Object.keys(definitions)
    const sortedKeys = keys.sort((a, b) => {
      const orderA = definitions[a]['sort-order']
      const orderB = definitions[b]['sort-order']

      if (orderA && orderB) return orderA - orderB
      if (orderA) return -1
      if (orderB) return 1
      return 0
    })

    this.animationDefinitions = sortedKeys.reduce((sortedDefinitions, key) => {
      sortedDefinitions[key] = definitions[key]
      return sortedDefinitions
    }, {})
  }

  /**
   * Packages the spritesheet and attribution together in a zip file and starts
   * a download
   */
  download = async () => {
    const spritesheet = await this.spritesheetController.getPNG()
    const attribution = this.attributionController.fullPlainText()
    const attributionBinary = new TextEncoder().encode(attribution)

    const zip = zipSync({
      'spritesheet.png': [spritesheet, { level: 0 }],
      'attribution.txt': attributionBinary
    })

    const downloadBlob = new Blob([zip], { type: 'application/zip' })
    const url = URL.createObjectURL(downloadBlob)

    const link = document.createElement('a')
    link.download = 'spritesheet.zip'
    link.href = url

    link.click()

    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  updatePreviewFrameSize() {
    const preview = document.querySelector('lpc-animation-preview')
    preview.updateFrameSize()
  }
}

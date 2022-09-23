import { zipSync } from 'https://cdn.skypack.dev/pin/fflate@v0.7.3-x0OS7MYd1pAJyCyfqyxe/mode=imports,min/optimized/fflate.js'
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

    const downloadButton = document.querySelector('#download-button')
    downloadButton.addEventListener('click', this.download)

    const copyAttributionButton = document.querySelector('#copy-attribution-button')
    copyAttributionButton.addEventListener('click', this.attributionController.copy.bind(this.attributionController))

    await this.optionController.setupOptionButtons()
    await this.spritesheetController.update()
    this.attributionController.update()

    const preview = document.querySelector('animation-preview')
    preview.source = this.spritesheetController.canvas
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
}

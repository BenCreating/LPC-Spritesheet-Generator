import { zipSync } from 'https://cdn.skypack.dev/pin/fflate@v0.7.3-x0OS7MYd1pAJyCyfqyxe/mode=imports,min/optimized/fflate.js'
import AttributionManager from './AttributionManager.js'
import OptionManager from './OptionManager.js'
import SpritesheetManager from './SpritesheetManager.js'
import URLParameterManager from './URLParameterManager.js'

export default class CharacterGenerator {
  async setup() {
    this.urlParameterManager = new URLParameterManager()
    this.spritesheetManager = new SpritesheetManager(this)
    this.optionManager = new OptionManager(this)
    this.attributionManager = new AttributionManager(this)
    this.sheetDefinitions = await this.loadSheetDefinitions()

    const downloadButton = document.querySelector('#download-button')
    downloadButton.addEventListener('click', this.download)

    const copyAttributionButton = document.querySelector('#copy-attribution-button')
    copyAttributionButton.addEventListener('click', this.attributionManager.copy.bind(this.attributionManager))

    const urlParameters = this.urlParameterManager.getURLParameters()
    this.optionManager.setupOptionButtons(urlParameters)

    await this.spritesheetManager.update()

    const preview = document.querySelector('animation-preview')
    preview.source = this.spritesheetManager.canvas
    preview.start()
  }

  async loadSheetDefinitions() {
    const response = await fetch('resources/sheet-definitions.json')
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

    return await response.json()
  }

  download = async () => {
    const spritesheet = await this.spritesheetManager.getPNG()
    const attribution = this.attributionManager.fullPlainText()
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

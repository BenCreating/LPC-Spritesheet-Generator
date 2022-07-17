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
    downloadButton.addEventListener('click', this.spritesheetManager.download.bind(this.spritesheetManager))

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
}

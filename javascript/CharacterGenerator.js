import { zipSync } from 'https://cdn.skypack.dev/pin/fflate@v0.7.3-x0OS7MYd1pAJyCyfqyxe/mode=imports,min/optimized/fflate.js'
import AttributionManager from './AttributionManager.js'
import ColorManager from './ColorManager.js'
import OptionManager from './OptionManager.js'
import SpritesheetManager from './SpritesheetManager.js'
import URLParameterManager from './URLParameterManager.js'

export default class CharacterGenerator {
  urlParameterManager = new URLParameterManager()
  spritesheetManager = new SpritesheetManager(this)
  optionManager = new OptionManager(this)
  attributionManager = new AttributionManager(this)
  colorManager = new ColorManager(this)

  constructor() {
    window.addEventListener('popstate', () => {
      this.setOptions(this.urlParameterManager.getURLParameters())
    })
  }

  async setup() {
    this.sheetDefinitions = await this.loadDefinitions('sheet')
    this.paletteDefinitions = await this.loadDefinitions('palette')

    const downloadButton = document.querySelector('#download-button')
    downloadButton.addEventListener('click', this.download)

    const copyAttributionButton = document.querySelector('#copy-attribution-button')
    copyAttributionButton.addEventListener('click', this.attributionManager.copy.bind(this.attributionManager))

    // URL parameters have to be applied twice because colors are dependent on
    // which options are selected. If the option isn't selected yet the color
    // options won't exist.
    this.optionManager.setupOptionButtons()
    this.applyURLParameters()
    this.colorManager.setupColorButtons()
    this.applyURLParameters()

    await this.spritesheetManager.update()

    const preview = document.querySelector('animation-preview')
    preview.source = this.spritesheetManager.canvas
    preview.start()
  }

  async loadDefinitions(type) {
    const response = await fetch(`resources/${type}-definitions.json`)
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

  applyURLParameters() {
    const urlParameters = this.urlParameterManager.getURLParameters()
    const optionNames = [...urlParameters.keys()]

    optionNames.forEach(name => {
      const value = urlParameters.get(name)
      const radioButton = document.querySelector(`.sidebar input[type=radio][name="${name}"][value="${value}"]`)
      if (radioButton) radioButton.checked = true
    })

    this.attributionManager.update()
  }
}

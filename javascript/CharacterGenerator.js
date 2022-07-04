import OptionManager from './OptionManager.js'
import PreviewAnimation from './previewAnimation.js'
import SpritesheetManager from './SpritesheetManager.js'
import URLParameterManager from './URLParameterManager.js'

export default class CharacterGenerator {
  urlParameterManager() {
    if (!this._urlParameterManager) {
      this._urlParameterManager = new URLParameterManager()
    }
    return this._urlParameterManager
  }

  spritesheetManager() {
    if (!this._spriteSheetManager) {
      this._spriteSheetManager =  new SpritesheetManager(this)
    }
    return this._spriteSheetManager
  }

  optionManager() {
    if (!this._optionManager) {
      this._optionManager = new OptionManager(this)
    }
    return this._optionManager
  }

  async setup() {
    const urlParameterManager = this.urlParameterManager()
    const spritesheetManager = this.spritesheetManager()
    const optionManager = this.optionManager()

    optionManager.setupOptionButtons()
    const parameters = urlParameterManager.getURLParameters()
    optionManager.setOptions(parameters)

    await spritesheetManager.update()

    const previewCanvas = document.querySelector('#animation_preview canvas')
    const preview = new PreviewAnimation(spritesheetManager.image, previewCanvas)
    preview.start()
  }
}
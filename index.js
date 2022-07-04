import OptionManager from './javascript/OptionManager.js'
import PreviewAnimation from './javascript/previewAnimation.js'
import SpritesheetManager from './javascript/SpritesheetManager.js'
import URLParameterManager from './javascript/urlParameterManager.js'

document.addEventListener('DOMContentLoaded', setupGenerator)

async function setupGenerator() {
  const urlParameterManager = new URLParameterManager()
  const spritesheetManager = new SpritesheetManager()
  const optionManager = new OptionManager(urlParameterManager, spritesheetManager)

  optionManager.setupOptionButtons()
  const parameters = urlParameterManager.getURLParameters()
  optionManager.setOptions(parameters)

  await spritesheetManager.update()

  const previewCanvas = document.querySelector('#animation_preview canvas')
  const preview = new PreviewAnimation(spritesheetManager.image, previewCanvas)
  preview.start()
}

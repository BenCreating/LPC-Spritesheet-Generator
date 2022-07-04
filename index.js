import OptionManager from './javascript/OptionManager.js'
import SpritesheetManager from './javascript/SpritesheetManager.js'
import URLParameterManager from './javascript/urlParameterManager.js'

document.addEventListener('DOMContentLoaded', setupGenerator)

function setupGenerator() {
  const urlParameterManager = new URLParameterManager()
  const spritesheetManager = new SpritesheetManager()
  const optionManager = new OptionManager(urlParameterManager, spritesheetManager)

  optionManager.setupOptionButtons()
  const parameters = urlParameterManager.getURLParameters()
  optionManager.setOptions(parameters)

  spritesheetManager.update()
}
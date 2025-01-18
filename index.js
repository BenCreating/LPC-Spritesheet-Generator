import './javascript/web-components/lpc-animation-preview.component.js'
import './javascript/web-components/lpc-asset-option.component.js'
import './javascript/web-components/lpc-asset-category.component.js'
import './javascript/web-components/lpc-category-palettes.component.js'
import CharacterGenerator from './javascript/CharacterGenerator.js'

const characterGenerator = new CharacterGenerator()

document.addEventListener('DOMContentLoaded', () => characterGenerator.setup())

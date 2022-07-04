import './javascript/AnimationPreview.js'
import CharacterGenerator from './javascript/CharacterGenerator.js'

const characterGenerator = new CharacterGenerator()

document.addEventListener('DOMContentLoaded', () => characterGenerator.setup())

/**
 * @typedef {import('./CharacterGenerator').default} CharacterGenerator
 */

export default class AttributionController {
  /**
   * @param {CharacterGenerator} characterGenerator
   */
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
  }

  get optionController() { return this.characterGenerator.optionController }

  update() {
    const attributionContainer = document.querySelector('.attribution-content')

    const authorsHTML = this.authorsHTML()
    const attributionHTML = this.attributionHTML()

    attributionContainer.replaceChildren(authorsHTML, attributionHTML)
  }

  copy() {
    const attribution = this.fullPlainText()
    navigator.clipboard.writeText(attribution)
  }

  selectedOptions() {
    return this.optionController.selectedOptions().filter(option => option.name !== 'none')
  }

  authors() {
    const selectedOptions = this.selectedOptions()
    const authors = selectedOptions.flatMap(option => option.authors())
    const uniqueAuthors = new Set(authors)

    return [...uniqueAuthors]
  }

  authorsPlainText() {
    return this.authors().join(', ')
  }

  authorsHTML() {
    const authorsPlainText = this.authorsPlainText()

    const authorsHTML = document.createElement('span')
    authorsHTML.textContent = authorsPlainText

    return authorsHTML
  }

  attributionHTML() {
    const attribution = document.createElement('ul')

    this.selectedOptions().forEach(option => {
      const optionAttribution = option.attributionHTML()
      attribution.appendChild(optionAttribution)
    })

    return attribution
  }

  attributionPlainText() {
    const items = this.selectedOptions().map(option => option.attributionPlainText())
    return items.join('\n\n')
  }

  fullPlainText() {
    const authors = this.authorsPlainText()
    const attribution = this.attributionPlainText()

    return `${authors}\n\n${attribution}`
  }
}

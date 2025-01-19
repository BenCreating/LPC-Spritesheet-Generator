/**
 * @typedef {import('./CharacterGenerator').default} CharacterGenerator
 */

/**
 * Manages and generates the attribution
 */
export default class AttributionController {
  /**
   * @param {CharacterGenerator} characterGenerator
   */
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
  }

  get optionController() { return this.characterGenerator.optionController }

  /**
   * Copies the full plain text attribution to the clipboard
   */
  copy() {
    const attribution = this.fullPlainText()
    navigator.clipboard.writeText(attribution)
  }

  /**
   * An array of all selected options, with any "none" options removed
   *
   * @returns {AssetOption[]}
   */
  selectedOptions() {
    return this.optionController.selectedOptions().filter(option => option.name !== 'none')
  }

  /**
   * Compiles an array of authors for the spritesheet. Each author will only be
   * appear once, even if they contributed to multiple items.
   *
   * @returns {string[]}
   */
  authors() {
    const selectedOptions = this.selectedOptions()
    const authors = selectedOptions.flatMap(option => option.authors())
    const uniqueAuthors = new Set(authors)

    return [...uniqueAuthors]
  }

  /**
   * Returns a list of all authors who contributed to the spritesheet formatted
   * as plain text
   *
   * @returns {string}
   */
  authorsPlainText() {
    return this.authors().join(', ')
  }

  /**
   * Returns a detailed attribution for each item in the spritesheet formatted
   * as plain text
   *
   * @returns {string}
   */
  attributionPlainText() {
    const items = this.selectedOptions().map(option => option.attributionPlainText())
    return items.join('\n\n')
  }

  /**
   * Returns the full attribution (list of all authors and detailed attribution)
   * as plain text
   *
   * @returns {string}
   */
  fullPlainText() {
    const authors = this.authorsPlainText()
    const attribution = this.attributionPlainText()

    return `${authors}\n\n${attribution}`
  }
}

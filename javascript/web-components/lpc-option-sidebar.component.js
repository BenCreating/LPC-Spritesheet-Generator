import { LitElement, html } from 'lit'

export default class LPCOptionSidebarElement extends LitElement {
  static properties = {
    optionController: { type: Object }
  }

  optionChanged(_event) {
    this.optionController.categories.forEach(category => {
      const categoryElement = this.shadowRoot.getElementById(category.categoryId())
      categoryElement.availableOptions = category.availableOptions()
    })
  }

  render() {
    if (!this.optionController) return

    const categories = this.optionController.categories

    return categories.map(category => {
      const categoryOptions = category.availableOptions()
      return html`
        <lpc-asset-category
          id=${category.categoryId()}
          .category=${category}
          .availableOptions=${categoryOptions}
          @optionChanged=${this.optionChanged}
        ></lpc-asset-category>
      `
    })
  }
}

window.customElements.define('lpc-option-sidebar', LPCOptionSidebarElement)

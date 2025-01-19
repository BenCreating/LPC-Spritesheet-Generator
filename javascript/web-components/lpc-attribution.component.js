import { LitElement, html } from 'lit'

export default class LPCAttributionElement extends LitElement {
  static properties = {
    attributionController: { type: Object },
    selectedOptions: { type: Array }
  }

  render() {
    if (!this.attributionController) return

    const authors = this.attributionController.authorsPlainText()

    return html`
      <div class="attribution-content">
        <span>${authors}</span>
        <ul>
          ${this.renderAttribution()}
        </ul>
      </div>
    `
  }

  renderAttribution() {
    return this.selectedOptions.map(option => {
      const attribution = option.attribution

      return html`
        <li>
          <span>${attribution.authorAndLicense()}</span>
          ${this.renderLinks(attribution)}
        </li>
      `
    })
  }

  renderLinks(attribution) {
    return html`
      <ul>
        ${attribution.links.map(url => this.renderUrl(url))}
      </ul>
    `
  }

  renderUrl(url) {
    return html`
      <li>
        <a href=${url}>${url}</a>
      </li>
    `
  }
}

window.customElements.define('lpc-attribution', LPCAttributionElement)

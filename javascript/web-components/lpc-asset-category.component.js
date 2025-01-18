import { LitElement, css, html } from 'lit'

/**
 * @typedef {import('../AssetOption').default} AssetOption
 */

export default class LPCAssetCategoryElement extends LitElement {
  static properties = {
    assetCategory: { type: Object }
  }

  render() {
    if (!this.assetCategory) return

    const name = this.assetCategory.name
    const categoryId = `${name}-options`

    const options = this.assetCategory.availableOptions()

    return html`
      <fieldset id=${categoryId}>
        <legend>${name}</legend>
        <lpc-category-palettes .assetCategory=${this.assetCategory}></lpc-category-palettes>
        <div class="category-item-options">
          ${options.map(option => this.renderOption(option))}
        </div>
      </fieldset>
    `
  }

  renderOption(option) {
    return html`
      <lpc-asset-option .assetOption=${option}></lpc-asset-option>
    `
  }

  static styles = css`
    fieldset {
      border: none;
      padding: 0;
      margin: 0.5em 0;
    }

    legend {
      padding: 0;
      border-bottom: 1px solid var(--color-contrast);
      width: 100%;
      font-size: 1em;
      text-transform: capitalize;
      margin-bottom: 0.25em
    }

    .category-item-options {
      display: flex;
      flex-wrap: wrap;
    }
  `
}

window.customElements.define('lpc-asset-category', LPCAssetCategoryElement)

import { LitElement, css, html } from 'lit'

/**
 * @typedef {import('../AssetOption').default} AssetOption
 */

export default class LPCAssetOptionElement extends LitElement {
  static properties = {
    assetOption: { type: Object }
  }

  selectOption() {
    this.assetOption.selectOption()
  }

  render() {
    if (!this.assetOption) return

    const name = this.assetOption.name
    const categoryName = this.assetOption.category.name
    const buttonId = `option-${categoryName}-${name}`
    const label = this.assetOption.label ?? name
    const checked = this.assetOption.isSelected()

    return html`
      <div class="item-button">
        <input type="radio" name=${categoryName} value=${name} id=${buttonId} ?checked=${checked} @click=${this.selectOption}>
        <label for=${buttonId}>
          ${this.renderIcon()}
          <span>${label}</span>
        </label>
      </div>
    `
  }

  renderIcon() {
    if (!this.assetOption.icon) return

    return this.assetOption.icon
  }

  static styles = css`
    .item-button {
      width: 64px;
    }

    .item-button input[type=radio] {
      opacity: 0;
      position: absolute;
    }

    .item-button label {
      display: block;
      cursor: pointer;
      background-color: var(--color-page-background);
      transition: 60ms transform ease-in-out;
    }

    .item-button label span {
      display: block;
      text-align: center;
    }

    .item-button input[type=radio]:hover + label {
      box-shadow: 1px 1px 8px -2px var(--color-shadow);
      transform: translate(0, -2px) scale(1.05);
    }

    .item-button input[type=radio]:checked + label {
      box-shadow: 1px 1px 8px -2px var(--color-shadow), var(--selected) inset;
    }

    .item-button input[type=radio]:checked:hover + label {
      transform: translate(0, -2px) scale(1.05);
    }
  `
}

window.customElements.define('lpc-asset-option', LPCAssetOptionElement)

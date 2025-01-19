import { LitElement, css, html } from 'lit'

export default class LPCAssetCategoryElement extends LitElement {
  static properties = {
    category: { type: Object },
    availableOptions: { type: Array }
  }

  selectOption(event) {
    const selectionName = event.target.value
    const option = this.availableOptions.find(option => option.name === selectionName)
    option.selectOption()
    this.dispatchEvent(new CustomEvent('optionChanged'))
  }

  render() {
    if (!this.category || !this.availableOptions) return

    const name = this.category.name
    const categoryId = `${name}-options`

    return html`
      <fieldset id=${categoryId}>
        <legend>${name}</legend>
        <lpc-category-palettes .category=${this.category} .palettes=${this.category.selectedPalettes()}></lpc-category-palettes>
        <div class="category-item-options">
          ${this.availableOptions.map(option => this.renderOption(option))}
        </div>
      </fieldset>
    `
  }

  renderOption(option) {
    const name = option.name
    const categoryName = this.category.name
    const buttonId = `option-${categoryName}-${name}`
    const label = option.label ?? name
    const checked = option.isSelected()

    return html`
      <div class="item-button">
        <input
          type="radio"
          name=${categoryName}
          value=${name}
          id=${buttonId}
          ?checked=${checked}
          @click=${this.selectOption}
        >
        <label for=${buttonId}>
          ${this.renderIcon(option)}
          <span>${label}</span>
        </label>
      </div>
    `
  }

  renderIcon(option) {
    return option.icon
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

window.customElements.define('lpc-asset-category', LPCAssetCategoryElement)

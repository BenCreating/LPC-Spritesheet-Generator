import { LitElement, css, html } from 'lit'
import PaletteMatchRamp from '../PaletteMatchRamp.js'

export default class LPCCategoryPalettesElement extends LitElement {
  static properties = {
    category: { type: Object },
    palettes: { type: Array }
  }

  render() {
    if (!this.category) return

    const colorsContainerId = `${this.category.name}-colors`

    return html`
      <div id=${colorsContainerId}>
        ${this.palettes.map(palette => this.renderPalette(palette))}
      </div>
    `
  }

  renderPalette(palette) {
    const colorRamps = palette.colorRamps

    return html`
      <fieldset>
        <legend>${palette.name}</legend>
        ${colorRamps.map(ramp => this.renderColorRamp(ramp, palette))}
      </fieldset>
    `
  }

  renderColorRamp(ramp, palette) {
    const isPaletteMatch = ramp.constructor === PaletteMatchRamp

    const urlParameterKey = palette.urlParameterKey()
    const checked = ramp.isSelected()

    const fillColor = ramp.colors[0]
    const borderColor = ramp.colors[1]
    const style = isPaletteMatch ? '' : `background-color: ${fillColor}; border-color: ${borderColor};`
    const classes = isPaletteMatch ? 'color-option palette-match-option' : 'color-option'

    return html`
      <input
        type="radio"
        class=${classes}
        name=${urlParameterKey}
        value=${ramp.name}
        ?checked=${checked}
        @click=${ramp.selectColor.bind(ramp)}
        style=${style}
      >
    `
  }

  static styles = css`
    fieldset {
      border: none;
      padding: 0;
      margin: 0.5em 0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    legend {
      padding: 0;
      width: fit-content;
      border: none;
      font-size: 1em;
      text-transform: capitalize;
      margin-bottom: 0.25em;
      margin-right: 0.5em;
      float: left;
    }

    .color-option {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
      width: 24px;
      height: 24px;
      border-width: 1px;
      border-style: solid;
      border-radius: 50%;
      margin-right: 5px;
      margin-bottom: 0.25em;
      cursor: pointer;
      transition: 60ms transform ease-in-out;

      display: grid;
      place-content: center;
    }

    .color-option:hover {
      box-shadow: 1px 1px 8px -2px var(--color-shadow);
      transform: translate(0, -2px) scale(1.1);
    }

    .color-option:checked {
      box-shadow: 1px 1px 8px -2px var(--color-shadow), var(--selected);
    }

    .color-option::before {
      content: "";
      width: 12px;
      height: 12px;
      border-radius: 50%;
      transform: scale(0);
      transform-origin: center;
      transition: 120ms transform ease-in-out;
      -webkit-backdrop-filter: invert(1);
      backdrop-filter: invert(1);
      opacity: 60%;
    }

    .color-option:checked::before {
      transform: scale(1);
    }

    .palette-match-option {
      background-color: #ffffff;
      border-color: #000000;
    }

    .color-option.palette-match-option::after {
      content: "🔗";
      position: absolute;
      width: 24px;
      height: 24px;
      text-align: center;
      line-height: 24px;
    }
  `
}

window.customElements.define('lpc-category-palettes', LPCCategoryPalettesElement)

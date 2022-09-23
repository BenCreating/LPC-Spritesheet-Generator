import SpritesheetElementAnimation from "./SpritesheetElementAnimation.js"

/**
 * A single element of a spritesheet (body, hair, etc.)
 */
export default class SpritesheetElement {
  /**
   * @param {SpritesheetElement} a
   * @param {SpritesheetElement} b
   * @returns {number}
   */
  static layerComparitor = (a, b) => a.layer - b.layer

  /**
   * @param {string} categoryName
   * @param {string} variant
   * @param {object} definition
   * @param {number} layer
   * @param {object} animationDefinitions
   */
  constructor(categoryName, variant, definition, layer, animationDefinitions) {
    this.categoryName = categoryName
    this.variant = variant
    this.definition = definition
    this.layer = layer
    this.animationDefinitions = animationDefinitions
  }

  async load() {
    this.animations = this.animationDefinitions.map(animationDefinition => (
      new SpritesheetElementAnimation(this.categoryName, this.variant, this.definition, animationDefinition)
    ))

    await Promise.all(this.animations.map(animation => animation.load()))
  }

  /**
   * Recolors the images that make up this element
   *
   * @param {*} mapping
   */
  recolor(mapping) {
    this.animations.forEach(animation => animation.recolor(mapping))
  }

  /**
   * Adds this element to the spritesheet
   *
   * @param {*} ctx
   */
  draw(ctx) {
    this.animations.forEach(animation => animation.draw(ctx))
  }
}

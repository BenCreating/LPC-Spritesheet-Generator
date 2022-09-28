import SpritesheetElementAnimation from './SpritesheetElementAnimation.js'

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
   * @param {AssetOption} asset
   * @param {object} definition
   * @param {number} layer
   * @param {object} animationDefinitions
   */
  constructor(categoryName, asset, definition, layer, animationDefinitions) {
    this.categoryName = categoryName
    this.asset = asset
    this.definition = definition
    this.layer = layer
    this.animationDefinitions = animationDefinitions
  }

  /**
   * Loads the images for this element
   */
  async load() {
    const animations = await Promise.all(this.animationDefinitions.map(async animationDefinition => {
      const animationImagePath = `${this.asset.imageFolderPath()}/${animationDefinition.name}.png`
      const animationExists = await this.animationExists(animationImagePath)

      if (!animationExists) return undefined

      return new SpritesheetElementAnimation(this.categoryName, this.asset, this.definition, animationDefinition)
    }))

    // Filter out animations that don't exist
    this.animations = animations.filter(animation => animation)

    await Promise.all(this.animations.map(animation => animation.load()))
  }

  /**
   * Checks if an image exists for an animation
   * @param {string} animationPath
   * @returns {boolean}
   */
  async animationExists(animationPath) {
    const response = await fetch(animationPath)
    return response.ok
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

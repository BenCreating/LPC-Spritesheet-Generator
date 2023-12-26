import SpritesheetElementAnimation from './SpritesheetElementAnimation.js'
import SpritesheetElementMissingAnimation from './SpritesheetElementMissingAnimation.js'

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
   * @param {string} folderPath
   * @param {number} layer
   * @param {object} animationDefinitions
   * @param {object} frameSizes
   */
  constructor(categoryName, folderPath, layer, animationDefinitions, frameSizes = {}) {
    this.categoryName = categoryName
    this.folderPath = folderPath
    this.layer = layer
    this.animationDefinitions = animationDefinitions
    this.frameSizes = frameSizes
  }

  /**
   * Loads the images for this element
   */
  async load() {
    const animationNames = Object.keys(this.animationDefinitions)

    const animations = await Promise.all(animationNames.map(async animationName => {
      const animationDefinition = this.animationDefinitions[animationName]
      const animationImagePath = `${this.folderPath}/${animationName}.png`
      const animationExists = await this.animationExists(animationImagePath)
      const frameSize = this.frameSizes[animationName]

      if (!animationExists) return new SpritesheetElementMissingAnimation(this.categoryName, animationName, animationImagePath, animationDefinition, frameSize)

      return new SpritesheetElementAnimation(this.categoryName, animationName, animationImagePath, animationDefinition, frameSize)
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
  draw(ctx, largestAnimationFrameSizes) {
    let x = 0
    let y = 0

    this.animations.forEach((animation, index) => {
      const frameSize = largestAnimationFrameSizes[animation.name]
      animation.draw(ctx, x, y, frameSize)

      const nextAnimation = this.animations[index + 1]
      if (nextAnimation) {
        if (!nextAnimation.inline) y += animation.height(frameSize)
        x = nextAnimation.inline ? x + animation.width(frameSize) : 0
      }
    })
  }

  frameSizeForAnimation(animationName) {
    const animation = this.animations.find(animation => animation.name === animationName)
    return animation.frameSize
  }
}

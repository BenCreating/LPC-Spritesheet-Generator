/**
 * @typedef {import('./CharacterGenerator').default} CharacterGenerator
 */
import SpritesheetElement from './SpritesheetElement.js'

export default class SpritesheetController {
  /**
   * @param {CharacterGenerator} characterGenerator
   */
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
    this.canvas = document.getElementById('spritesheet')
  }

  get sheetDefinitions() { return this.characterGenerator.sheetDefinitions }
  get optionController() { return this.characterGenerator.optionController }
  get animationDefinitions() { return this.characterGenerator.animationDefinitions }

  /**
   * Updates the generated spritesheet
   */
  async update() {
    this.buildSpritesheetElements()

    await Promise.all(this.spritesheetElements.map(element => {
      return element.load()
    }))

    this.setCanvasSize()
    this.spritesheetElements.sort(SpritesheetElement.layerComparitor)
    this.applyRecolor()
  }

  buildSpritesheetElements() {
    const categories = this.optionController.categories
    const animationDefinitions = this.animationDefinitions

    this.spritesheetElements = categories.flatMap(category => {
      const selectedOption = category.selectedOption
      if (selectedOption.name === 'none') return undefined

      const sheetDefinition = this.sheetDefinitions[category.name][selectedOption.name]
      const frameSizes = sheetDefinition['frame-sizes']

      const mainFilePath = selectedOption.imageFolderPath()
      const mainElement = new SpritesheetElement(category.name, mainFilePath, selectedOption.zPosition, animationDefinitions, frameSizes)

      const subLayers = selectedOption.sublayers
      const sublayerElements = subLayers.map(sublayer => {
        const subLayerFilePath = `${mainFilePath}/${sublayer.name}`
        return new SpritesheetElement(category.name, subLayerFilePath, sublayer.z_position, animationDefinitions, frameSizes)
      })

      return [
        mainElement,
        ...sublayerElements
      ]
    }).filter(item => item)
  }

  setCanvasSize() {
    this.canvas.width = this.canvasWidth()
    this.canvas.height = this.canvasHeight()
  }

  canvasWidth() {
    const frameSizes = this.largestAnimationFrameSizes()
    const animationDefinitions = this.animationDefinitions
    const animationNames = Object.keys(animationDefinitions)

    const animationWidths = []
    animationNames.forEach(name => {
      const frameSize = frameSizes[name]
      const animationDefinition = animationDefinitions[name]
      const width = frameSize * animationDefinition.columns

      if (animationDefinition.inline) {
        const inlineIndex = animationWidths.length - 1
        animationWidths[inlineIndex] += width
      } else {
        animationWidths.push(width)
      }
    })

    return Math.max(...animationWidths)
  }

  canvasHeight() {
    const frameSizes = this.largestAnimationFrameSizes()
    const animationDefinitions = this.animationDefinitions
    const animationNames = Object.keys(animationDefinitions)

    const animationHeights = []
    animationNames.forEach(name => {
      const frameSize = frameSizes[name]
      const animationDefinition = animationDefinitions[name]
      const height = frameSize * animationDefinition.rows

      if (animationDefinition.inline) {
        const inlineIndex = animationHeights.length - 1
        const inlineHeight = animationHeights[inlineIndex]
        animationHeights[inlineIndex] = Math.max(inlineHeight, height)
      } else {
        animationHeights.push(height)
      }
    })

    return animationHeights.reduce((total, height) => total + height)
  }

  /**
   * Recolors the spritesheet
   */
  applyRecolor() {
    this.spritesheetElements.forEach(element => {
      const category = this.optionController.lookupCategoryByName(element.categoryName)
      const mapping = category.getRecolor()
      element.recolor(mapping)
    })
    this.draw()
  }

  /**
   * Gets the frame size for the animations from all SpritesheetElements and
   * returns the largest size for each
   *
   * @returns {Object}
   */
  largestAnimationFrameSizes() {
    const animationNames = Object.keys(this.animationDefinitions)
    const frameSizes = {}

    // TODO: apply the largest frame size in a row to inline animations
    this.spritesheetElements.forEach(spritesheetElement => {
      animationNames.forEach(animationName => {
        const frameSize = spritesheetElement.frameSizeForAnimation(animationName)
        const largestFrameSize = frameSizes[animationName] ?? 0
        if (frameSize > largestFrameSize) frameSizes[animationName] = frameSize
      })
    })

    return frameSizes
  }

  /**
   * Draws every selected option into the spritesheet
   */
  draw() {
    const context = this.canvas.getContext('2d')
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.spritesheetElements.forEach(element => element.draw(context, this.largestAnimationFrameSizes()))
  }

  /**
   * Retrieve the image data from the canvas
   *
   * @returns {Promise}
   */
  getCanvasBlob() {
    return new Promise(resolve => {
      this.canvas.toBlob(resolve, 'image/png')
    })
  }

  /**
   * Converts the spritesheet into a png for the download
   *
   * @returns {Uint8Array}
   */
  async getPNG() {
    const blob = await this.getCanvasBlob()

    const arrayBuffer = await blob.arrayBuffer()
    return new Uint8Array(arrayBuffer)
  }
}

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
    this.setCanvasSize()

    await Promise.all(this.spritesheetElements.map(element => {
      return element.load()
    }))

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
    // TODO: set width and height dynamically based on the animations displayed
    this.canvas.width = 832
    this.canvas.height = 2112
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

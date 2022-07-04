import animations from "./animations.js"

export default class SpritesheetManager {
  constructor(characterGenerator) {
    this._characterGenerator = characterGenerator
  }

  characterGenerator() {
    return this._characterGenerator
  }

  optionManager() {
    return this.characterGenerator().optionManager()
  }

  async update() {
    const canvas = document.getElementById('spritesheet')
    canvas.width = 832
    canvas.height = 1344

    const context = canvas.getContext('2d')

    const body = this.optionManager().getSelectedOption('body-type')

    await Promise.all(animations.map(async animation => {
      const image = new Image()
      image.src = `resources/spritesheets/body/${animation.name}/${body}.png`
      await image.decode()
      animation.width = image.width

      context.drawImage(image, animation.x, animation.y)
    }))

    this.canvas = canvas
  }
}

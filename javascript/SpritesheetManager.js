const animations = [
  { name: 'cast', x: 0, y: 0 },
  { name: 'thrust', x: 0, y: 256 },
  { name: 'idle', x: 0, y: 512 },
  { name: 'walk', x: 64, y: 512 },
  { name: 'shoot', x: 0, y: 768 },
  { name: 'slash', x: 0, y: 1024 },
  { name: 'hurt', x: 0, y: 1280 },
]

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
      this.image = new Image()
      this.image.src = `resources/spritesheets/body/${animation.name}/${body}.png`
      await this.image.decode()

      context.drawImage(this.image, animation.x, animation.y)
    }))
  }
}

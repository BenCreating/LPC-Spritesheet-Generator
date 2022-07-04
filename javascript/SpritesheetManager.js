export default class SpritesheetManager {
  async update() {
    const canvas = document.getElementById('spritesheet')
    const context = canvas.getContext('2d')

    this.image = new Image()
    this.image.src = 'resources/spritesheets/body/male/human/zombie.png'
    await this.image.decode()

    context.drawImage(this.image, 0, 0)
  }
}

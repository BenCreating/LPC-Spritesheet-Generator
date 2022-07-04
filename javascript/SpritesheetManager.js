export default class SpritesheetManager {
  update() {
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')

    const image = new Image()
    image.src = 'resources/spritesheets/body/male/human/zombie.png'

    context.drawImage(image, 0, 0)
  }
}
import Sprite from './Sprite';

export default class Layer {
  constructor(canvas, map, spriteConfig) {
    const context = canvas.getContext('2d');
    this.context = context;
    this.gridStep = 32;

    const sprite = new Sprite(spriteConfig);
    const objects = map.objects || [];
    const options = map.options || {};

    this.objects = new Set();

    objects.forEach((object) => {
      const item = sprite.getItem(object.name);

      if (item) {
        let {
          x, y,
        } = object;

        x *= this.gridStep;
        y *= this.gridStep;

        if (options.objectAlign === 'center') {
          x -= item.sWidth / 2;
          x += this.gridStep / 2;
        }

        item.x = x;
        item.y = y;
        this.objects.add(item);
      }
    });
  }

  draw() {
    this.objects.forEach((element) => {
      this.drawItem(element);
    });
  }

  drawItem(element) {
    const {
      image, sx, sy, sWidth, sHeight, x, y,
    } = element;

    this.context.drawImage(image, sx, sy, sWidth, sHeight, x, y, sWidth, sHeight);
  }
}

import Timer from './Timer';

export default class Layer {
  constructor(canvas, map) {
    const context = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = context;
    this.needRedraw = true;
    this.objects = [];
    this.map = map;

    const timer = new Timer();
    timer.addTask(() => {
      this.draw();
    });
    timer.start();
  }

  addItem(item) {
    this.objects.push(item);
  }

  removeItem(item) {
    const index = this.objects.indexOf(item);

    if (index !== -1) {
      this.objects.splice(index, 1);
    }
  }

  update() {
    this.needRedraw = true;
  }

  draw() {
    if (this.needRedraw) {
      this.context.clearRect(0, 0, this.width, this.height);

      const dx = this.map.offset.x;

      this.objects.forEach((element) => {
        this.drawItem(element, dx);
      });

      this.needRedraw = false;
    }
  }

  drawItem(element, dx) {
    if (element.icon) {
      const {
        x, y,
      } = element;

      const {
        image, sx, sy, sWidth, sHeight,
      } = element.icon;

      if (x - this.width <= dx && dx <= x + sWidth) {
        this.context.drawImage(image, sx, sy, sWidth, sHeight, x - dx, y, sWidth, sHeight);
      }
    }
  }
}

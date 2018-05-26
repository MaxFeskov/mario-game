export default class Layer {
  constructor(canvas) {
    const context = canvas.getContext('2d');
    this.context = context;
    this.objects = new Set();
  }

  addItem(item) {
    this.objects.add(item);
  }

  removeItem(item) {
    this.objects.delete(item);
  }

  draw() {
    this.objects.forEach((element) => {
      this.drawItem(element);
    });
  }

  drawItem(element) {
    const {
      image, x, y, sx, sy, sWidth, sHeight,
    } = element;

    this.context.drawImage(image, sx, sy, sWidth, sHeight, x, y, sWidth, sHeight);
  }
}
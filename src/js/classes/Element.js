import Sprite from './Sprite';

export default class Element {
  constructor(name, Layer, options) {
    const {
      i, j, gridStep, spriteConfig,
    } = options;

    const x = i * gridStep;
    const y = j * gridStep;

    this.item = {};
    this.Layer = Layer;

    const sprite = new Sprite(spriteConfig);
    const itemSprite = sprite.getItem(name);

    this.item = {
      name,
      x,
      y,
    };

    if (itemSprite) {
      this.item.icon = itemSprite;
    }
  }

  getElementLink() {
    return this.item;
  }

  destroy() {
    this.Layer.removeItem(this.item);
  }
}

import Sprite from './Sprite';

export default class Element {
  constructor(name, Layer, options) {
    const {
      x, y, spriteConfig,
    } = options;

    this.item = {};
    this.Layer = Layer;

    const sprite = new Sprite(spriteConfig);
    const itemSprite = sprite.getItem(name);

    if (itemSprite) {
      this.item = Object.assign({}, itemSprite, {
        name,
        x,
        y,
      });
    }
  }

  getElementLink() {
    return this.item;
  }

  destroy() {
    this.Layer.removeItem(this.item);
  }
}

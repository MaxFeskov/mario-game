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
    this.name = name;
    this.spriteConfig = spriteConfig;

    const itemSprite = this.getBaseIcon();

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

  getBaseIcon() {
    const sprite = new Sprite(this.spriteConfig);
    return sprite.getItem(this.name);
  }

  destroy() {
    this.Layer.removeItem(this.item);
  }
}

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
    this.options = options;
    this.spriteConfig = spriteConfig;

    this.item = {
      name,
      x,
      y,
    };

    this.getBaseIcon();
    this.Layer.update();
  }

  getElementLink() {
    return this.item;
  }

  updateIcon(iconName) {
    this.icon = iconName;
    const sprite = new Sprite(this.spriteConfig);
    const itemSprite = sprite.getItem(iconName);

    if (itemSprite) {
      this.item.icon = itemSprite;
    }
  }

  getBaseIcon() {
    return this.updateIcon(this.name);
  }

  animate(icons) {
    const iconCount = icons.length;
    const nextIconNumber = (icons.indexOf(this.icon) + 1) % iconCount;
    const nextIconName = icons[nextIconNumber];

    this.updateIcon(nextIconName);
    this.Layer.update();
  }

  destroy() {
    this.Layer.removeItem(this.item);
  }
}

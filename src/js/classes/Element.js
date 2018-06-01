import Sprite from './Sprite';

export default class Element {
  constructor(name, layer, options) {
    const {
      i, j, gridStep,
    } = options;

    const x = i * gridStep;
    const y = j * gridStep;

    this.name = name;
    this.layer = layer;
    this.options = options;

    this.item = {
      name,
      x,
      y,
    };

    this.getBaseIcon();
    this.layer.update();
  }

  getElementLink() {
    return this.item;
  }

  updateIcon(iconName) {
    this.icon = iconName;
    const sprite = new Sprite(this.options.spriteConfig);
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
    const nextIconName = icons[Number(nextIconNumber)];

    this.updateIcon(nextIconName);
    this.layer.update();
  }

  destroy() {
    this.layer.removeItem(this.item);
  }
}

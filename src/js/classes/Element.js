import Sprite from './Sprite';

export default class Element {
  constructor(name, layer, options) {
    const {
      i, j, gridStep, position, type = 'object',
    } = options;

    this.name = name;
    this.layer = layer;
    this.options = options;
    this.speed = {
      x: 0,
      y: 0,
    };

    this.item = {
      name,
      type,
      x: i * gridStep,
      y: j * gridStep,
    };

    const icon = this.getBaseIcon();

    const {
      x: positionX = 0, y: positionY = 0,
    } = position;

    if (positionX) {
      if (typeof positionX === 'number') {
        this.item.x += positionX * gridStep;
      } else {
        switch (positionX) {
          case 'center':
            this.item.x += (gridStep - icon.sWidth) / 2;
            break;

          case 'right':
            this.item.x += icon.sWidth;
            break;

          default:
            break;
        }
      }
    }

    if (positionY) {
      if (typeof positionY === 'number') {
        this.item.y += positionY * gridStep;
      } else {
        switch (positionY) {
          case 'center':
            this.item.y += (gridStep - icon.sHeifgt) / 2;
            break;

          case 'bottom':
            this.item.y -= icon.sHeight - gridStep;
            break;

          default:
            break;
        }
      }
    }

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

    return itemSprite;
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

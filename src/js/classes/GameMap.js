import Layer from './Layer';
import Element from './Element';
import Hero from './Hero';
import Box from './Box';

export default class GameMap {
  constructor(map, spriteConfig) {
    const {
      elements = [], settings = {},
    } = map.locations[0];

    this.settings = settings;
    this.gravity = settings.gravity || false;
    this.gridStep = 32;
    this.layers = [];
    this.width = settings.width * this.gridStep;
    this.height = settings.height * this.gridStep;
    this.offset = {
      x: 0,
      y: 0,
    };
    this.camera = {
      x: settings.camera[0] * this.gridStep || 0,
      y: settings.camera[1] * this.gridStep || 0,
    };

    const backgroundColor = settings.background;
    const backgroundLayer = new Layer(document.getElementById('background'), this, { backgroundColor });
    this.layers.push(backgroundLayer);

    const mainLayer = new Layer(document.getElementById('main'), this);
    this.layers.push(mainLayer);

    elements.forEach((item) => {
      item.ranges.forEach(([i1, j1, i2 = i1, j2 = j1]) => {
        for (let i = i1; i <= i2; i += 1) {
          for (let j = j1; j <= j2; j += 1) {
            if (item.type === 'background') {
              this.addItem(item, {
                i,
                j,
                layer: backgroundLayer,
                sprite: spriteConfig.backgrounds,
              });
            } else {
              this.addItem(item, {
                i,
                j,
                layer: mainLayer,
                sprite: spriteConfig.objects,
              });
            }
          }
        }
      });
    });
  }

  addItem(item, options) {
    const {
      i, j,
    } = options;

    const repeatRangesStep = item.repeatRangesStep || [];
    const position = item.position || {};

    let stepX = 1;
    let stepY = 1;
    let maxPosX = i;
    let maxPosY = j;

    if (repeatRangesStep[0] > 0) {
      ({ 0: stepX } = repeatRangesStep);
      maxPosX = this.settings.width;
    }

    if (repeatRangesStep[1] > 0) {
      ({ 1: stepY } = repeatRangesStep);
      maxPosY = this.settings.height;
    }

    for (let posX = i; posX <= maxPosX; posX += stepX) {
      for (let posY = j; posY <= maxPosY; posY += stepY) {
        const elementOptions = {
          i: posX,
          j: posY,
          gridStep: this.gridStep,
          position,
        };

        const {
          layer, sprite,
        } = options;

        let element;

        if (item.type === 'background') {
          elementOptions.spriteConfig = sprite;
          element = new Element(item.name, layer, elementOptions);
        } else {
          switch (item.type) {
            case 'hero':
              elementOptions.spriteConfig = sprite;
              elementOptions.type = 'personage';
              element = new Hero(item.name, layer, elementOptions);
              break;

            case 'box':
              elementOptions.spriteConfig = sprite;
              element = new Box(item.name, layer, elementOptions);
              break;

            default:
              elementOptions.spriteConfig = sprite;
              element = new Element(item.name, layer, elementOptions);
              break;
          }
        }

        layer.addItem(element.getElementLink());
      }
    }
  }

  init() {
    this.layers.forEach((layer) => {
      layer.update();
    });
  }

  getOffset() {
    return this.offset;
  }

  move(x, y) {
    this.offset.x = x;
    this.offset.y = y;

    this.layers.forEach((layer) => {
      layer.update();
    });
  }
}

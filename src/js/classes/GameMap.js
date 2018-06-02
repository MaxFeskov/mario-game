import Layer from './Layer';
import Element from './Element';
import Hero from './Hero';
import Box from './Box';

export default class GameMap {
  constructor(map, spriteConfig) {
    const {
      elements = [], settings = {},
    } = map.locations[0];

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

    const backgroundLayer = new Layer(document.getElementById('background'), this);
    this.layers.push(backgroundLayer);

    const mainLayer = new Layer(document.getElementById('main'), this);
    this.layers.push(mainLayer);

    elements.forEach((item) => {
      item.ranges.forEach(([i1, j1, i2 = i1, j2 = j1]) => {
        for (let i = i1; i <= i2; i += 1) {
          for (let j = j1; j <= j2; j += 1) {
            const options = {
              i,
              j,
              gridStep: this.gridStep,
            };

            let element;
            let layer;

            if (item.type === 'background') {
              layer = backgroundLayer;
              options.spriteConfig = spriteConfig.backgrounds;
              options.type = 'object';
              element = new Element(item.name, layer, options);
            } else {
              layer = mainLayer;

              switch (item.type) {
                case 'hero':
                  options.spriteConfig = spriteConfig.hero;
                  options.type = 'hero';
                  options.camera = this.camera;
                  options.map = {
                    width: this.width,
                    height: this.height,
                  };
                  element = new Hero(item.name, layer, options);
                  break;

                case 'box':
                  options.spriteConfig = spriteConfig.objects;
                  options.type = 'object';
                  element = new Box(item.name, layer, options);
                  break;

                default:
                  options.spriteConfig = spriteConfig.objects;
                  options.type = 'object';
                  element = new Element(item.name, layer, options);
                  break;
              }
            }

            layer.addItem(element.getElementLink());
          }
        }
      });
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

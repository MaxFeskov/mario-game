import Layer from './Layer';
import Element from './Element';

export default class GameMap {
  constructor(map, spriteConfig) {
    this.gridStep = 32;
    this.layers = [];

    const backgroundLayer = new Layer(document.getElementById('background'));
    this.layers.push(backgroundLayer);

    const mainLayer = new Layer(document.getElementById('main'));
    this.layers.push(mainLayer);

    const { elements = [] } = map.locations[0];

    elements.forEach((item) => {
      item.ranges.forEach(([i1, j1, i2 = i1, j2 = j1]) => {
        for (let i = i1; i <= i2; i += 1) {
          for (let j = j1; j <= j2; j += 1) {
            const options = {
              x: i * this.gridStep,
              y: j * this.gridStep,
            };

            let layer;

            switch (item.type) {
              case 'object':
                layer = mainLayer;
                options.spriteConfig = spriteConfig;
                break;

              case 'background':
                layer = backgroundLayer;
                options.spriteConfig = spriteConfig;
                break;

              default:
                break;
            }

            const element = new Element(item.name, layer, options);

            layer.addItem(element.getElementLink());
          }
        }
      });
    });
  }

  draw() {
    this.layers.forEach((layer) => {
      layer.draw();
    });
  }
}

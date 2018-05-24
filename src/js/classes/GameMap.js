import Layer from './Layer';

export default class GameMap {
  constructor(options) {
    const { layers = [] } = options;

    layers.map((item) => {
      const {
        element, map, sprite,
      } = item;

      // console.log('element', element);
      // console.log('map', map);
      // console.log('sprite', sprite);

      const layer = new Layer(element, map, sprite);
      layer.draw();

      return layer;
    });
  }

  draw() {
    console.log('draw');
  }
  // constructor(context, levelMap, tilesImg, tilesConfig) {
  //   this.levelMap = levelMap;
  //   this.tilesImg = tilesImg;
  //   this.tilesConfig = tilesConfig;
  //   this.context = context;
  //   this.cellSize = 32;
  //   this.vCellCount = 15;
  //   this.hCellCount = 150;
  // }

  // addObject(alias, cellX, cellY) {
  //   const dx = cellX * this.cellSize;
  //   const dy = (this.vCellCount - cellY - 1) * this.cellSize;
  //   const tilesList = this.tilesConfig;
  //   const {
  //     sx, sy, sWidth, sHeight,
  //   } = tilesList[alias];

  //   this.context.drawImage(this.tilesImg, sx, sy, sWidth, sHeight, dx, dy, sWidth, sHeight);
  // }

  // removeObject(alias, cellX, cellY) {
  //   const dx = cellX * this.cellSize;
  //   const dy = (this.vCellCount - 1 - cellY) * this.cellSize;
  //   const tilesList = this.tilesConfig;
  //   const {
  //     sWidth, sHeight,
  //   } = tilesList[alias];

  //   this.context.clearRect(dx, dy, dx + sWidth, dy + sHeight);
  // }

  // draw() {
  //   const tilesKeys = Object.keys(this.tilesConfig);
  //   const backgroundList = this.levelMap.locations[0].backgrounds;
  //   const objectList = this.levelMap.locations[0].objects;

  //   Object.entries(backgroundList).map((item) => {
  //     const itemName = item[0];
  //     const itemList = item[1];

  //     if (tilesKeys.includes(itemName)) {
  //       itemList.map(position => this.addObject(itemName, ...position));
  //     }

  //     return true;
  //   });

  //   objectList.map((line, lineIndex) => {
  //     [...line].forEach((item, i) => {
  //       if (tilesKeys.includes(item)) {
  //         this.addObject(item, lineIndex, i);
  //       }
  //     });

  //     return true;
  //   });
  // }

  // clear() {
  //   const objectList = this.levelMap.locations[0].objects;
  //   const tilesKeys = Object.keys(this.tilesConfig);

  //   objectList.map((line, lineIndex) => {
  //     [...line].forEach((item, i) => {
  //       if (tilesKeys.includes(item)) {
  //         this.removeObject(item, lineIndex, i);
  //       }
  //     });

  //     return true;
  //   });
  // }
}

import Element from './Element';
import Timer from './Timer';

import keys from '../modules/keyMap';

export default class Hero extends Element {
  constructor(name, layer, options) {
    super(name, layer, options);

    this.isGo = false;
    this.camera = {
      x: 160,
      y: 0,
    };

    window.addEventListener('keydown', (e) => {
      if (this.isGo === false) {
        switch (e.keyCode) {
          case keys.left:
            this.goLeft();
            break;

          case keys.right:
            this.goRight();
            break;

          case keys.down:
            this.sitDown();
            break;

          default:
            break;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.keyCode) {
        case keys.left:
          this.stop();
          this.updateIcon('left');
          break;

        case keys.right:
          this.stop();
          this.updateIcon('right');
          break;

        case keys.down:
          this.updateIcon('right');
          break;

        default:
          break;
      }
    });
  }

  goRight(speed = 1) {
    this.isGo = true;

    let timeBeforeSteps = 0;

    this.timer = new Timer();
    this.timer.addTask((deltaTime, time) => {
      if (time - timeBeforeSteps > 200) {
        timeBeforeSteps = time;
        this.animate(['go-right', 'go-right-2']);
      }

      let { x } = this.item;
      x += speed;

      const mapWidth = this.options.map.width;
      const layerWidth = this.layer.width;
      const iconWidth = this.item.icon.sWidth;
      const offsetCameraX = this.options.camera.x;

      let offsetX = this.layer.map.offset.x;

      if (x > mapWidth - iconWidth) {
        x = mapWidth - iconWidth;
      }

      this.item.x = x;

      let dx = x + offsetCameraX;
      dx -= layerWidth;

      if (offsetX < dx) {
        offsetX = dx;

        if (offsetX < 0) {
          offsetX = 0;
        } else if (offsetX > mapWidth - layerWidth) {
          offsetX = mapWidth - layerWidth;
        }

        this.layer.map.move(offsetX, 0);
      } else {
        this.layer.update();
      }
    });

    this.timer.start();
  }

  goLeft(speed = 1) {
    this.isGo = true;

    let timeBeforeSteps = 0;

    this.timer = new Timer();
    this.timer.addTask((deltaTime, time) => {
      if (time - timeBeforeSteps > 200) {
        timeBeforeSteps = time;
        this.animate(['go-left', 'go-left-2']);
      }

      let { x } = this.item;
      x -= speed;

      const { x: offsetX } = this.layer.map.offset;

      if (x < 0) {
        x = 0;
      } else if (x < offsetX) {
        x = offsetX;
      }

      this.item.x = x;

      this.layer.update();
    });

    this.timer.start();
  }

  sitDown() {
    this.isGo = false;
    this.updateIcon('sit-down');
  }

  stop() {
    this.isGo = false;
    this.timer.stop();
    this.timer.clearTask();
  }

  getBaseIcon() {
    return this.updateIcon('right');
  }
}

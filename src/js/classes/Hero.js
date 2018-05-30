import Element from './Element';
import Timer from './Timer';

import keys from '../modules/keyMap';

export default class Hero extends Element {
  constructor(name, Layer, options) {
    super(name, Layer, options);

    this.isGo = false;
    this.camera = {
      x: 160,
      y: 0,
    };

    window.addEventListener('keydown', (e) => {
      if (this.isGo === false) {
        if (e.keyCode === keys.left) {
          this.isGo = true;
          this.goLeft();
        }

        if (e.keyCode === keys.right) {
          this.isGo = true;
          this.goRight();
        }

        if (e.keyCode === keys.down) {
          this.isGo = true;
          this.sitDown();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.keyCode === keys.left) {
        this.isGo = false;
        this.stop();
        this.updateIcon('left');
      }

      if (e.keyCode === keys.right) {
        this.isGo = false;
        this.stop();
        this.updateIcon('right');
      }

      if (e.keyCode === keys.down) {
        this.isGo = false;
        this.updateIcon('right');
      }
    });
  }

  goRight(speed = 1) {
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
      const layerWidth = this.Layer.width;
      const iconWidth = this.item.icon.sWidth;
      const offsetCameraX = this.options.camera.x;

      let dx = this.Layer.map.offset.x;

      if (x > mapWidth - iconWidth) {
        x = mapWidth - iconWidth;
      }

      this.item.x = x;

      if (x > layerWidth - offsetCameraX + dx) {
        dx = x + offsetCameraX - layerWidth;

        if (dx < 0) {
          dx = 0;
        } else if (dx > mapWidth - layerWidth) {
          dx = mapWidth - layerWidth;
        }

        this.Layer.map.move(dx, 0);
      } else {
        this.Layer.update();
      }
    });

    this.timer.start();
  }

  goLeft(speed = 1) {
    let timeBeforeSteps = 0;

    this.timer = new Timer();
    this.timer.addTask((deltaTime, time) => {
      if (time - timeBeforeSteps > 200) {
        timeBeforeSteps = time;
        this.animate(['go-left', 'go-left-2']);
      }

      let { x } = this.item;
      x -= speed;

      const { x: offsetX } = this.Layer.map.offset;

      if (x < 0) {
        x = 0;
      } else if (x < offsetX) {
        x = offsetX;
      }

      this.item.x = x;

      this.Layer.update();
    });

    this.timer.start();
  }

  sitDown() {
    this.updateIcon('sit-down');
  }

  stop() {
    this.timer.stop();
    this.timer.clearTask();
  }

  getBaseIcon() {
    return this.updateIcon('right');
  }
}

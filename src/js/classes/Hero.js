import {
  searchCollisions, resolveCollisions,
} from '../modules/collisions';

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
      switch (e.keyCode) {
        case keys.left:
          this.speed.x = -1;
          break;

        case keys.right:
          this.speed.x = 1;
          break;

        case keys.up:
          this.speed.y = -1;
          break;

        case keys.down:
          this.speed.y = 1;
          break;

        default:
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.keyCode) {
        case keys.left:
          this.speed.x = 0;
          this.updateIcon('left');
          break;

        case keys.right:
          this.speed.x = 0;
          this.updateIcon('right');
          break;

        case keys.up:
          this.speed.y = 0;
          break;

        case keys.down:
          this.speed.y = 0;
          break;

        default:
          break;
      }
    });

    this.timeBeforeSteps = 0;

    this.timer = new Timer();
    this.timer.addTask((deltaTime, time) => {
      this.go(deltaTime, time);
    });
    this.timer.start();
  }

  go(deltaTIme, time) {
    if (time - this.timeBeforeSteps > 200) {
      this.timeBeforeSteps = time;

      if (this.speed.x > 0) {
        this.animate(['go-right', 'go-right-2']);
      } else if (this.speed.x < 0) {
        this.animate(['go-left', 'go-left-2']);
      }
    }

    this.item.x += this.speed.x;
    this.item.y += this.speed.y;

    const collisionList = searchCollisions(this.layer.objects, [this.item]);
    resolveCollisions(collisionList);

    if (this.speed.x > 0) {
      const mapWidth = this.options.map.width;
      const layerWidth = this.layer.width;
      const iconWidth = this.item.icon.sWidth;
      const offsetCameraX = this.options.camera.x;

      let offsetX = this.layer.map.offset.x;

      if (this.item.x > mapWidth - iconWidth) {
        this.item.x = mapWidth - iconWidth;
      }

      let dx = this.item.x + offsetCameraX;
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
    } else if (this.speed.x < 0) {
      const { x: offsetX } = this.layer.map.offset;

      if (this.item.x < 0) {
        this.item.x = 0;
      } else if (this.item.x < offsetX) {
        this.item.x = offsetX;
      }

      this.layer.update();
    }

    if (this.speed.x !== 0 || this.speed.y !== 0) {
      this.layer.update();
    }
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

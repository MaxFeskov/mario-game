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
          this.speed.x = -2;
          break;

        case keys.right:
          this.speed.x = 2;
          break;

        case keys.up:
          this.speed.y = -2;
          break;

        case keys.down:
          this.speed.y = 2;
          break;

        default:
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.keyCode) {
        case keys.left:
          this.speed.x = 0;
          this.updateIcon('mario-left');
          break;

        case keys.right:
          this.speed.x = 0;
          this.updateIcon('mario-right');
          break;

        case keys.up:
          if (this.layer.map.gravity) {
            this.speed.y = 1;
          } else {
            this.speed.y = 0;
          }
          break;

        case keys.down:
          if (this.layer.map.gravity) {
            this.speed.y = 1;
          } else {
            this.speed.y = 0;
          }
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
        this.animate(['mario-go-right', 'mario-go-right-2']);
      } else if (this.speed.x < 0) {
        this.animate(['mario-go-left', 'mario-go-left-2']);
      }
    }

    this.item.x += this.speed.x;
    this.item.y += this.speed.y;

    const collisionList = searchCollisions(this.layer.objects, [this.item]);
    resolveCollisions(collisionList);

    if (this.speed.x > 0) {
      const mapWidth = this.layer.map.width;
      const layerWidth = this.layer.width;
      const iconWidth = this.item.icon.sWidth;
      const offsetCameraX = this.layer.map.camera.x;

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
    this.updateIcon('mario-sit-down');
  }

  stop() {
    this.timer.stop();
    this.timer.clearTask();
  }

  getBaseIcon() {
    return this.updateIcon('mario-right');
  }
}

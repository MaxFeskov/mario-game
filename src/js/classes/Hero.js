import Element from './Element';
import Sprite from './Sprite';

export default class Hero extends Element {
  constructor(name, Layer, options) {
    super(name, Layer, options);

    console.log('this is Hero');
  }

  getBaseIcon() {
    const sprite = new Sprite(this.spriteConfig);
    return sprite.getItem('right');
  }
}

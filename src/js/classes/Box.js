import Element from './Element';
import Timer from './Timer';

export default class Box extends Element {
  constructor(name, Layer, options) {
    super(name, Layer, options);

    this.timer = new Timer(2.5);

    this.timer.addTask(() => {
      this.animate(['box_2', 'box_3', 'box']);
    });

    this.timer.start();
  }

  destroy() {
    this.timer.stop();
    this.timer.clearTask();

    this.updateIcon('box_3');
  }
}

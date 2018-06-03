import Element from './Element';
import Timer from './Timer';

export default class Box extends Element {
  constructor(name, Layer, options) {
    super(name, Layer, options);

    this.timer = new Timer(2.5);

    this.timer.addTask(() => {
      this.animate(['box-2', 'box-3', 'box']);
    });

    this.timer.start();
  }

  destroy() {
    this.timer.stop();
    this.timer.clearTask();

    this.updateIcon('box-3');
  }
}

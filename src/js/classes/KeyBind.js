export default class KeyBind {
  constructor() {
    this.events = new Set();
  }

  bind(event, keyCode) {
    this.events.add({
      event,
      keyCode,
    });

    window.addEventListener('keydown', (e) => {
      console.log(e.keyCode);

      if (e.keyCode === keyCode) {
        console.log(event);
      }
    });
  }

  show() {
    this.events.forEach(event => console.table(event));
  }
}

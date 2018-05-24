export default class Sprite {
  constructor(sprite) {
    this.image = sprite.image;
    this.items = sprite.config.items;
  }

  getItem(name) {
    const item = this.items.filter(element => element.name === name).shift();

    if (item && Object.keys(item) !== 0) {
      item.image = this.image;
      delete item.name;
    }

    return item;
  }
}

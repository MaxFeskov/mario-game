export default class Sprite {
  constructor(sprite) {
    this.image = sprite.image;
    this.items = sprite.config.items;
  }

  getItem(name) {
    const item = this.items.filter(element => element.name === name)[0];

    if (item && Object.keys(item) !== 0) {
      const result = Object.assign({}, item);

      result.image = this.image;
      delete result.name;

      return result;
    }

    return null;
  }
}

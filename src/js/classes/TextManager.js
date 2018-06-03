export default class TextManager {
  constructor(context, options = {}) {
    const defaultOptions = {
      fontSize: 16,
      fillStyle: '#fff',
      textAlign: 'left',
      textBaseline: 'top',
    };

    this.context = context;
    this.options = Object.assign({}, defaultOptions, options);
    this.storage = {};
  }

  addText(text, x, y, options = {}, id) {
    this.context.save();
    const textID = id || new Date().getTime();
    const textOptions = this.setTextStyle(Object.assign({}, this.options, options));

    this.context.fillText(text, x, y);
    const width = this.textWidth(text);
    const height = this.textHeight(text);

    Object.assign(textOptions, {
      x,
      y,
      width,
      height,
    });

    this.storage[`${textID}`] = textOptions;
    this.context.restore();

    return textID;
  }

  removeText(textID, removeFormStorage = true) {
    if (Object.keys(this.storage).includes(`${textID}`)) {
      const options = this.storage[`${textID}`];
      const {
        textAlign, textBaseline, width, height,
      } = options;

      let {
        x, y,
      } = options;

      if (textAlign === 'right') {
        x -= width;
      } else if (textAlign === 'center') {
        x -= width / 2;
      }

      if (textBaseline === 'bottom') {
        y -= height;
      } else if (textBaseline === 'middle') {
        y -= height / 2;
      }

      if (removeFormStorage) {
        delete this.storage[`${textID}`];
      }

      this.context.clearRect(x, y, width, height);
    }
  }

  replaceText(textID, newText) {
    if (Object.keys(this.storage).includes(`${textID}`)) {
      const options = this.storage[`${textID}`];
      const {
        x, y,
      } = options;

      this.removeText(textID, false);
      this.addText(newText, x, y, options, textID);
    }
  }

  setTextStyle(options) {
    const {
      fontSize, fillStyle, textBaseline, textAlign,
    } = options;

    this.context.font = `${fontSize}px Emulogic`;
    this.context.fillStyle = fillStyle;
    this.context.textAlign = textAlign;
    this.context.textBaseline = textBaseline;

    return {
      fontSize,
      fillStyle,
      textBaseline,
      textAlign,
    };
  }

  textWidth(text) {
    return this.context.measureText(text).width;
  }

  textHeight() {
    const { font } = this.context;
    const parent = document.createElement('span');

    parent.appendChild(document.createTextNode('height'));
    document.body.appendChild(parent);
    parent.style.cssText = `font: ${font}; white-space: nowrap; display: inline;`;
    const height = parent.offsetHeight;
    document.body.removeChild(parent);

    return height;
  }
}

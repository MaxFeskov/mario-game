(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.FontFaceOnload = factory();
	}
}(this, function () {
	'use strict';

	var TEST_STRING = 'AxmTYklsjo190QW',
		SANS_SERIF_FONTS = 'sans-serif',
		SERIF_FONTS = 'serif',

		defaultOptions = {
			tolerance: 2, // px
			delay: 100,
			glyphs: '',
			success: function() {},
			error: function() {},
			timeout: 5000,
			weight: '400', // normal
			style: 'normal',
			window: window
		},

		// See https://github.com/typekit/webfontloader/blob/master/src/core/fontruler.js#L41
		style = [
			'display:block',
			'position:absolute',
			'top:-999px',
			'left:-999px',
			'font-size:48px',
			'width:auto',
			'height:auto',
			'line-height:normal',
			'margin:0',
			'padding:0',
			'font-variant:normal',
			'white-space:nowrap'
		],
		html = '<div style="%s" aria-hidden="true">' + TEST_STRING + '</div>';

	var FontFaceOnloadInstance = function() {
		this.fontFamily = '';
		this.appended = false;
		this.serif = undefined;
		this.sansSerif = undefined;
		this.parent = undefined;
		this.options = {};
	};

	FontFaceOnloadInstance.prototype.getMeasurements = function () {
		return {
			sansSerif: {
				width: this.sansSerif.offsetWidth,
				height: this.sansSerif.offsetHeight
			},
			serif: {
				width: this.serif.offsetWidth,
				height: this.serif.offsetHeight
			}
		};
	};

	FontFaceOnloadInstance.prototype.load = function () {
		var startTime = new Date(),
			that = this,
			serif = that.serif,
			sansSerif = that.sansSerif,
			parent = that.parent,
			appended = that.appended,
			dimensions,
			options = that.options,
			ref = options.reference;

		function getStyle( family ) {
			return style
				.concat( [ 'font-weight:' + options.weight, 'font-style:' + options.style ] )
				.concat( "font-family:" + family )
				.join( ";" );
		}

		var sansSerifHtml = html.replace( /\%s/, getStyle( SANS_SERIF_FONTS ) ),
			serifHtml = html.replace( /\%s/, getStyle(  SERIF_FONTS ) );

		if( !parent ) {
			parent = that.parent = options.window.document.createElement( "div" );
		}

		parent.innerHTML = sansSerifHtml + serifHtml;
		sansSerif = that.sansSerif = parent.firstChild;
		serif = that.serif = sansSerif.nextSibling;

		if( options.glyphs ) {
			sansSerif.innerHTML += options.glyphs;
			serif.innerHTML += options.glyphs;
		}

		function hasNewDimensions( dims, el, tolerance ) {
			return Math.abs( dims.width - el.offsetWidth ) > tolerance ||
				Math.abs( dims.height - el.offsetHeight ) > tolerance;
		}

		function isTimeout() {
			return ( new Date() ).getTime() - startTime.getTime() > options.timeout;
		}

		(function checkDimensions() {
			if( !ref ) {
				ref = options.window.document.body;
			}
			if( !appended && ref ) {
				ref.appendChild( parent );
				appended = that.appended = true;

				dimensions = that.getMeasurements();

				// Make sure we set the new font-family after we take our initial dimensions:
				// handles the case where FontFaceOnload is called after the font has already
				// loaded.
				sansSerif.style.fontFamily = that.fontFamily + ', ' + SANS_SERIF_FONTS;
				serif.style.fontFamily = that.fontFamily + ', ' + SERIF_FONTS;
			}

			if( appended && dimensions &&
				( hasNewDimensions( dimensions.sansSerif, sansSerif, options.tolerance ) ||
				hasNewDimensions( dimensions.serif, serif, options.tolerance ) ) ) {

				options.success();
			} else if( isTimeout() ) {
				options.error();
			} else {
				if( !appended && "requestAnimationFrame" in options.window ) {
					options.window.requestAnimationFrame( checkDimensions );
				} else {
					options.window.setTimeout( checkDimensions, options.delay );
				}
			}
		})();
	}; // end load()

	FontFaceOnloadInstance.prototype.cleanFamilyName = function( family ) {
		return family.replace( /[\'\"]/g, '' ).toLowerCase();
	};

	FontFaceOnloadInstance.prototype.cleanWeight = function( weight ) {
		// lighter and bolder not supported
		var weightLookup = {
			normal: '400',
			bold: '700'
		};

		return '' + (weightLookup[ weight ] || weight);
	};

	FontFaceOnloadInstance.prototype.checkFontFaces = function( timeout ) {
		var _t = this;
		_t.options.window.document.fonts.forEach(function( font ) {
			if( _t.cleanFamilyName( font.family ) === _t.cleanFamilyName( _t.fontFamily ) &&
				_t.cleanWeight( font.weight ) === _t.cleanWeight( _t.options.weight ) &&
				font.style === _t.options.style ) {
				font.load().then(function() {
					_t.options.success( font );
					_t.options.window.clearTimeout( timeout );
				});
			}
		});
	};

	FontFaceOnloadInstance.prototype.init = function( fontFamily, options ) {
		var timeout;

		for( var j in defaultOptions ) {
			if( !options.hasOwnProperty( j ) ) {
				options[ j ] = defaultOptions[ j ];
			}
		}

		this.options = options;
		this.fontFamily = fontFamily;

		// For some reason this was failing on afontgarde + icon fonts.
		if( !options.glyphs && "fonts" in options.window.document ) {
			if( options.timeout ) {
				timeout = options.window.setTimeout(function() {
					options.error();
				}, options.timeout );
			}

			this.checkFontFaces( timeout );
		} else {
			this.load();
		}
	};

	var FontFaceOnload = function( fontFamily, options ) {
		var instance = new FontFaceOnloadInstance();
		instance.init(fontFamily, options);

		return instance;
	};

	return FontFaceOnload;
}));

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Box extends _Element2.default {
  constructor(name, Layer, options) {
    super(name, Layer, options);

    this.timer = new _Timer2.default(2.5);

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
exports.default = Box;

},{"./Element":3,"./Timer":11}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sprite = require('./Sprite');

var _Sprite2 = _interopRequireDefault(_Sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Element {
  constructor(name, layer, options) {
    const {
      i, j, gridStep, position, type = 'object'
    } = options;

    this.name = name;
    this.layer = layer;
    this.options = options;
    this.speed = {
      x: 0,
      y: 0
    };

    this.item = {
      name,
      type,
      x: i * gridStep,
      y: j * gridStep
    };

    const icon = this.getBaseIcon();

    const {
      x: positionX = 0, y: positionY = 0
    } = position;

    if (positionX) {
      if (typeof positionX === 'number') {
        this.item.x += positionX * gridStep;
      } else {
        switch (positionX) {
          case 'center':
            this.item.x += (gridStep - icon.sWidth) / 2;
            break;

          case 'right':
            this.item.x += icon.sWidth;
            break;

          default:
            break;
        }
      }
    }

    if (positionY) {
      if (typeof positionY === 'number') {
        this.item.y += positionY * gridStep;
      } else {
        switch (positionY) {
          case 'center':
            this.item.y += (gridStep - icon.sHeifgt) / 2;
            break;

          case 'bottom':
            this.item.y -= icon.sHeight - gridStep;
            break;

          default:
            break;
        }
      }
    }

    this.layer.update();
  }

  getElementLink() {
    return this.item;
  }

  updateIcon(iconName) {
    this.icon = iconName;
    const sprite = new _Sprite2.default(this.options.spriteConfig);
    const itemSprite = sprite.getItem(iconName);

    if (itemSprite) {
      this.item.icon = itemSprite;
    }

    return itemSprite;
  }

  getBaseIcon() {
    return this.updateIcon(this.name);
  }

  animate(icons) {
    const iconCount = icons.length;
    const nextIconNumber = (icons.indexOf(this.icon) + 1) % iconCount;
    const nextIconName = icons[Number(nextIconNumber)];

    this.updateIcon(nextIconName);
    this.layer.update();
  }

  destroy() {
    this.layer.removeItem(this.item);
  }
}
exports.default = Element;

},{"./Sprite":9}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loaders = require('../modules/loaders');

var _GameMap = require('./GameMap');

var _GameMap2 = _interopRequireDefault(_GameMap);

var _SoundManager = require('./SoundManager');

var _SoundManager2 = _interopRequireDefault(_SoundManager);

var _TextManager = require('./TextManager');

var _TextManager2 = _interopRequireDefault(_TextManager);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Game {
  constructor() {
    this.infoLayer = document.getElementById('info');
    this.infoLayerContext = this.infoLayer.getContext('2d');
    this.textManager = new _TextManager2.default(this.infoLayerContext);

    this.addScorePanel();
    this.addTimePanel();
    this.addWorldPanel();
    this.addCoinPanel();
    this.addLivesPanel();
    this.addInfoMessage();

    Promise.all([(0, _loaders.loadJSON)('/build/configs/map.json'), (0, _loaders.loadSprite)('/build/sprite/objects.json'), (0, _loaders.loadSprite)('/build/sprite/backgrounds.json'), (0, _loaders.loadJSON)('/build/sound/track-list.json')]).then(([map, objectsSpriteConfig, backgroundsSpriteConfig, trackList]) => {
      if (trackList) {
        this.time = 400;
        this.soundManager = new _SoundManager2.default(trackList);

        this.sounds = {
          main: this.soundManager.add({
            repeat: true,
            volume: 0.5
          }, 'main-theme'),
          gameover: this.soundManager.add({
            repeat: false,
            volume: 0.5
          }, 'gameover')
        };

        this.soundManager.play(this.sounds.main);
      }

      const spriteConfig = {
        objects: objectsSpriteConfig,
        backgrounds: backgroundsSpriteConfig
      };

      const gameMap = new _GameMap2.default(map, spriteConfig);
      gameMap.init();

      this.updateScorePanel(0);
      this.updateWorldPanel('1-1');
      this.updateCoinPanel(0);
      this.updateLivesPanel(1);

      this.timer = new _Timer2.default();
      this.timer.addTask(deltaTime => {
        this.time -= deltaTime / 1000;

        if (this.time < 0) {
          this.time = 0;
          this.gameOver();
        }

        this.updateTimePanel(this.time.toFixed(0));
      });
      this.timer.start();
    });
  }

  start() {
    console.log('start');
  }

  pause() {
    this.updateInfoMessage('Pause');
  }

  continue() {
    this.updateInfoMessage('');
  }

  addInfoMessage(value = '') {
    this.infoMessage = this.textManager.addText(value, this.infoLayer.width / 2, this.infoLayer.height / 2, {
      textAlign: 'center',
      textBaseline: 'middle'
    });
  }

  updateInfoMessage(value = '') {
    this.textManager.replaceText(this.infoMessage, value);
  }

  addScorePanel(value = '') {
    this.scoreTitle = this.textManager.addText('Score', 116, 20, { textAlign: 'center' }, 'scoreTitle');
    this.scoreVal = this.textManager.addText(value, 116, 42, { textAlign: 'center' }, 'scoreVal');
  }

  updateScorePanel(value = '') {
    this.textManager.replaceText(this.scoreVal, value);
  }

  addTimePanel(value = '') {
    this.timeTitle = this.textManager.addText('Time', 306, 20, { textAlign: 'center' }, 'timeTitle');
    this.timeVal = this.textManager.addText(value, 306, 42, { textAlign: 'center' }, 'timeVal');
  }

  updateTimePanel(value = '') {
    this.textManager.replaceText(this.timeVal, value);
  }

  addWorldPanel(value = '') {
    this.worldTitle = this.textManager.addText('World', 496, 20, { textAlign: 'center' }, 'worldTitle');
    this.worldVal = this.textManager.addText(value, 496, 42, { textAlign: 'center' }, 'worldVal');
  }

  updateWorldPanel(value = '') {
    this.textManager.replaceText(this.worldVal, value);
  }

  addCoinPanel(value = '') {
    this.coinsTitle = this.textManager.addText('Coins', 686, 20, { textAlign: 'center' }, 'coinsTitle');
    this.coinsVal = this.textManager.addText(value, 686, 42, { textAlign: 'center' }, 'coinsVal');
  }

  updateCoinPanel(value = '') {
    this.textManager.replaceText(this.coinsVal, value);
  }

  addLivesPanel(value = '') {
    this.livesTitle = this.textManager.addText('Lives', 876, 20, { textAlign: 'center' }, 'livesTitle');
    this.livesVal = this.textManager.addText(value, 876, 42, { textAlign: 'center' }, 'livesVal');
  }

  updateLivesPanel(value = '') {
    this.textManager.replaceText(this.livesVal, value);
  }

  gameOver() {
    this.timer.clearTask();
    this.infoLayer.style.backgroundColor = '#000';
    this.updateInfoMessage('Game over');
    this.soundManager.stopAll();
    this.soundManager.play(this.sounds.gameover);
  }
}
exports.default = Game;

},{"../modules/loaders":15,"./GameMap":5,"./SoundManager":8,"./TextManager":10,"./Timer":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Layer = require('./Layer');

var _Layer2 = _interopRequireDefault(_Layer);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _Hero = require('./Hero');

var _Hero2 = _interopRequireDefault(_Hero);

var _Box = require('./Box');

var _Box2 = _interopRequireDefault(_Box);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GameMap {
  constructor(map, spriteConfig) {
    const {
      elements = [], settings = {}
    } = map.locations[0];

    this.settings = settings;
    this.gravity = settings.gravity || false;
    this.gridStep = 32;
    this.layers = [];
    this.width = settings.width * this.gridStep;
    this.height = settings.height * this.gridStep;
    this.offset = {
      x: 0,
      y: 0
    };
    this.camera = {
      x: settings.camera[0] * this.gridStep || 0,
      y: settings.camera[1] * this.gridStep || 0
    };

    const backgroundColor = settings.background;
    const backgroundLayer = new _Layer2.default(document.getElementById('background'), this, { backgroundColor });
    this.layers.push(backgroundLayer);

    const mainLayer = new _Layer2.default(document.getElementById('main'), this);
    this.layers.push(mainLayer);

    elements.forEach(item => {
      item.ranges.forEach(([i1, j1, i2 = i1, j2 = j1]) => {
        for (let i = i1; i <= i2; i += 1) {
          for (let j = j1; j <= j2; j += 1) {
            if (item.type === 'background') {
              this.addItem(item, {
                i,
                j,
                layer: backgroundLayer,
                sprite: spriteConfig.backgrounds
              });
            } else {
              this.addItem(item, {
                i,
                j,
                layer: mainLayer,
                sprite: spriteConfig.objects
              });
            }
          }
        }
      });
    });
  }

  addItem(item, options) {
    const {
      i, j
    } = options;

    const repeatRangesStep = item.repeatRangesStep || [];
    const position = item.position || {};

    let stepX = 1;
    let stepY = 1;
    let maxPosX = i;
    let maxPosY = j;

    if (repeatRangesStep[0] > 0) {
      ({ 0: stepX } = repeatRangesStep);
      maxPosX = this.settings.width;
    }

    if (repeatRangesStep[1] > 0) {
      ({ 1: stepY } = repeatRangesStep);
      maxPosY = this.settings.height;
    }

    for (let posX = i; posX <= maxPosX; posX += stepX) {
      for (let posY = j; posY <= maxPosY; posY += stepY) {
        const elementOptions = {
          i: posX,
          j: posY,
          gridStep: this.gridStep,
          position
        };

        const {
          layer, sprite
        } = options;

        let element;

        if (item.type === 'background') {
          elementOptions.spriteConfig = sprite;
          element = new _Element2.default(item.name, layer, elementOptions);
        } else {
          switch (item.type) {
            case 'hero':
              elementOptions.spriteConfig = sprite;
              elementOptions.type = 'personage';
              element = new _Hero2.default(item.name, layer, elementOptions);
              break;

            case 'box':
              elementOptions.spriteConfig = sprite;
              element = new _Box2.default(item.name, layer, elementOptions);
              break;

            default:
              elementOptions.spriteConfig = sprite;
              element = new _Element2.default(item.name, layer, elementOptions);
              break;
          }
        }

        layer.addItem(element.getElementLink());
      }
    }
  }

  init() {
    this.layers.forEach(layer => {
      layer.update();
    });
  }

  getOffset() {
    return this.offset;
  }

  move(x, y) {
    this.offset.x = x;
    this.offset.y = y;

    this.layers.forEach(layer => {
      layer.update();
    });
  }
}
exports.default = GameMap;

},{"./Box":2,"./Element":3,"./Hero":6,"./Layer":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _collisions = require('../modules/collisions');

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

var _keyMap = require('../modules/keyMap');

var _keyMap2 = _interopRequireDefault(_keyMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Hero extends _Element2.default {
  constructor(name, layer, options) {
    super(name, layer, options);

    this.isGo = false;
    this.camera = {
      x: 160,
      y: 0
    };

    window.addEventListener('keydown', e => {
      switch (e.keyCode) {
        case _keyMap2.default.left:
          this.speed.x = -2;
          break;

        case _keyMap2.default.right:
          this.speed.x = 2;
          break;

        case _keyMap2.default.up:
          this.speed.y = -2;
          break;

        case _keyMap2.default.down:
          this.speed.y = 2;
          break;

        default:
          break;
      }
    });

    window.addEventListener('keyup', e => {
      switch (e.keyCode) {
        case _keyMap2.default.left:
          this.speed.x = 0;
          this.updateIcon('mario-left');
          break;

        case _keyMap2.default.right:
          this.speed.x = 0;
          this.updateIcon('mario-right');
          break;

        case _keyMap2.default.up:
          if (this.layer.map.gravity) {
            this.speed.y = 1;
          } else {
            this.speed.y = 0;
          }
          break;

        case _keyMap2.default.down:
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

    this.timer = new _Timer2.default();
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

    const collisionList = (0, _collisions.searchCollisions)(this.layer.objects, [this.item]);
    (0, _collisions.resolveCollisions)(collisionList);

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
exports.default = Hero;

},{"../modules/collisions":13,"../modules/keyMap":14,"./Element":3,"./Timer":11}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Timer = require('./Timer');

var _Timer2 = _interopRequireDefault(_Timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Layer {
  constructor(element, map, options = {}) {
    const canvas = element;
    const context = canvas.getContext('2d');
    canvas.style.backgroundColor = options.backgroundColor || 'transparent';
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = context;
    this.needRedraw = true;
    this.objects = [];
    this.map = map;

    const timer = new _Timer2.default();
    timer.addTask(() => {
      this.draw();
    });
    timer.start();
  }

  addItem(item) {
    this.objects.push(item);
  }

  removeItem(item) {
    const index = this.objects.indexOf(item);

    if (index !== -1) {
      this.objects.splice(index, 1);
    }
  }

  update() {
    this.needRedraw = true;
  }

  draw() {
    if (this.needRedraw) {
      this.context.clearRect(0, 0, this.width, this.height);

      const dx = this.map.offset.x;

      this.objects.forEach(element => {
        this.drawItem(element, dx);
      });

      this.needRedraw = false;
    }
  }

  drawItem(element, dx) {
    if (element.icon) {
      const {
        x, y
      } = element;

      const {
        image, sx, sy, sWidth, sHeight
      } = element.icon;

      if (x - this.width <= dx && dx <= x + sWidth) {
        this.context.drawImage(image, sx, sy, sWidth, sHeight, x - dx, y, sWidth, sHeight);
      }
    }
  }
}
exports.default = Layer;

},{"./Timer":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class SoundManager {
  constructor(trackList = {}) {
    this.trackList = trackList;
    this.trackListName = Object.keys(trackList);

    this.playedSounds = new Set();
    this.stopedSounds = new Set();
  }

  add(settings, ...queue) {
    const {
      autoplay = false, repeat = false, volume = 1
    } = settings;

    const audio = document.createElement('audio');
    audio.volume = volume;
    audio.dataset.current = 0;

    const sound = {
      audio,
      queue
    };

    if (autoplay) {
      this.play(sound);
    }

    audio.addEventListener('ended', () => {
      const next = Number(audio.dataset.current) + 1;

      if (sound.queue[`${next}`] !== undefined) {
        audio.dataset.current = next;
        this.play(sound);
      } else if (repeat) {
        audio.dataset.current = 0;
        this.play(sound);
      } else {
        this.stopedSounds.delete(sound);
      }
    });

    return sound;
  }

  play(sound) {
    const {
      audio, queue
    } = sound;

    const soundNumber = Number(audio.dataset.current);
    const soundName = queue[`${soundNumber}`];

    if (this.trackListName.includes(soundName)) {
      if (audio) {
        const newSrc = this.trackList[`${soundName}`].track;

        if (!audio.src.includes(newSrc)) {
          audio.src = newSrc;
        }

        audio.play();
        this.playedSounds.add(sound);
      }
    }
  }

  pause(sound) {
    const { audio } = sound;

    if (audio) {
      audio.play().then(() => {
        audio.pause();

        this.playedSounds.delete(sound);
        this.stopedSounds.add(sound);
      });
    }
  }

  stop(sound) {
    const { audio } = sound;

    if (audio) {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.dataset.current = 0;

        this.playedSounds.delete(sound);
        this.stopedSounds.add(sound);
      });
    }
  }

  static volume(sound, value) {
    if (value >= 0 && value <= 1) {
      const { audio } = sound;

      audio.volume = value;
    }
  }

  setVolume(sound, value) {
    this.constructor.volume(sound, value);
  }

  mute(sound) {
    const { audio } = sound;
    audio.dataset.volume = audio.volume;

    this.setVolume(sound, 0);
  }

  unmute(sound) {
    const { audio } = sound;

    this.setVolume(sound, audio.dataset.volume);
  }

  playAll() {
    this.stopedSounds.forEach(sound => {
      this.play(sound);
    });
  }

  pauseAll() {
    this.playedSounds.forEach(sound => {
      this.pause(sound);
    });
  }

  stopAll() {
    this.playedSounds.forEach(sound => {
      this.stop(sound);
    });
  }

  setVolumeAll(value) {
    this.playedSounds.forEach(sound => {
      this.setVolume(sound, value);
    });

    this.stopedSounds.forEach(sound => {
      this.setVolume(sound, value);
    });
  }

  muteAll() {
    this.playedSounds.forEach(sound => {
      this.mute(sound);
    });

    this.stopedSounds.forEach(sound => {
      this.mute(sound);
    });
  }

  unmuteAll() {
    this.playedSounds.forEach(sound => {
      this.unmute(sound);
    });

    this.stopedSounds.forEach(sound => {
      this.unmute(sound);
    });
  }
}
exports.default = SoundManager;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Sprite {
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
exports.default = Sprite;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class TextManager {
  constructor(context, options = {}) {
    const defaultOptions = {
      fontSize: 16,
      fillStyle: '#fff',
      textAlign: 'left',
      textBaseline: 'top'
    };

    this.context = context;
    this.options = Object.assign({}, defaultOptions, options);
    this.storage = {};
  }

  static generateID() {
    return new Date().getTime();
  }

  addText(text, x, y, options = {}, id) {
    this.context.save();
    const textID = id || this.constructor.generateID();
    const textOptions = this.setTextStyle(Object.assign({}, this.options, options));

    this.context.fillText(text, x, y);
    const width = this.textWidth(text);
    const height = this.textHeight(text);

    Object.assign(textOptions, {
      x,
      y,
      width,
      height
    });

    this.storage[`${textID}`] = textOptions;
    this.context.restore();

    return textID;
  }

  removeText(textID, removeFormStorage = true) {
    if (Object.keys(this.storage).includes(`${textID}`)) {
      const options = this.storage[`${textID}`];
      const {
        textAlign, textBaseline, width, height
      } = options;

      let {
        x, y
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
        x, y
      } = options;

      this.removeText(textID, false);
      this.addText(newText, x, y, options, textID);
    }
  }

  setTextStyle(options) {
    const {
      fontSize, fillStyle, textBaseline, textAlign
    } = options;

    this.context.font = `${fontSize}px Emulogic`;
    this.context.fillStyle = fillStyle;
    this.context.textAlign = textAlign;
    this.context.textBaseline = textBaseline;

    return {
      fontSize,
      fillStyle,
      textBaseline,
      textAlign
    };
  }

  textWidth(text) {
    return this.context.measureText(text).width + 2;
  }

  textHeight() {
    const { font } = this.context;
    const parent = document.createElement('span');

    parent.appendChild(document.createTextNode('height'));
    document.body.appendChild(parent);
    parent.style.cssText = `font: ${font}; white-space: nowrap; display: inline;`;
    const height = parent.offsetHeight;
    document.body.removeChild(parent);

    return height + 2;
  }
}
exports.default = TextManager;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Timer {
  constructor(fps = 60) {
    this.deltaTime = parseInt(1000 / fps, 10);
    this.lastTime = 0;
    this.tasks = new Set();

    this.update = time => {
      const deltaTime = time - this.lastTime;

      if (this.TimerID) {
        if (deltaTime >= this.deltaTime) {
          this.tasks.forEach(task => {
            task(deltaTime, time);
          });

          this.lastTime = time;
        }

        this.TimerID = window.requestAnimationFrame(this.update);
      }
    };
  }

  addTask(task) {
    if (typeof task === 'function') {
      this.tasks.add(task);
    }
  }

  deleteTask(task) {
    this.tasks.delete(task);
  }

  clearTask() {
    this.tasks = new Set();
  }

  start() {
    if (this.TimerID) {
      this.stop(this.TimerID);
    }

    this.TimerID = window.requestAnimationFrame(this.update);
  }

  stop() {
    this.TimerID = null;
    window.cancelAnimationFrame(this.TimerID);
  }

  pause() {
    this.stop();
  }
}
exports.default = Timer;

},{}],12:[function(require,module,exports){
'use strict';

var _fontfaceonload = require('fontfaceonload');

var _fontfaceonload2 = _interopRequireDefault(_fontfaceonload);

var _Game = require('./classes/Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', () => {
  (0, _fontfaceonload2.default)('Emulogic', { success() {
      const game = new _Game2.default();

      game.start();
    } });
});

},{"./classes/Game":4,"fontfaceonload":1}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minAbsValue = minAbsValue;
exports.resolveCollision = resolveCollision;
exports.resolveCollisions = resolveCollisions;
exports.searchCollisions = searchCollisions;
function minAbsValue(...values) {
  const result = values.reduce((min, item) => {
    if (Math.abs(item) === Math.min(Math.abs(min), Math.abs(item))) {
      return item;
    }
    return min;
  });

  return result;
}

function resolveCollision(objectList, resolveObject) {
  const item = resolveObject;

  const {
    sWidth, sHeight
  } = item.icon;

  objectList.forEach(element => {
    const dx1 = element.x - (sWidth + item.x);
    const dx2 = element.x + (element.icon.sWidth - item.x);

    const dy1 = element.y - (sHeight + item.y);
    const dy2 = element.y + (element.icon.sHeight - item.y);

    const dx = minAbsValue(dx1, dx2);
    const dy = minAbsValue(dy1, dy2);
    const delta = minAbsValue(dx, dy);

    if (delta === dx) {
      item.x += dx;
    } else {
      item.y += dy;
    }
  });
}

function resolveCollisions(collisionList) {
  collisionList.forEach(item => {
    resolveCollision(item.collisions, item.element);
  });
}

function searchCollisions(objectList, resolveObjects) {
  const collisionList = [];

  resolveObjects.forEach(item => {
    const itemCollission = objectList.filter(element => {
      if (item.x >= element.x + element.icon.sWidth) {
        return false;
      }

      if (item.x <= element.x - item.icon.sWidth) {
        return false;
      }

      if (item.y >= element.y + element.icon.sHeight) {
        return false;
      }

      if (item.y <= element.y - item.icon.sHeight) {
        return false;
      }

      if (element === item) {
        return false;
      }

      return true;
    });

    if (itemCollission.length && item.type !== 'object') {
      const collisionItem = {
        element: item,
        collisions: itemCollission
      };

      collisionList.push(collisionItem);
    }
  });

  return collisionList;
}

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  left: 37,
  right: 39,
  up: 38,
  down: 40,
  space: 32,
  ctrl: 17,
  shift: 16
};

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadImage = loadImage;
exports.loadJSON = loadJSON;
exports.loadSprite = loadSprite;
function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

function loadJSON(url) {
  return fetch(url).then(r => r.json());
}

function loadSprite(spriteConfigPath) {
  return loadJSON(spriteConfigPath).then(config => loadImage(config.path).then(image => ({
    image,
    config
  })));
}

},{}]},{},[12]);

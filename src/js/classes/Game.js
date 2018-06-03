import {
  loadSprite, loadJSON,
} from '../modules/loaders';

import GameMap from './GameMap';
import SoundManager from './SoundManager';
import TextManager from './TextManager';
import Timer from './Timer';

export default class Game {
  constructor() {
    this.infoLayer = document.getElementById('info');
    this.infoLayerContext = this.infoLayer.getContext('2d');
    this.textManager = new TextManager(this.infoLayerContext);

    this.addScorePanel();
    this.addTimePanel();
    this.addWorldPanel();
    this.addCoinPanel();
    this.addLivesPanel();
    this.addInfoMessage();

    Promise.all([
      loadJSON('/build/configs/map.json'),
      loadSprite('/build/sprite/objects.json'),
      loadSprite('/build/sprite/backgrounds.json'),
      loadJSON('/build/sound/track-list.json'),
    ]).then(([map, objectsSpriteConfig, backgroundsSpriteConfig, trackList]) => {
      if (trackList) {
        this.time = 400;
        this.soundManager = new SoundManager(trackList);

        this.sounds = {
          main: this.soundManager.add(
            {
              repeat: true,
              volume: 0.5,
            },
            'main-theme',
          ),
          gameover: this.soundManager.add(
            {
              repeat: false,
              volume: 0.5,
            },
            'gameover',
          ),
        };

        this.soundManager.play(this.sounds.main);
      }

      const spriteConfig = {
        objects: objectsSpriteConfig,
        backgrounds: backgroundsSpriteConfig,
      };

      const gameMap = new GameMap(map, spriteConfig);
      gameMap.init();

      this.updateScorePanel(0);
      this.updateWorldPanel('1-1');
      this.updateCoinPanel(0);
      this.updateLivesPanel(1);

      this.timer = new Timer();
      this.timer.addTask((deltaTime) => {
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
    this.infoMessage = this.textManager.addText(
      value,
      this.infoLayer.width / 2,
      this.infoLayer.height / 2,
      {
        textAlign: 'center',
        textBaseline: 'middle',
      },
    );
  }

  updateInfoMessage(value = '') {
    this.textManager.replaceText(this.infoMessage, value);
  }

  addScorePanel(value = '') {
    this.scoreTitle = this.textManager.addText(
      'Score',
      116,
      20,
      { textAlign: 'center' },
      'scoreTitle',
    );
    this.scoreVal = this.textManager.addText(value, 116, 42, { textAlign: 'center' }, 'scoreVal');
  }

  updateScorePanel(value = '') {
    this.textManager.replaceText(this.scoreVal, value);
  }

  addTimePanel(value = '') {
    this.timeTitle = this.textManager.addText(
      'Time',
      306,
      20,
      { textAlign: 'center' },
      'timeTitle',
    );
    this.timeVal = this.textManager.addText(value, 306, 42, { textAlign: 'center' }, 'timeVal');
  }

  updateTimePanel(value = '') {
    this.textManager.replaceText(this.timeVal, value);
  }

  addWorldPanel(value = '') {
    this.worldTitle = this.textManager.addText(
      'World',
      496,
      20,
      { textAlign: 'center' },
      'worldTitle',
    );
    this.worldVal = this.textManager.addText(value, 496, 42, { textAlign: 'center' }, 'worldVal');
  }

  updateWorldPanel(value = '') {
    this.textManager.replaceText(this.worldVal, value);
  }

  addCoinPanel(value = '') {
    this.coinsTitle = this.textManager.addText(
      'Coins',
      686,
      20,
      { textAlign: 'center' },
      'coinsTitle',
    );
    this.coinsVal = this.textManager.addText(value, 686, 42, { textAlign: 'center' }, 'coinsVal');
  }

  updateCoinPanel(value = '') {
    this.textManager.replaceText(this.coinsVal, value);
  }

  addLivesPanel(value = '') {
    this.livesTitle = this.textManager.addText(
      'Lives',
      876,
      20,
      { textAlign: 'center' },
      'livesTitle',
    );
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

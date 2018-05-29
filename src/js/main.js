import FontFaceOnload from 'fontfaceonload';

import {
  loadSprite, loadJSON,
} from './modules/loaders';

// import drawGrid from './modules/grid';
import GameMap from './classes/GameMap';
import SoundManager from './classes/SoundManager';
import TextManager from './classes/TextManager';

async function main() {
  const [
    map,
    objectsSpriteConfig,
    backgroundsSpriteConfig,
    heroSpriteConfig,
    trackList,
  ] = await Promise.all([
    loadJSON('/build/configs/map.json'),
    loadSprite('/build/sprite/objects.json'),
    loadSprite('/build/sprite/backgrounds.json'),
    loadSprite('/build/sprite/hero.json'),
    loadJSON('/build/sound/track-list.json'),
  ]);

  if (trackList) {
    const soundManager = new SoundManager(trackList);
    soundManager.add(
      {
        autoplay: false,
        repeat: true,
        volume: 0.5,
      },
      'main-theme',
    );
  }

  const spriteConfig = {
    objects: objectsSpriteConfig,
    backgrounds: backgroundsSpriteConfig,
    hero: heroSpriteConfig,
  };

  const gameMap = new GameMap(map, spriteConfig);

  const info = document.getElementById('info');
  const infoContext = info.getContext('2d');
  // drawGrid(infoContext);

  const textManager = new TextManager(infoContext);
  const textID = textManager.addText('Super Mario Bros', 32, 32);
}

document.addEventListener('DOMContentLoaded', () => {
  FontFaceOnload('Emulogic', { success() {
    main();
  } });
});

// var merged = new Set([...set1, ...set2, ...set3])

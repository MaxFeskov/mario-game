import FontFaceOnload from 'fontfaceonload';

import {
  loadSprite, loadJSON,
} from './modules/loaders';

// import drawGrid from './modules/grid';
import GameMap from './classes/GameMap';
import SoundManager from './classes/SoundManager';
import TextManager from './classes/TextManager';

async function main() {
  const [map, objectsSpriteConfig, backgroundsSpriteConfig, trackList] = await Promise.all([
    loadJSON('/build/configs/map.json'),
    loadSprite('/build/sprite/objects.json'),
    loadSprite('/build/sprite/backgrounds.json'),
    loadJSON('/build/sound/track-list.json'),
  ]);

  if (trackList) {
    const soundManager = new SoundManager(trackList);
    soundManager.add(
      {
        autoplay: true,
        repeat: true,
        volume: 0.5,
      },
      'main-theme',
    );
  }

  const spriteConfig = {
    objects: objectsSpriteConfig,
    backgrounds: backgroundsSpriteConfig,
  };

  const gameMap = new GameMap(map, spriteConfig);
  gameMap.init();

  const info = document.getElementById('info');
  const infoContext = info.getContext('2d');
  // drawGrid(infoContext);

  const textManager = new TextManager(infoContext);
  textManager.addText('Super Mario Bros', 32, 32);
}

document.addEventListener('DOMContentLoaded', () => {
  FontFaceOnload('Emulogic', { success() {
    main();
  } });
});

// var merged = new Set([...set1, ...set2, ...set3])

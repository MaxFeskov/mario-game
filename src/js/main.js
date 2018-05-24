import {
  loadSprite, loadJSON,
} from './modules/loaders';

import drawGrid from './modules/grid';
import SoundManager from './classes/SoundManager';
import GameMap from './classes/GameMap';

async function main() {
  const [map, objectSprite, backgroundSprite, trackList] = await Promise.all([
    loadJSON('/build/configs/map.json'),
    loadSprite('/build/sprite/objects.json'),
    loadSprite('/build/sprite/backgrunds.json'),
    loadJSON('/build/sound/track-list.json'),
  ]);

  if (trackList) {
    const soundManager = new SoundManager(trackList);
    soundManager.add(
      {
        autoplay: false,
        repeat: true,
        volume: 0.1,
      },
      'main-theme',
    );
  }

  const layers = [
    {
      name: 'main',
      element: document.getElementById('main'),
      map: map.locations[0].main,
      sprite: objectSprite,
    },
    {
      name: 'background',
      element: document.getElementById('background'),
      map: map.locations[0].background,
      sprite: backgroundSprite,
    },
  ];

  const options = {
    map,
    backgroundSprite,
    layers,
  };

  const gameMap = new GameMap(options);
  gameMap.draw();
}

document.addEventListener('DOMContentLoaded', () => {
  const info = document.getElementById('background');
  const infoContext = info.getContext('2d');
  drawGrid(infoContext);

  main();
});

// var merged = new Set([...set1, ...set2, ...set3])

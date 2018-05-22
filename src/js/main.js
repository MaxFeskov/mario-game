import {
  loadImage, loadJSON,
} from './modules/loaders';

import SoundManager from './classes/SoundManager';
import GameMap from './classes/GameMap';

// import drawGrid from './modules/grid';

const levelNumber = 1;

async function main(context) {
  const [levelMap, tilesConfig, tilesImg, trackList] = await Promise.all([
    loadJSON(`/build/configs/${levelNumber}/map.json`),
    loadJSON(`/build/configs/${levelNumber}/tiles.json`),
    loadImage(`/build/configs/${levelNumber}/tiles.png`),
    loadJSON('/build/configs/track-list.json'),
  ]);

  const map = new GameMap(context, levelMap, tilesImg, tilesConfig);
  map.draw();

  const soundManager = new SoundManager(trackList);
  soundManager.add(
    {
      autoplay: true,
      repeat: true,
      volume: 0.1,
    },
    'main-theme',
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  context.strokeStyle = '#000';
  context.lineWidth = 0.25;

  // drawGrid(context);
  main(context);
});

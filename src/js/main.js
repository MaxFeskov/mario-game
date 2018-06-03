import FontFaceOnload from 'fontfaceonload';
import Game from './classes/Game';

document.addEventListener('DOMContentLoaded', () => {
  FontFaceOnload('Emulogic', { success() {
    const game = new Game();

    game.start();
  } });
});

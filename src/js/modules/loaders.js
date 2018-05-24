export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadJSON(url) {
  return fetch(url).then(r => r.json());
}

export function loadSprite(spriteConfigPath) {
  return loadJSON(spriteConfigPath).then(config =>
    loadImage(config.path).then(image => ({
      image,
      config,
    })));
}

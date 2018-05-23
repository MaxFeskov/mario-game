const srcPath = {
  locale: 'ru',
  lineending: '\n',
  compassHelperTemplate: './gulp-tasks/scss-imagehelper.mustache',
  data: './src/data/',
  font: './src/fonts/**/*.*',
  html: ['src/pug/*.pug', '!src/pug/_*.pug'],
  image: ['./src/img/**/*.*', '!src/img/images/**/*.*'],
  script: './src/js/*.js',
  sprites: './src/sprites/',
  spritesTemplate: './gulp-tasks/spritesmith.mustache',
  style: './src/scss/*.scss',
  vendor: './src/configs/**/*.*',
};

const buildPath = {
  compassHelper: './src/scss/helpers/',
  font: './build/fonts/',
  html: './',
  image: './build/img/',
  sprites: './build/sprites/',
  script: './build/js/',
  style: './build/css/',
  vendor: './build/configs/',
};

let watchPath = {
  html: ['./src/pug/**/*.pug', './src/data/**/*.json'],
  script: ['./src/js/**/*.js', './build/configs/**/*.*'],
  style: './src/scss/**/*.scss',
};

// src path is default watch path
watchPath = Object.assign({}, srcPath, watchPath);

module.exports = { path: {
  build: buildPath,
  src: srcPath,
  watch: watchPath,
} };

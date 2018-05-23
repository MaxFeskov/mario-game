const {
  $, taskPath: path,
} = global;

const gulp = require('gulp');
const del = require('del');

const gulpWatch = gulp.watch;

const {
  lstatSync, readdirSync,
} = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

gulp.task('clean:sprites', () => del(path.build.sprites));

gulp.task('build:sprites', (cb) => {
  getDirectories(path.src.sprites).forEach((directory) => {
    const spriteName = directory.split('\\').pop();

    gulp
      .src(join(directory, '**/*.png'))
      .pipe($.spritesmith({
        imgName: `${spriteName}.png`,
        cssName: `${spriteName}.json`,
        cssTemplate: path.src.spritesTemplate,
      }))
      .pipe(gulp.dest(path.build.sprites));
  });

  cb();
});

gulp.task('dev:sprites', gulp.series('build:sprites'));

gulp.task('watch:sprites', () =>
  gulpWatch(path.watch.sprites, gulp.series('dev:sprites', 'server:reload')));

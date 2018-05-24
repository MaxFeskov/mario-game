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

gulp.task('clean:sprite', () => del(path.build.sprite));

gulp.task('build:sprite', (cb) => {
  getDirectories(path.src.sprite).forEach((directory) => {
    const spriteName = directory.split('\\').pop();

    gulp
      .src(join(directory, '**/*.png'))
      .pipe($.spritesmith({
        padding: 2,
        imgName: `${spriteName}.png`,
        cssName: `${spriteName}.json`,
        cssTemplate: path.src.spriteTemplate,
        cssOpts: { path: `${path.build.sprite.replace('./', '/')}${spriteName}.png` },
      }))
      .pipe(gulp.dest(path.build.sprite));
  });

  cb();
});

gulp.task('dev:sprite', gulp.series('build:sprite'));

gulp.task('watch:sprite', () =>
  gulpWatch(path.watch.sprite, gulp.series('dev:sprite', 'server:reload')));

const {
  $, taskPath: path,
} = global;

const gulp = require('gulp');
const del = require('del');

const gulpWatch = gulp.watch;

gulp.task('clean:sound', () => del(path.build.sound));

gulp.task('build:sound', () =>
  gulp
    .src(path.src.sound)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.newer(path.build.sound))
    .pipe(gulp.dest(path.build.sound)));

gulp.task('dev:sound', gulp.series('build:sound'));

gulp.task('watch:sound', () =>
  gulpWatch(path.watch.sound, gulp.series('dev:sound', 'server:reload')));

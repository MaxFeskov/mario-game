const {
  $, taskPath: path,
} = global;

const gulp = require('gulp');
const del = require('del');

const gulpWatch = gulp.watch;

gulp.task('clean:vendor', () => del(path.build.vendor));

gulp.task('build:vendor', () =>
  gulp
    .src(path.src.vendor)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.newer(path.build.vendor))
    .pipe(gulp.dest(path.build.vendor)));

gulp.task('dev:vendor', gulp.series('build:vendor'));

gulp.task('watch:vendor', () =>
  gulpWatch(path.watch.vendor, gulp.series('dev:vendor', 'server:reload')));

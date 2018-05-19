const {
  $, taskPath: path,
} = global;

const gulp = require('gulp');
const del = require('del');

const gulpWatch = gulp.watch;

gulp.task('clean:font', () => del(path.build.font));

gulp.task('build:font', () =>
  gulp
    .src(path.src.font)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.newer(path.build.font))
    .pipe(gulp.dest(path.build.font)));

gulp.task('dev:font', gulp.series('build:font'));

gulp.task('watch:font', () => gulpWatch(path.watch.font, gulp.series('dev:font', 'server:reload')));

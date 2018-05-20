const {
  $, taskPath: path,
} = global;

const gulp = require('gulp');
const del = require('del');
const filePath = require('path');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const gulpWatch = gulp.watch;

gulp.task('clean:script', () => del(path.build.script));

gulp.task('build:script', () =>
  gulp
    .src(path.src.script)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.data((file) => {
      const fileFullName = file.path;
      const fileNameForSave = `${filePath.basename(fileFullName)}`;

      return (
        browserify(fileFullName)
          .transform(babelify)
          .bundle()
          .on('error', global.errorHandler)
          .pipe(source(fileNameForSave))
          .pipe(buffer())
        // .pipe($.uglify())
          .pipe(gulp.dest(path.build.script))
      );
    })));

gulp.task('dev:script', () =>
  gulp
    .src(path.src.script)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.sourcemaps.init())
    .pipe($.data((file) => {
      const fileFullName = file.path;
      const fileNameForSave = `${filePath.basename(fileFullName)}`;

      return browserify(fileFullName)
        .transform(babelify)
        .bundle()
        .on('error', global.errorHandler)
        .pipe(source(fileNameForSave))
        .pipe(buffer())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.build.script));
    })));

gulp.task('watch:script', () =>
  gulpWatch(path.watch.script, gulp.series('dev:script', 'server:reload')));

const {
  $, taskPath: path,
} = global;

const gulp = require('gulp');
const del = require('del');

const gulpWatch = gulp.watch;

gulp.task('clean:style', () => del(path.build.style));

gulp.task('build:style', () =>
  gulp
    .src(path.src.style)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.sass_glob())
    .pipe($.sass())
    .on('error', (err) => {
      $.sass.logError.bind(this)(err);
    })
    .pipe($.autoprefixer())
    .pipe($.cssmin())
    .pipe($.eol(path.src.lineending))
    .pipe($.insert.append(path.src.lineending))
    .pipe($.ext_replace('.min.css'))
    .pipe(gulp.dest(path.build.style)));

gulp.task('dev:style', () =>
  gulp
    .src(path.src.style)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.sourcemaps.init())
    .pipe($.sass_glob())
    .pipe($.sass({
      outputStyle: 'expanded',
      indentWidth: 2,
    }))
    .on('error', () => {
      this.emit('end');
    })
    .pipe($.autoprefixer())
    .pipe($.eol(path.src.lineending))
    .pipe($.insert.append(path.src.lineending))
    .pipe($.ext_replace('.min.css'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.build.style)));

gulp.task('watch:style', () =>
  gulpWatch(path.watch.style, gulp.series('dev:style', 'server:reload')));

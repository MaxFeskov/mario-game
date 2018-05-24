global.$ = require('gulp-load-plugins')({ renameFn(name) {
  return name
    .replace('gulp-', '')
    .replace('gulp.', '')
    .replace(/-/g, '_');
} });

global.errorHandler = (err) => {
  const { $ } = global;

  $.notify.onError({
    title: `Gulp error in ${err.plugin}`,
    message: err.toString(),
  })(err);
};

global.taskPath = require('./config').path;

const gulp = require('gulp');
const requireDir = require('require-dir');

requireDir('./gulp-tasks', { recurse: true });

gulp.task(
  'clean',
  gulp.parallel(
    'clean:image',
    'clean:sprite',
    'clean:font',
    'clean:vendor',
    'clean:script',
    'clean:html',
    'clean:style',
  ),
);

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel('build:image', 'build:sprite', 'build:font', 'build:vendor', 'build:script'),
    gulp.parallel('build:style'),
    'build:html',
  ),
);

gulp.task(
  'watch',
  gulp.parallel(
    'watch:image',
    'watch:sprite',
    'watch:font',
    'watch:vendor',
    'watch:script',
    'watch:style',
    'watch:html',
  ),
);

gulp.task(
  'dev',
  gulp.series(
    gulp.parallel('dev:image', 'dev:sprite', 'dev:font', 'dev:vendor', 'dev:script'),
    gulp.parallel('dev:style'),
    'dev:html',
  ),
);

gulp.task('default', gulp.series('dev', gulp.parallel('server:init', 'watch')));

const {
  $, taskPath: path,
} = global;

const gulp = require('gulp');
const del = require('del');
const filePath = require('path');
const fs = require('fs');
const yargs = require('yargs');

const { argv } = yargs;

const gulpWatch = gulp.watch;

gulp.task('clean:html', () => del(`${path.build.html}*.html`));

gulp.task('build:html', () =>
  gulp
    .src(path.src.html)
    .pipe($.plumber({ errorHandler: global.errorHandler }))
    .pipe($.data((file) => {
      const existsFile = fs.existsSync;
      const readFile = fs.readFileSync;
      const locale = argv.locale || path.src.locale;

      const pathBaseFile = `${path.src.data + locale}/_all.json`;
      const pathPageFile = `${path.src.data + locale}/${filePath.basename(
        file.path,
        '.pug',
      )}.json`;
      const pathCustomPageFile = `${path.src.data + locale}/custom/${filePath.basename(
        file.path,
        '.pug',
      )}.json`;

      let BaseData = {};
      let PageData = {};
      let CustomData = {};

      if (existsFile(pathBaseFile)) {
        BaseData = JSON.parse(readFile(pathBaseFile));
      }

      if (existsFile(pathPageFile)) {
        PageData = JSON.parse(readFile(pathPageFile));
      }

      if (existsFile(pathCustomPageFile)) {
        CustomData = JSON.parse(readFile(pathCustomPageFile));
      }

      const result = { localeData: Object.assign({}, BaseData, PageData, CustomData) };

      return result;
    }))
    .pipe($.pug({ basedir: '.' }))
    .pipe($.prettydiff({
      lang: 'html',
      mode: 'beautify',
      inchar: ' ',
      insize: 2,
      force_indent: true,
      wrap: 0,
      crlf: false,
      textpreserve: true,
      spaceclose: true,
      newline: true,
    }))
    .pipe($.insert.append(path.src.lineending))
    .pipe($.htmllint())
    .pipe(gulp.dest(path.build.html)));

gulp.task('dev:html', gulp.series('build:html'));

gulp.task('watch:html', () => gulpWatch(path.watch.html, gulp.series('dev:html', 'server:reload')));

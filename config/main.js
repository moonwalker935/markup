import { parallel, series, src, dest } from 'gulp';
import { deleteSync } from 'del';
import htmlMin from 'gulp-htmlmin';
import replace from 'gulp-replace';
import pug from 'gulp-pug';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import { sass } from '@mr-hope/gulp-sass';
import less from 'gulp-less';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import ts from 'gulp-typescript';

import { paths } from './paths.js';
import { getWorkDirFileExtensions } from './utils.js';


class Task {
  static cleanDist = (callback) => {
    deleteSync(`${paths.output}/**/*`, { force: true });
    callback();
  };

  static html = () => {
    return src(`${paths.entry}/**/*.html`)
      .pipe(replace(
        /=".*\.(pug)"/g,
        (match, found) => match.replace(`.${found}`, '.html'),
      ))
      .pipe(replace(
        /=".*\.(scss|sass|less|styl)"/g,
        (match, found) => match.replace(`.${found}`, '.css'),
      ))
      .pipe(replace(
        /=".*\.(ts)"/g,
        (match, found) => match.replace(`.${found}`, '.js'),
      ))
      .pipe(htmlMin({ collapseWhitespace: false }))
      .pipe(dest(paths.output))
  };

  static pug = () => {
    return src(`${paths.entry}/**/*.pug`)
      .pipe(pug())
      .pipe(replace(
        /=".*\.(pug)"/g,
        (match, found) => match.replace(`.${found}`, '.html'),
      ))
      .pipe(replace(
        /=".*\.(scss|sass|less|styl)"/g,
        (match, found) => match.replace(`.${found}`, '.css'),
      ))
      .pipe(replace(
        /=".*\.(ts)"/g,
        (match, found) => match.replace(`.${found}`, '.js'),
      ))
      .pipe(htmlMin({ collapseWhitespace: false }))
      .pipe(dest(paths.output))
  };

  static css = () => {
    return src(`${paths.entry}/**/*.css`)
      // options here https://github.com/postcss/autoprefixer#options
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(dest(paths.output));
  };

  static sass = () => {
    return src(`${paths.entry}/**/*.{sass,scss}`)
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(dest(paths.output));
  };

  static less = () => {
    return src(`${paths.entry}/**/*.less`)
      .pipe(less())
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(dest(paths.output));
  };

  static javascript = () => {
    return src(`${paths.entry}/**/*.js`)
      .pipe(babel({ presets: ['@babel/env'] }))
      .pipe(uglify())
      .pipe(dest(paths.output));
  };

  static typescript = () => {
    return src(`${paths.entry}/**/*.ts`)
      .pipe(ts())
      .pipe(babel({ presets: ['@babel/env'] }))
      .pipe(uglify())
      .pipe(dest(paths.output));
  };

  static images = () => {
    return src(`${paths.entry}/**/*.{png,jpg,gif,ico,webp}`, { removeBOM: false })
      .pipe(dest(paths.output));
  };

  static fonts = () => {
    return src(`${paths.entry}/**/*.{ttf,otf,woff,eot}`, { removeBOM: false })
      .pipe(dest(paths.output));
  };
}

const entryFileExtensions = getWorkDirFileExtensions(paths.entry);

const htmlTasks = (() => {
  const tasks = [];
  if (entryFileExtensions.includes('html')) tasks.push(Task.html);
  if (entryFileExtensions.includes('pug')) tasks.push(Task.pug);
  return tasks;
})();

const cssTasks = (() => {
  const tasks = [];
  if (entryFileExtensions.includes('css')) tasks.push(Task.css);
  if (
    entryFileExtensions.includes('sass') ||
    entryFileExtensions.includes('scss')
  ) tasks.push(Task.sass);
  if (entryFileExtensions.includes('less')) tasks.push(Task.less);
  return tasks;
})();

const jsTasks = (() => {
  const tasks = [];
  if (entryFileExtensions.includes('js')) tasks.push(Task.javascript);
  if (entryFileExtensions.includes('ts')) tasks.push(Task.typescript);
  return tasks;
})();

const assetTasks = (() => {
  const tasks = [];
  if (
    entryFileExtensions.includes('png') ||
    entryFileExtensions.includes('jpg') ||
    entryFileExtensions.includes('webp') ||
    entryFileExtensions.includes('gif') ||
    entryFileExtensions.includes('ico')
  ) tasks.push(Task.images);
  if (
    entryFileExtensions.includes('ttf')
    || entryFileExtensions.includes('otf')
  ) tasks.push(Task.fonts);
  return tasks;
})();

const build = series(
  Task.cleanDist,
  parallel(
    parallel(...htmlTasks),
    parallel(...cssTasks),
    parallel(...jsTasks),
    parallel(...assetTasks),
  ),
);

export { build };

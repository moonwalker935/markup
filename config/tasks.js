import { dest, src } from 'gulp';
import { deleteSync } from 'del';
import replace from 'gulp-replace';
import htmlMin from 'gulp-htmlmin';
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


const cleanDist = callback => {
  deleteSync(`${paths.output}/**/*`, { force: true });
  callback();
};

const _cleanHtml = transform => transform
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
  .pipe(htmlMin({ collapseWhitespace: true }))
  .pipe(dest(paths.output));

const cleanHtml = () => _cleanHtml(src(`${paths.entry}/**/*.html`));

const compilePug = () => _cleanHtml(
  src(`${paths.entry}/**/*.pug`)
    .pipe(pug()),
);

const _cleanCss = transform => transform
  // options here https://github.com/postcss/autoprefixer#options
  .pipe(autoprefixer())
  .pipe(cleanCSS())
  .pipe(dest(paths.output));

const cleanCss = () => _cleanCss(src(`${paths.entry}/**/*.css`));

const compileSass = () => _cleanCss(
  src(`${paths.entry}/**/*.{sass,scss}`)
    .pipe(sass().on('error', sass.logError)),
);

const compileLess = () => _cleanCss(
  src(`${paths.entry}/**/*.less`)
    .pipe(less()),
);

const _cleanJs = transform => transform
  .pipe(babel({ presets: ['@babel/env'] }))
  .pipe(uglify())
  .pipe(dest(paths.output));

const cleanJs = () => _cleanJs(src(`${paths.entry}/**/*.js`));

const compileTs = () => _cleanJs(
  src(`${paths.entry}/**/*.ts`)
    .pipe(ts()),
);

const moveImages = () => src(`${paths.entry}/**/*.{png,jpg,gif,ico,webp}`, { removeBOM: false })
  .pipe(dest(paths.output));

const moveFonts = () => src(`${paths.entry}/**/*.{ttf,otf,woff,eot}`, { removeBOM: false })
  .pipe(dest(paths.output));

const moveDocs = () => src(`${paths.entry}/**/*.{txt}`)
  .pipe(dest(paths.output));

const entryHas = getWorkDirFileExtensions(paths.entry).reduce((extensions, extension) => {
  extensions[extension] = true;
  return extensions;
}, {});

const htmlTasks = (() => {
  const tasks = [];
  if (entryHas.html) tasks.push(cleanHtml);
  if (entryHas.pug) tasks.push(compilePug);
  return tasks;
})();

const cssTasks = (() => {
  const tasks = [];
  if (entryHas.css) tasks.push(cleanCss);
  if (entryHas.sass || entryHas.scss) tasks.push(compileSass);
  if (entryHas.less) tasks.push(compileLess);
  return tasks;
})();

const jsTasks = (() => {
  const tasks = [];
  if (entryHas.js) tasks.push(cleanJs);
  if (entryHas.ts) tasks.push(compileTs);
  return tasks;
})();

const assetTasks = (() => {
  const tasks = [];
  if (entryHas.png || entryHas.jpg || entryHas.webp || entryHas.gif || entryHas.ico) tasks.push(moveImages);
  if (entryHas.ttf || entryHas.otf || entryHas.woff || entryHas.eot) tasks.push(moveFonts);
  if (entryHas.txt) tasks.push(moveDocs);
  return tasks;
})();

export {
  cleanDist,
  cleanHtml,
  compilePug,
  cleanCss,
  compileSass,
  compileLess,
  cleanJs,
  compileTs,
  moveImages,
  moveFonts,
  moveDocs,
  entryHas,
  htmlTasks,
  cssTasks,
  jsTasks,
  assetTasks,
};

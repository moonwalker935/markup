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


const cleanDist = (callback) => {
  deleteSync(`${paths.output}/**/*`, { force: true });
  callback();
};

const cleanHtml = () => {
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

const compilePug = () => {
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

const cleanCss = () => {
  return src(`${paths.entry}/**/*.css`)
    // options here https://github.com/postcss/autoprefixer#options
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(dest(paths.output));
};

const compileSass = () => {
  return src(`${paths.entry}/**/*.{sass,scss}`)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(dest(paths.output));
};

const compileLess = () => {
  return src(`${paths.entry}/**/*.less`)
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(dest(paths.output));
};

const cleanJs = () => {
  return src(`${paths.entry}/**/*.js`)
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(dest(paths.output));
};

const compileTs = () => {
  return src(`${paths.entry}/**/*.ts`)
    .pipe(ts())
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(dest(paths.output));
};

const moveImages = () => {
  return src(`${paths.entry}/**/*.{png,jpg,gif,ico,webp}`, { removeBOM: false })
    .pipe(dest(paths.output));
};

const moveFonts = () => {
  return src(`${paths.entry}/**/*.{ttf,otf,woff,eot}`, { removeBOM: false })
    .pipe(dest(paths.output));
};

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
};

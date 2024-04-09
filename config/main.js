import { parallel, series, src, dest } from 'gulp';
import { deleteSync } from 'del';
import htmlMin from 'gulp-htmlmin';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

import { paths } from './paths.js';
import { getWorkDirFileExtensions } from './utils.js';


class Tasks {
  workDirFileExtensions = getWorkDirFileExtensions(paths.workDir);

  clean = (callback) => {
    deleteSync(`${paths.dist}/**/*`, { force: true });
    callback();
  };

  html = () => {
    return src(`${paths.workDir}/**/*.html`)
      .pipe(htmlMin({ collapseWhitespace: true }))
      .pipe(dest(paths.dist))
  };

  javascript = () => {
    return src(`${paths.workDir}/**/*.js`)
      .pipe(babel({ presets: ['@babel/env'] }))
      .pipe(uglify())
      .pipe(dest(paths.dist));
  };

  css = () => {
    return src(`${paths.workDir}/**/*.css`)
      // options here https://github.com/postcss/autoprefixer#options
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(dest(paths.dist));
  };

  images = () => {
    return src(`${paths.workDir}/**/*.{png,jpg,gif,webp}`, { removeBOM: false })
      .pipe(dest(paths.dist));
  };
}

const tasks = new Tasks();

const build = series(
  tasks.clean,
  parallel(
    tasks.html,
    tasks.javascript,
    tasks.css,
    tasks.images,
  ),
);

export { build };

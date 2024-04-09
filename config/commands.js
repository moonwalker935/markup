import { parallel, series } from 'gulp';

import { getWorkDirFileExtensions } from './utils.js';
import { paths } from './paths.js';
import {
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
} from './tasks.js';


const entryFileExtensions = getWorkDirFileExtensions(paths.entry);

const htmlTasks = (() => {
  const tasks = [];
  if (entryFileExtensions.includes('html')) tasks.push(cleanHtml);
  if (entryFileExtensions.includes('pug')) tasks.push(compilePug);
  return tasks;
})();

const cssTasks = (() => {
  const tasks = [];
  if (entryFileExtensions.includes('css')) tasks.push(cleanCss);
  if (
    entryFileExtensions.includes('sass') ||
    entryFileExtensions.includes('scss')
  ) tasks.push(compileSass);
  if (entryFileExtensions.includes('less')) tasks.push(compileLess);
  return tasks;
})();

const jsTasks = (() => {
  const tasks = [];
  if (entryFileExtensions.includes('js')) tasks.push(cleanJs);
  if (entryFileExtensions.includes('ts')) tasks.push(compileTs);
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
  ) tasks.push(moveImages);
  if (
    entryFileExtensions.includes('ttf')
    || entryFileExtensions.includes('otf')
  ) tasks.push(moveFonts);
  return tasks;
})();

const build = series(
  cleanDist,
  parallel(
    parallel(...htmlTasks),
    parallel(...cssTasks),
    parallel(...jsTasks),
    parallel(...assetTasks),
  ),
);

export {
  build,
};

import { parallel, watch } from 'gulp';
import connect from 'gulp-connect';

import { paths } from '../paths.js';
import {
  cleanDist,
  cleanCss,
  cleanHtml,
  cleanJs,
  compileLess,
  compilePug,
  compileSass,
  compileTs,
  moveFonts,
  moveImages,
  moveDocs,
  entryHas,
  assetTasks,
  cssTasks,
  htmlTasks,
  jsTasks,
} from '../tasks.js';


cleanDist(() => {});

connect.server({
  root: paths.output,
  livereload: true,
  port: 3001,
});

if (entryHas.html) watch([`${paths.entry}/**/*.html`], function clean_html(args) {
  return cleanHtml(...args).pipe(connect.reload());
});
if (entryHas.pug) watch([`${paths.entry}/**/*.pug`], function compile_pug(...args) {
  return compilePug(...args).pipe(connect.reload());
});

if (entryHas.css) watch([`${paths.entry}/**/*.css`], function clean_css(...args) {
  return cleanCss(...args).pipe(connect.reload());
});
if (entryHas.sass || entryHas.scss) watch([`${paths.entry}/**/*.{sass,scss}`], function compile_sass(...args) {
  return compileSass(...args).pipe(connect.reload());
});
if (entryHas.less) watch([`${paths.entry}/**/*.less`], function compile_less(...args) {
  return compileLess(...args).pipe(connect.reload());
});

if (entryHas.js) watch([`${paths.entry}/**/*.js`], function clean_js(...args) {
  return cleanJs(...args).pipe(connect.reload());
});
if (entryHas.ts) watch([`${paths.entry}/**/*.ts`], function compile_ts(...args) {
  return compileTs(...args).pipe(connect.reload());
});

if (
  entryHas.png
  || entryHas.jpg
  || entryHas.webp
  || entryHas.gif
  || entryHas.ico
) watch([`${paths.entry}/**/*.{png,jpg,webp,gif,ico}`], function move_images(...args) {
  return moveImages(...args).pipe(connect.reload());
});
if (
  entryHas.ttf
  || entryHas.otf
  || entryHas.woff
  || entryHas.eot
) watch([`${paths.entry}/**/*.{ttf,otf,woff,eot}`], function move_fonts(...args) {
  return moveFonts(...args).pipe(connect.reload());
});
if (entryHas.txt) watch([`${paths.entry}/**/*.{txt}`], function move_docs(...args) {
  return moveDocs(...args).pipe(connect.reload());
});

const mainTask = [
  htmlTasks.length && parallel(...htmlTasks),
  cssTasks.length && parallel(...cssTasks),
  jsTasks.length && parallel(...jsTasks),
  assetTasks.length && parallel(...assetTasks),
].filter(Boolean);

const serve = parallel(...mainTask);

export { serve };

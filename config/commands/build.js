import { series, parallel} from 'gulp';

import {
  cleanDist,
  htmlTasks,
  cssTasks,
  jsTasks,
  assetTasks,
} from '../tasks.js';


const build = series(
  cleanDist,
  parallel(
    parallel(...htmlTasks),
    parallel(...cssTasks),
    parallel(...jsTasks),
    parallel(...assetTasks),
  ),
);

export { build };

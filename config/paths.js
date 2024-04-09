import path from 'path';

import { getArgument } from './utils.js';


const paths = {
  root: path.join(process.cwd(), '..'),
  dist: path.join(process.cwd(), '..', 'dist'),
};

paths.workDir = path.join(paths.root, 'src', getArgument('name'));

export { paths };

import path from 'path';

import { getArgument } from './utils.js';


const paths = {
  root: path.join(import.meta.dirname, '..'),
  output: path.join(import.meta.dirname, '..', 'dist'),
};

paths.entry = path.join(paths.root, 'src', getArgument('name'));

export { paths };

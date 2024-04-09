import path from 'path';

import { getArgument } from './utils.js';


const paths = {
  root: path.join(process.cwd(), '..'),
  output: path.join(process.cwd(), '..', 'dist'),
};

paths.entry = path.join(paths.root, 'src', getArgument('name'));

export { paths };

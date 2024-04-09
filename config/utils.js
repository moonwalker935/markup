import path from 'path';

import { globSync } from 'glob';


export const getArgument = (argumentName) => {
  const argument = process.argv.find(arg => arg.startsWith('--') && arg.includes(`${argumentName}=`));
  const [, value] = (argument || '').split('=');
  return value || '';
};

export const getWorkDirFileExtensions = (workDir) => {
  const filePaths = globSync(`${workDir}/**/*`, { withFileTypes: true });
  const extensions = filePaths.map(posix => path.extname(posix.name)).filter(Boolean);
  return [...new Set(extensions)];
};

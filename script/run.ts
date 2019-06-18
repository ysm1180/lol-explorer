import { join } from 'path';
import { spawn, SpawnOptions } from 'child_process';
import * as fs from 'fs';
import { getExecutableName, getDistPath } from './dist-info';

const distPath = getDistPath();
const productName = getExecutableName();

let binaryPath = '';
if (process.platform === 'win32') {
  binaryPath = join(distPath, `${productName}.exe`);
} else if (process.platform === 'linux') {
  binaryPath = join(distPath, productName);
} else {
  console.error(`Don't find excutable file ${process.platform} ${process.arch}`);
  process.exit(1);
}

export function run(spawnOptions: SpawnOptions) {
  try {
    // eslint-disable-next-line no-sync
    const stats = fs.statSync(binaryPath);
    if (!stats.isFile()) {
      return null;
    }
  } catch (e) {
    return null;
  }

  const opts = Object.assign({}, spawnOptions);

  opts.env = Object.assign(opts.env || {}, process.env, {
    NODE_ENV: 'development',
  });

  return spawn(binaryPath, [], opts);
}

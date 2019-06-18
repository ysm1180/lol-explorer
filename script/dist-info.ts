import * as path from 'path';

const projectRoot = path.join(__dirname, '..');

export function getDistRoot() {
  return path.join(projectRoot, 'dist');
}

export function getDistPath() {
  return path.join(getDistRoot(), `${getExecutableName()}-${process.platform}-x64`);
}

export function getExecutableName() {
  const suffix = process.env.NODE_ENV === 'development' ? '-dev' : '';
  return `Gasi${suffix}`;
}

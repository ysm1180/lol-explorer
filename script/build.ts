import * as path from 'path';
import * as cp from 'child_process';
import * as fs from 'fs-extra';
import * as packager from 'electron-packager';
import { externals } from '../app/webpack.common';

import { getProductName } from '../app/package-info';
import { getExecutableName, getDistRoot } from './dist-info';

type PackageLookup = { [key: string]: string };

type Package = {
  dependencies: PackageLookup;
  devDependencies: PackageLookup;
};

const projectRoot = path.join(__dirname, '..');
const outRoot = path.join(projectRoot, 'out');
const distRoot = getDistRoot();

const environment = process.env.NODE_ENV || 'development';
const isPublishableBuild = environment !== 'development';

console.log(`Building for ${environment}…`);

console.log('Removing old distribution…');
fs.removeSync(distRoot);

console.log('Copying dependencies…');
copyDependencies();

console.log('Copying static resources…');
copyStaticResources();

console.log('Packaging…');
packageApp()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .then(appPaths => {
    console.log(`Built to ${appPaths}`);
  });

function packageApp() {
  const toPackagePlatform = (platform: NodeJS.Platform) => {
    if (platform === 'win32' || platform === 'darwin' || platform === 'linux') {
      return platform;
    }
    throw new Error(`Unable to convert to platform for electron-packager: '${process.platform}`);
  };

  const toPackageArch = (targetArch: string | undefined): packager.arch => {
    if (targetArch === undefined) {
      return 'x64';
    }

    if (targetArch === 'arm64' || targetArch === 'x64') {
      return targetArch;
    }

    throw new Error(`Building Desktop for architecture '${targetArch}'  is not supported`);
  };

  const options: packager.Options = {
    name: getExecutableName(),
    platform: toPackagePlatform(process.platform),
    arch: toPackageArch(process.env.TARGET_ARCH),
    asar: false,
    out: distRoot,
    // icon: path.join(projectRoot, 'app', 'static', 'logos', 'icon-logo'),
    dir: outRoot,
    overwrite: true,
    tmpdir: false,
    derefSymlinks: false,
    prune: false,
    ignore: [
      new RegExp('/node_modules/electron($|/)'),
      new RegExp('/node_modules/electron-packager($|/)'),
      new RegExp('/\\.git($|/)'),
      new RegExp('/node_modules/\\.bin($|/)'),
    ],
    appCopyright: 'Copyright © 2019 ysm1180.',

    // Windows
    win32metadata: {
      CompanyName: 'ysm1180',
      FileDescription: '',
      OriginalFilename: '',
      ProductName: getProductName(),
      InternalName: getProductName(),
    },
  };

  return packager(options);
}


function copyStaticResources() {
  const common = path.join(projectRoot, 'app', 'static', 'assets');
  const destination = path.join(outRoot, 'static');
  fs.removeSync(destination);
  fs.copySync(common, destination, { overwrite: false });
}

function copyDependencies() {
  // eslint-disable-next-line import/no-dynamic-require
  const originalPackage: Package = require(path.join(projectRoot, 'app', 'package.json'));

  const oldDependencies = originalPackage.dependencies;
  const newDependencies: PackageLookup = {};

  for (const name of Object.keys(oldDependencies)) {
    const spec = oldDependencies[name];
    if (externals.indexOf(name) !== -1) {
      newDependencies[name] = spec;
    }
  }

  const oldDevDependencies = originalPackage.devDependencies;
  const newDevDependencies: PackageLookup = {};

  if (!isPublishableBuild) {
    for (const name of Object.keys(oldDevDependencies)) {
      const spec = oldDevDependencies[name];
      if (externals.indexOf(name) !== -1) {
        newDevDependencies[name] = spec;
      }
    }
  }

  const updatedPackage = Object.assign({}, originalPackage, {
    productName: getProductName(),
    dependencies: newDependencies,
    devDependencies: newDevDependencies,
  });

  if (isPublishableBuild) {
    delete updatedPackage.devDependencies;
  }

  fs.writeFileSync(path.join(outRoot, 'package.json'), JSON.stringify(updatedPackage));

  fs.removeSync(path.resolve(outRoot, 'node_modules'));

  if (Object.keys(newDependencies).length || Object.keys(newDevDependencies).length) {
    console.log('  Installing dependencies via yarn…');
    cp.execSync('yarn install', { cwd: outRoot, env: process.env });
  }

  if (!isPublishableBuild) {
    console.log('  Installing 7zip (dependency for electron-devtools-installer)');

    const sevenZipSource = path.resolve(projectRoot, 'node_modules/7zip');
    const sevenZipDestination = path.resolve(outRoot, 'node_modules/7zip');

    fs.mkdirpSync(sevenZipDestination);
    fs.copySync(sevenZipSource, sevenZipDestination);
  }
}

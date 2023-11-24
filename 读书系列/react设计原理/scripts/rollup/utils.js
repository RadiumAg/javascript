import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const pkgPatch = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

function resolvePkgPath(pkgName, isDist) {
  if (isDist) {
    return `${distPath}/${pkgName}`;
  }

  return `${pkgPatch}/${pkgName}`;
}

function getPackageJson(pkgName) {
  const path = `${resolvePkgPath(pkgName)}/package.json`;
  const str = fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(str);
}

function getBaseRollupPlugins(alias = { __DEV__: true }, typescript = {}) {
  return [replace(alias), ts(typescript), cjs()];
}

export { resolvePkgPath, getPackageJson, getBaseRollupPlugins };

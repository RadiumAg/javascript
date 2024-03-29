import generatePackageJson from 'rollup-plugin-generate-package-json';
import { getBaseRollupPlugins, getPackageJson, resolvePkgPath } from './utils';

const { name, module } = getPackageJson('react');
const pkgPath = resolvePkgPath(name);
const pkgDistPath = resolvePkgPath(name, true);

export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'react',
      format: 'umd',
    },
    plugins: [
      ...getBaseRollupPlugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
        }),
      }),
    ],
  },
  // jsx-runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: {
      file: `${pkgDistPath}/jsx-runtime.js`,
      name: 'jsx-runtime',
      format: 'umd',
    },
    plugins: getBaseRollupPlugins(),
  },
];

import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';
import { getBaseRollupPlugins, getPackageJson, resolvePkgPath } from './utils';

const { name, module, peerDependencies } = getPackageJson('react-dom');
const pkgPath = resolvePkgPath(name);
const pkgDistPath = resolvePkgPath(name, true);

export default [
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${pkgDistPath}/index.js`,
        name: 'reactDom',
        format: 'umd',
      },
      {
        file: `${pkgDistPath}/client.js`,
        name: 'client',
        format: 'umd',
      },
    ],
    external: [...Object.keys(peerDependencies), 'scheduler'],
    plugins: [
      ...getBaseRollupPlugins(),
      alias({
        entries: {
          hostConfig: `${pkgPath}/src/hostConfig.ts`,
        },
      }),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          peerDependencies: {
            version,
          },
          main: 'index.js',
        }),
      }),
    ],
  },
  {
    input: `${pkgPath}/test-utils.ts`,
    output: [
      {
        file: `${pkgDistPath}/test-utils.js`,
        name: 'test-utils',
        format: 'umd',
      },
    ],
    external: ['react', 'react-dom'],
    plugins: getBaseRollupPlugins(),
  },
];

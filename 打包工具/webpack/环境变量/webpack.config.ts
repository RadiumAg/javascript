import * as path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';

const config = (env: unknown) => {
  console.log(env);

  return {
    entry: './src/index.js',
    mode: 'development',
    output: {
      filename: 'webpack-numbers.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      library: {
        name: 'webpackNumbers',
        type: 'umd',
      },
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_',
      },
    },
  } as webpack.Configuration;
};

export default config;

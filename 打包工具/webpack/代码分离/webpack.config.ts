import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import 'webpack-dev-server';

const config: webpack.Configuration = {
  mode: 'development', // 添加development
  devtool: 'inline-source-map', // 添加sourcemap
  entry: {
    index: {
      import: './src/index.js',
      // dependOn: 'shared',
    },
    another: {
      import: './src/another-module.js',
      // dependOn: 'shared',
    },
    shared: 'lodash',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
  devServer: {
    static: './dist',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [],
  },
};

export default config;

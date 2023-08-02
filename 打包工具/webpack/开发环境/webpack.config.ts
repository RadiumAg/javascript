import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import 'webpack-dev-server';

const config: webpack.Configuration = {
  mode: 'development', // 添加development
  devtool: 'inline-source-map', // 添加sourcemap
  entry: {
    index: './src/index.js',
    print: './src/print.js',
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
    runtimeChunk: 'single',
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

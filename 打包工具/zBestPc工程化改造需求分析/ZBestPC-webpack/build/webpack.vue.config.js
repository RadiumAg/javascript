const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'dev',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
  },
  plugins: [new CleanWebpackPlugin()],
};

module.exports = config;

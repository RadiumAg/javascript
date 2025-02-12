const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'source-map',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },

  module: {
    rules: [{}],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
    }),
  ],
};

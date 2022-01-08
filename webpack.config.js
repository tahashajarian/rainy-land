const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeThreePlugin = require('@vxna/optimize-three-webpack-plugin')


module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './build',
    hot: true,
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      loader: 'babel-loader',
    }, ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: '/index.html'
    }),
    // new OptimizeThreePlugin()

  ],
  optimization: {
    runtimeChunk: 'single',
  },
};
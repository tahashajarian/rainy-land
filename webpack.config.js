const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeThreePlugin = require('@vxna/optimize-three-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')



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
      },
      // Shaders
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader'
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: '/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, './static')
      }]
    }),
    // new OptimizeThreePlugin()

  ],
  optimization: {
    runtimeChunk: 'single',
  },
};
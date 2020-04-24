'use strict'
const path = require('path')
const webpack = require('webpack')
const config = require('./config')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.resolve(process.cwd(), './lib'),
    filename: 'gtong-ui.common.js',
    libraryTarget: "umd",
    library: 'GTONG',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        loader: 'babel-loader',
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
};

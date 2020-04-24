var path = require('path');
var nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
var externals = {};

// externals = [{
//   vue: {
//     root: 'Vue',
//     commonjs: 'vue',
//     commonjs2: 'vue',
//     amd: 'vue'
//   },
//   jquery: 'jQuery'
// },nodeExternals()];

externals = [{
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue'
  },
  axios: 'axios'
  // jquery: {
  //   root: 'jQuery',
  //   commonjs: 'jquery',
  //   commonjs2: 'jquery',
  //   amd: 'jquery'
  // },
}];

exports.externals = externals;

exports.jsexclude = /node_modules/;

exports.alias = {
  '@': path.resolve(__dirname, '../src'),
  'packages': path.resolve(__dirname, '../packages'),
  'static': path.resolve(__dirname, '../static'),
  'gtong-ui': path.resolve(__dirname, '../')
};

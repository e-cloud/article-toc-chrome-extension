'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const devConfig = merge(baseWebpackConfig, {
  entry: {
    app: './src/main.sample.js'
  },
  output: {
    pathinfo: true
  },
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: 'module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'sample/index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

// add hot-reload related code to entry chunks
Object.keys(devConfig.entry).forEach(function (name) {
  devConfig.entry[name] = ['./build/dev-client'].concat(devConfig.entry[name])
})

module.exports = devConfig

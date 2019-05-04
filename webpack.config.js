'use-strict';

const path = require('path');
const webpack = require('webpack');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const devMode = 'development';
const mode = process.env.NODE_ENV || devMode;
const isDevMode = mode === devMode;
const entryPath = path.resolve(__dirname, isDevMode ? 'demo' : 'src');
const distPath = path.resolve(__dirname, 'dist');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config = {
  mode,
  entry: entryPath,
  node: {
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: nodeModulesPath,
        options: {
          cacheDirectory: true,
        },
      }, {
        test: /\.s?css$/,
        exclude: nodeModulesPath,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDevMode,
            },
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: isDevMode,
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevMode,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      nodeModulesPath,
    ],
    alias: {},
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 100,
  },
  devtool: 'eval',
  optimization: {},
  output: {
    path: distPath,
    filename: 'index.js',
  },
  devServer: {
    clientLogLevel: 'none',
    hot: true,
    stats: 'minimal',
    port: 3000,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  target: 'web',
};

const minimazers = [];
const plugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    isDevMode: JSON.stringify(isDevMode),
  }),
  new MiniCssExtractPlugin({
    filename: 'style.css',
  }),
];

// Development mode
if (isDevMode) {
  config.module.rules.push({
    test: /\.jsx?$/,
    enforce: 'pre',
    loader: 'eslint-loader',
    exclude: nodeModulesPath,
  });

  config.resolve.alias['react-dom'] = '@hot-loader/react-dom';

  Array.prototype.push.apply(plugins, [
    new DuplicatePackageCheckerPlugin({
      emitError: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HTMLWebpackPlugin({
      template: `${entryPath}/index.html`,
    }),
  ]);
// Production mode
} else {
  Array.prototype.push.apply(minimazers, [
    new TerserWebpackPlugin({
      cache: true,
      parallel: true,
      exclude: nodeModulesPath,
      terserOptions: {
        mangle: true,
        warnings: false,
        compress: true,
        ie8: true,
        output: {
          comments: false,
          beautify: false,
        },
      },
    }),
    new OptimizeCSSAssetsPlugin(),
  ]);

  config.devtool = false;
  config.watch = false;
}

config.optimization.minimizer = minimazers;
config.plugins = plugins;

module.exports = config;

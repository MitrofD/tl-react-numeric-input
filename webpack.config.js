'use strict';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DuplicatePackageCheckerWebpackPlugin = require('duplicate-package-checker-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');


module.exports = env => {
  const devMode = 'development';
  const mode = env.NODE_ENV || devMode;
  const isDevMode = mode === devMode;
  const entryPath = path.resolve(__dirname, isDevMode ? 'demo' : 'src');
  const distPath = path.resolve(__dirname, 'dist');
  const nodeModulesPath = path.resolve(__dirname, 'node_modules');
  const jsRegExp = /\.jsx?$/;

  const alias = {};
  let devtool = false;

  const moduleRules = [{
    test: jsRegExp,
    exclude: nodeModulesPath,
    use: [
      'thread-loader',
      'babel-loader',
    ],
  }];

  const plugins = [
    new DuplicatePackageCheckerWebpackPlugin({
      verbose: true,
      emitError: true,
    }),
    new webpack.DefinePlugin({
      isDevMode: JSON.stringify(isDevMode),
    }),
  ];

  const cssLoaders = [
    'thread-loader',
  ];

  // Development mode
  if (isDevMode) {
    cssLoaders.unshift('style-loader');

    moduleRules.push({
      test: jsRegExp,
      enforce: 'pre',
      exclude: nodeModulesPath,
      use: [
        'thread-loader',
        {
          loader: 'eslint-loader',
          options: {
            emitError: true,
            emitWarning: true,
          },
        },
      ],
    });

    alias['react-dom'] = '@hot-loader/react-dom';
    plugins.push(new webpack.HotModuleReplacementPlugin());
    devtool = 'eval-source-map';

  // Production mode
  } else {
    cssLoaders.unshift(MiniCSSExtractPlugin.loader);

    Array.prototype.push.apply(plugins, [
      new CleanWebpackPlugin(),
      new MiniCSSExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ]);
  }

  cssLoaders.push({
    loader: 'css-loader',
    options: {
      sourceMap: isDevMode,
    },
  });

  const scssLoaders = cssLoaders.slice();

  scssLoaders.push({
    loader: 'fast-sass-loader',
    options: {
      sourceMap: isDevMode,
    },
  });

  Array.prototype.push.apply(moduleRules, [
    {
      test: /\.css$/,
      exclude: nodeModulesPath,
      use: cssLoaders,
    }, {
      test: /\.s(a|c)ss$/,
      exclude: nodeModulesPath,
      use: scssLoaders,
    },
  ]);

  return {
    devtool,
    mode,
    plugins,
    entry: entryPath,
    module: {
      rules: moduleRules,
    },
    resolve: {
      alias,
      extensions: [
        '.js',
        '.jsx',
        '.json',
      ],
    },
    watch: isDevMode,
    watchOptions: {
      ignored: nodeModulesPath,
    },
    optimization: {
      minimizer: [
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
      ],
    },
    output: {
      filename: 'index.js',
      library: 'TLNumericInput',
      libraryTarget: 'umd',
      path: distPath,
    },
    devServer: {
      contentBase: entryPath,
      clientLogLevel: 'none',
      hot: true,
      stats: 'errors-warnings',
      port: 3000,
      open: true,
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    target: 'web',
  };
};

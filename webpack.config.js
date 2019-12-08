'use-strict';

const path = require('path');
const webpack = require('webpack');
const DuplicatePackageCheckerWebpackPlugin = require('duplicate-package-checker-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


module.exports = function webpackConfig(env) {
  const devMode = 'development';
  const mode = env.NODE_ENV || devMode;
  const isDevMode = mode === devMode;
  const entryPath = path.resolve(__dirname, isDevMode ? 'demo' : 'src');
  const distPath = path.resolve(__dirname, 'dist');
  const nodeModulesPath = path.resolve(__dirname, 'node_modules');

  const cssLoaders = [
    {
      loader: MiniCSSExtractPlugin.loader,
      options: {
        hmr: isDevMode,
      },
    },
    'thread-loader',
    {
      loader: 'css-loader',
      options: {
        sourceMap: isDevMode,
      },
    },
  ];

  const scssLoaders = cssLoaders.slice();

  scssLoaders.push({
    loader: 'fast-sass-loader',
    options: {
      sourceMap: isDevMode,
    },
  });

  const config = {
    mode,
    entry: entryPath,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: nodeModulesPath,
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        }, {
          test: /\.css$/,
          exclude: nodeModulesPath,
          use: cssLoaders,
        }, {
          test: /\.scss$/,
          exclude: nodeModulesPath,
          use: scssLoaders,
        },
      ],
    },
    resolve: {
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
      ]
    },
    output: {
      filename: 'index.js',
      libraryTarget: 'umd',
      path: distPath,
    },
    devServer: {
      clientLogLevel: 'none',
      hot: true,
      stats: {
        all: false,
        modules: true,
        maxModules: 0,
        warnings: true,
      },
      port: 3000,
      open: true,
      overlay: {
        errors: true,
      },
    },
    target: 'web',
  };

  const plugins = [
    new webpack.DefinePlugin({
      isDevMode: JSON.stringify(isDevMode),
    }),
    new MiniCSSExtractPlugin({
      filename: 'style.css',
    }),
  ];

  // Development mode
  if (isDevMode) {
    config.module.rules.push({
      test: /\.jsx?$/,
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

    config.resolve.alias['react-dom'] = '@hot-loader/react-dom';

    Array.prototype.push.apply(plugins, [
      new DuplicatePackageCheckerWebpackPlugin({
        verbose: true,
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
    config.devtool = false;
    config.watch = false;
  }

  config.plugins = plugins;
  return config;
};

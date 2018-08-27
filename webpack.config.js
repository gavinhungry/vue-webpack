const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

const BASE_FILENAME = path.basename(require.main.filename);
const IS_DEV = BASE_FILENAME === 'webpack-dev-server.js';
const IS_TEST = BASE_FILENAME === 'mocha-webpack';

const DEPS_DIR = path.resolve(__dirname, 'node_modules');
const SRC_DIR = path.resolve(__dirname, 'src');
const STATIC_DIR = path.resolve(__dirname, 'static');
const DIST_DIR = path.resolve(__dirname, 'dist');

const PKG = require('./package.json');
const CONFIG = require('./config.json');

let merge = ({ common = [], development = [], production = [], test = [] }) => {
  return IS_TEST ? [...common, ...development, ...test] :
    (IS_DEV ? [...common, ...development] : [...common, ...production]);
};

module.exports = {
  mode: IS_DEV || IS_TEST ? 'development' : 'production',

  externals: merge({
    test: [
      nodeExternals()
    ]
  }),

  performance: {
    hints: false
  },

  devServer: {
    contentBase: STATIC_DIR
  },

  entry: [
    '@babel/polyfill',
    path.join(SRC_DIR, 'index.js')
  ],

  output: {
    path: DIST_DIR,
    filename: 'app.js'
  },

  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      Components: path.join(SRC_DIR, 'components'),
      Lib: path.join(SRC_DIR, 'lib')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC_DIR,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        include: SRC_DIR,
        loader: 'vue-loader'
      },
      {
        test: /\.postcss$/,
        include: SRC_DIR,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: merge({
                common: [
                  require('postcss-import'),
                  require('postcss-cssnext')
                ],

                production: [
                  require('cssnano')({ autoprefixer: false })
                ]
              })
            }
          },
          {
            loader: 'text-transform-loader',
            options: {
              prependText: `@import '${SRC_DIR}/props.css';`
            }
          }
        ],
      },
      {
        test: /\.css$/,
        include: DEPS_DIR,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|otf|png|svg|ttf|woff2?)$/,
        include: DEPS_DIR,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
          name: '[name].[ext]'
        }
      }
    ]
  },

  plugins: merge({
    common: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        APP: JSON.stringify({
          author: PKG.author,
          version: PKG.version,
          homepage: PKG.homepage
        }),

        CONFIG: JSON.stringify(CONFIG)
      })
    ],

    production: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),

      new UglifyJsPlugin(),
      new CopyWebpackPlugin([STATIC_DIR])
    ]
  })
};

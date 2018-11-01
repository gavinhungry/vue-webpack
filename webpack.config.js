const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

const BASE_FILENAME = path.basename(require.main.filename);
const IS_DEV = BASE_FILENAME === 'webpack-dev-server.js';
const IS_TEST = BASE_FILENAME === 'mocha-webpack';
const IS_PROD = !IS_DEV && !IS_TEST;

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
  mode: IS_PROD ? 'production' : 'development',

  externals: merge({
    test: [
      nodeExternals()
    ]
  }),

  performance: {
    hints: false
  },

  optimization: {
    splitChunks: {
      chunks: 'initial',
      filename: 'vendor.js'
    },

    minimize: IS_PROD,
    minimizer: merge({
      production: [
        new TerserPlugin()
      ]
    })
  },

  devServer: {
    contentBase: STATIC_DIR,
    port: 8080
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
      Lib: path.join(SRC_DIR, 'lib'),
      Workers: path.join(SRC_DIR, 'workers')
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
        include: [SRC_DIR, DEPS_DIR],
        loader: 'vue-loader'
      },
      {
        test: /\.postcss$/,
        include: [SRC_DIR, DEPS_DIR],
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: merge({
                common: [
                  require('postcss-import'),
                  require('postcss-preset-env')({
                    stage: 0
                  })
                ],

                production: [
                  require('cssnano')({ autoprefixer: false })
                ]
              })
            }
          }
        ]
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
          homepage: PKG.homepage,
          production: IS_PROD
        }),

        CONFIG: JSON.stringify(CONFIG)
      })
    ],

    development: [
      new BundleAnalyzerPlugin({
        analyzerPort: 8081,
        openAnalyzer: false
      })
    ],

    production: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),

      new CopyWebpackPlugin([STATIC_DIR])
    ]
  })
};

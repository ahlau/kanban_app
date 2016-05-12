// require the path npm lib, and webpack-merge lib
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const NpmInstallPlugin = require('npm-install-webpack-plugin');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event; // 'start' or 'build'
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  style: path.join(__dirname, 'app/main.css')
};
process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.app,
    style: PATHS.style
  }, 
  resolve: {
    // '' is needed to allow imports without an extension, and '.' is required
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build, 
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      }
    ]
  }, 
  plugins: [
    new HtmlWebpackPlugin({
      template: 'node_modules/html-webpack-template/index.ejs',
      title: "Kanban app",
      appMountId: 'app',
      inject: false
    })
  ]
};

// default setup
if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    // setting up a dev server, I guess, with Hot Module Replacement
    devServer: {
      // this replaces package.json's contentbase flag
      contentBase: PATHS.build,
      historyApiFallback: true,
      host: true, 
      inline: true,
      progress: true,
      stats: 'errors-only',
      // set up so that we host the server from local
      host: process.env.HOST,
      port: process.env.PORT
    },
    devtool: 'eval-source-map',

    // loads CSS and Style loaders (like pre-processors, can be chained together) 
    // See: http://webpack.github.io/docs/using-loaders.html
    //   css-loader resolves @import and url statements
    //   style-loader resolves require statements
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: PATHS.app
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true
      })
    ]
  });
}

if(TARGET === 'build' || TARGET === "stats") {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies).filter(function(v) {
        return v !== 'alt-utils';
      })
    },
    plugins: [
      // Define Plugin places code as is so extra quotes are needed.
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"' }), 
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      new CleanPlugin([PATHS.build]),
      new ExtractTextPlugin('[name].[chunkhash].css'),
    ],
    output: {
      path: PATHS.build,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    },
    module: {
      // loads CSS and Style loaders (like pre-processors, can be chained together) 
      // See: http://webpack.github.io/docs/using-loaders.html
      //   css-loader resolves @import and url statements
      //   style-loader resolves require statements
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style", "css"),
          include: PATHS.app
        }
      ]
    }
  });
}
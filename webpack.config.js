// require the path npm lib, and webpack-merge lib
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const TARGET = process.env.npm_lifecycle_event; // 'start' or 'build'
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};
const NpmInstallPlugin = require('npm-install-webpack-plugin');

process.env.BABEL_ENV = TARGET;


const common = {
  entry: {
    app: PATHS.app
  }, 
  resolve: {
    // '' is needed to allow imports without an extension, and '.' is required
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build, 
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        // Test expects regex
        test: /\.css$/,
        // loads CSS and Style loaders (like pre-processors, can be chained together) 
        // See: http://webpack.github.io/docs/using-loaders.html
        //   css-loader resolves @import and url statements
        //   style-loader resolves require statements
        loaders: ['style', 'css'],
        // could be an array of paths, also
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      }
    ]
  }
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
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true
      })
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {
    plugins: [
      // Define Plugin places code as is so extra quotes are needed.
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"' }), 

      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      })
    ]
  });
}
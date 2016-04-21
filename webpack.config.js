const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};
process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.app
  }, 
  resolve: {
    extensions: ["", '.js', '.jsx']
  },
  output: {
    path: PATHS.build, 
    filename: 'bundle.js'
  }, 
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        // Include accepts either a path or an array of paths
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

// Default configuration, return this if Webpack is called
//  outside of npm
if (TARGET === 'start' || !TARGET) {
  // module.exports = merge(common, {});
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,
      // Enable history API fallback
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT

    },
    devtool: 'eval-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      }),
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}
var package = require('./package.json');

module.exports = {
  entry: {
    'angular-powerbi': './src/angular-powerbi.ts'
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: package.name,
    libraryTarget: 'umd'
  },
  externals: [
    'angular',
    'powerbi-client'
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}
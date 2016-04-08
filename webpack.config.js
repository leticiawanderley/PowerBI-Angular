module.exports = {
  entry: './src/angular-powerbi.ts',
  output: {
    path: __dirname + "/dist",
    filename: 'angular-powerbi.js'
  },
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
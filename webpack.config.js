const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      state: path.resolve(__dirname, 'src/state')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.png$/,
        loader: 'url-loader?mimetype=image/png'
      }
    ]
  },
  target: 'web',
  node: {
    fs: 'empty'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
}

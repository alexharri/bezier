module.exports = {
  entry: "./index.js",
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          }
        },
      }
    ]
  },
  devtool: (process.env.NODE_ENV === "production"
    ? "cheap-module-source-map"
    : "inline-sourcemap"),
  devServer: {
    contentBase: __dirname,
    watchOptions: {
      ignored: /node_modules/
    }
  }
}
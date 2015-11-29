var webpack = require('webpack')
module.exports = {
  entry: [
	"./app/main.js",
  ],
  output: {
    path: __dirname+'/build',
    filename: "build.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.html$/, loader: "html" },
      { test: /\.vue$/, loader: "vue" },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel?presets[]=es2015'
      }
    ]
  }, 
  resolve: {
    modulesDirectories: [
      'node_modules'
    ]
  }
}
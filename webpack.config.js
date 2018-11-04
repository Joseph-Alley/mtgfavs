// This script initially came from the Webpack getting started guide
// https://webpack.js.org/guides/getting-started/
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'core.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
     rules: [
        {
            test: /\.css$/,
            use: [
            'style-loader',
            'css-loader'
            ]
        },
        {
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
        },
        {
            test: /\.html$/,
            use: [
                'html-loader'
            ]
        },
        {
            test: /\.jst$/,
            loader: 'raw-loader'
        }
     ]
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};
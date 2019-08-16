/*
* Webpack Configuration
*/

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'none',
    stats: {
        colors: true,
        hash: true,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,             // Turn on If you want to see Error
        errorDetails: true,       // Turn on If you want to see Error Detail
        warnings: false,          // Turn on If you want to see Warning Detail
        publicPath: false
    },
    entry: './src/app.js',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
          {
            exclude:path.resolve(__dirname, "node_modules"),
            test: /\.js$/,
            use: {
              loader: "babel-loader",
            }
          },
          {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                { loader: 'sass-loader', options: { sourceMap: true } },
            ],
          }
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({
            filename: "app.bundle.css",
        })
      ]
}
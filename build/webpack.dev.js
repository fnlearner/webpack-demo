const path = require("path");
const webpack = require("webpack");
const webpackConfig = require(path.resolve(__dirname, "./webpack.config.js"));
const webpackMerge = require("webpack-merge");
const BundelAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
module.exports = webpackMerge(webpackConfig, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    port: 3000,
    hot: true,
    contentBase: path.resolve(__dirname, "../dist"),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundelAnalyzerPlugin({
      analyzerHost: "127.0.0.1",
      analyzerPort: 8080,
    }),
  ],
});

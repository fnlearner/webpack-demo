const path = require("path");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  entry: {
    vendor: ["vue", "element-ui"],
    core:['core-js']
  },
  output: {
    path: path.join(__dirname, "../static/js"),
    filename: "[name].dll.js",
    library: "[name]_library",
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, "../static/js/[name]-manifest.json"),
      name: "[name]_library",
      context: __dirname,
    }),
  ],
};

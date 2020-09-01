const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const vueLoaderPlugin = require("vue-loader/lib/plugin");
const webpack = require("webpack");
const devMode = process.argv.indexOf("--mode=production") === -1;
// const happyPack = require("happypack");
// const os = require("os");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundelAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const firstPlugin = require(path.resolve(
  __dirname,
  "../webpack-firstPlugin.js"
));
module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "../src/main.js"),
    // header:path.resolve(__dirname,'../src/header.js')
  },
  output: {
    filename: "js/[name].[hash:8].js",
    path: path.resolve(__dirname, "../dist"),
    chunkFilename: "js/[name].[hash:8].js",
  },
  devServer: {
    port: 5000,
    hot: true,
    contentBase: path.join(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
        ],
        include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, "../drop-console.js"),
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname, "../dist/css"),
              hmr: devMode,
            },
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")],
            },
          },
          "less-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "img/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: {
          loader: "url-loader",
          options: {
            limit: 10240,
            fallback: {
              loader: "file-loader",
              options: {
                name: "media/[name].[hash:8].[ext]",
              },
            },
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10240,
          fallback: {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[hash:8].[ext]",
            },
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.runtime.esm.js",
      "@": path.resolve(__dirname, "../src"),
      assets: path.resolve(__dirname, "../src/assets"),
    },
    extensions: ["*", ".js", ".css", ".json", ".vue"],
  },
  plugins: [
    new firstPlugin(),
    new BundelAnalyzerPlugin({
      analyzerHost: "127.0.0.1",
      analyzerPort: 8080,
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("../static/js/vendor-manifest.json"),
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.resolve(__dirname, "../static/js/core-manifest.json"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new vueLoaderPlugin(),
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      filename: "index.html",
      chunks: ["main"],
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
    }),
  ],
};

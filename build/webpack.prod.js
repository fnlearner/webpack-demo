const path = require('path')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')//压缩css
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')//压缩js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
module.exports = WebpackMerge(webpackConfig,{
    mode:'production',
    devtool:'cheap-module-source-map',
    plugins:[
        new CopyWebpackPlugin([{
          from:path.resolve(__dirname,'../public'),
          to:path.resolve(__dirname,'../dist')
        }]),

      ],
    optimization:{
        minimizer:[
            new ParallelUglifyPlugin({
                cacheDir:path.resolve(__dirname,'../cache'),
                uglifyJS:{
                    output:{
                        comments:false,
                        beautify:false
                    },
                    compress:{
                        drop_console:true,
                        collapse_vars:true,
                        reduce_vars:true
                    }
                }
            }),
            new OptimizeCssAssetsPlugin({})
        ],
        splitChunks:{
            chunks:'all',
            cacheGroups:{
                libs:{
                    name:'chunk-libs',
                    test:/[\\/]node_modules[\\/]/,
                    priority:10,
                    chunks:'initial'
                }
            }
        }
    }
})

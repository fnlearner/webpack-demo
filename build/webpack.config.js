const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const devMode = process.argv.indexOf('--mode=production') === -1;
const happyPack = require('happypack')
const os = require('os')
const happyThreadPool = happyPack.ThreadPool({
    size:os.cpus().length
})
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundelAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const firstPlugin = require(path.resolve(__dirname,'../webpack-firstPlugin.js'))
module.exports = {
    mode:'development',
    entry:{
        main:path.resolve(__dirname,'../src/main.js'),
        // header:path.resolve(__dirname,'../src/header.js')
    },
    output:{
        filename:'js/[name].[hash:8].js',
        path:path.resolve(__dirname,'../dist'),
        chunkFilename:'js/[name].[hash:8].js'
    },
    devServer:{
        port:5000,
        hot:true,
        contentBase:path.join(__dirname,'../dist')
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:[{
                    loader:'vue-loader',
                    options:{
                        compilerOptions:{
                            preserveWhitespace:false
                        }
                    },
                  
                }],
                include:path.resolve(__dirname,'../src'),
                exclude:/node_modules/
            },
            {
                test:/\.js$/,
                use:path.resolve(__dirname,'../drop-console.js')
              
            },
            {
                test:/\.css$/,
                use:['style-loader', MiniCssExtractPlugin.loader,'css-loader']
            },
            {
                test:/\.less$/,
                use:[
                    'style-loader',
                   {
                       loader:devMode ?'vue-style-loader': MiniCssExtractPlugin.loader,
                       options:{
                           publicPath:path.resolve(__dirname,'../dist/css'),
                           hmr:devMode
                       }
                   },'css-loader',{
                    loader:'postcss-loader',
                    options:{
                        plugins:[require('autoprefixer')]
                    }
                },'less-loader']
            },
            {
                test:/\.(jpe?g|png|gif)$/i,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:10240,
                            fallback:{
                                loader:'file-loader',
                                options:{
                                    name:'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },{
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
                use: {
                    loader:'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                          loader: 'file-loader',
                          options: {
                            name: 'media/[name].[hash:8].[ext]'
                          }
                        }
                      }
                }
            },{
                test:/\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader:'url-loader',
                options:{
                    limit: 10240,
                    fallback:{
                        loader:'file-loader',
                        options: {
                            name: 'fonts/[name].[hash:8].[ext]'
                          }
                    }
                }
            }
        ]
    },
    resolve:{
        alias:{
            'vue$':'vue/dist/vue.runtime.esm.js',
            '@':path.resolve(__dirname,'../src'),
            'assets':path.resolve(__dirname,'../src/assets')
        },
        extensions:['*','.js','.json','.vue']
    },
    plugins:[
        new firstPlugin(),
        new BundelAnalyzerPlugin({
            analyzerHost:'127.0.0.1',
            analyzerPort:8080
        }),
        new webpack.DllReferencePlugin({
            context:__dirname,
            manifest: require('./vendor-manifest.json')
        }),
        new CopyWebpackPlugin([{
            from:'static',to:'static'
        }]),
        new webpack.HotModuleReplacementPlugin(),
        new vueLoaderPlugin(),
        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin({
        //     template:path.resolve(__dirname,'../public/header.html'),
        //     filename:'header.html',
        //     chunk:['header']
        // }),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../public/index.html'),
            filename:'index.html',
            chunks:['main']
        }),
        new MiniCssExtractPlugin({
            filename:devMode?"[name].css": "[name].[hash].css",
            chunkFilename: devMode?"[id].css":"[id].[hash].css",
        }),
        //HappyPack的基本原理是将loader解析转换js，css，图片字体等操作的这部分任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，从而减少总的构建时间
        /**webpack 4中mode设置为production的时候默认是开始tree-shaking的，但是tree-shaking对es6模块才会生效，但是babel的预案中(preset)中会把任何
        模型都编译成commonjs类型，这样会导致tree-shaking失效，修正这个问题可以将modules设置为false即可 */
    //    new happyPack({
    //        id:'happyBabel',
    //        loaders:[
    //            {
    //                 loader:'babel-loader',
    //                 exclude:/node_modules/,
    //                 cacheDirectory:true
    //            }
    //        ],
    //        threadPool:happyThreadPool//共享进程池
    //    })
    ]
}
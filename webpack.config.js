const glob = require('glob');
const path = require('path');
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const autoprefixer = require("autoprefixer");
const replacePath = "./src/pages/";
const cleanDist = "./dist";
const distFolder = 'dist/';
const outPutFolder = ''; // 需要的时候可以设置HTML文件的父文件夹

module.exports = () => {
    const config = {
        entry: {
            base: './src/main.js'
        },
        output: {
            filename: 'static/js/[name].bundle.js',
            path: path.resolve(__dirname, distFolder),
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [MiniCssExtractPlugin.loader, {
                        loader: "css-loader"
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                autoprefixer()
                            ]
                        }
                    }, {
                        loader: "sass-loader"
                    }]
                },
                {
                    exclude: /fonts/,
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[ext]',
                            outputPath: 'static/imgs'
                        }
                    }
                },
                {
                    exclude: /imgs/,
                    test: /\.(woff|woff2|svg|eot|ttf)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[ext]',
                            outputPath: 'static/fonts'
                        }
                    }
                },
                {
                    test: /\.ejs$/,
                    use: 'ejs-loader'
                }
            ]
        },
        devServer: {
            compress: true,
            port: 8080,
            contentBase: path.resolve(__dirname, distFolder),
            // openPage: 'html/',
            // host: '10.96.129.28',
        },
        devtool: '#source-map',
        plugins: [
            new CleanWebpackPlugin(cleanDist, {
                // 允许插件清理webpack目录以外的文件夹
                allowExternal: true,
                beforeEmit: false
            }), // 清除之前build的版本
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].css',
            }),
            new HtmlWebPackPlugin({
                template: './src/pages/home/index.html',
                filename: outPutFolder + 'index.html',
                path: path.resolve(__dirname, distFolder),
                hash: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                },
            }),
            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, './src/static'),
                to: 'static',
                ignore: ['.*']
            }]),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCssAssetsPlugin({})
        ]
    };
    const files = glob.sync('./src/pages/**/*.html');
    files.forEach(file => {
        const pathArray = file.replace('.html', "").split('/')
        const lastItem = pathArray[pathArray.length - 1];
        const newArr = pathArray.filter(function (ele, i) {
            if (ele === lastItem) {
                return ele;
            }
        })
        if (file.indexOf('home') === -1) {
            if (newArr.length === 2) {
                console.log(__dirname);
                config.plugins.push(
                    new HtmlWebPackPlugin({
                        template: file,
                        filename: outPutFolder + file.replace(replacePath, "").replace(`/${lastItem}`, ""),
                        path: path.resolve(__dirname, distFolder),
                        hash: true,
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            minifyCSS: true,
                            minifyJS: true,
                        },
                    })
                );
            } else {
                config.plugins.push(
                    new HtmlWebPackPlugin({
                        template: file,
                        filename: outPutFolder + file.replace(replacePath, ""),
                        path: path.resolve(__dirname, distFolder),
                        hash: true,
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            minifyCSS: true,
                            minifyJS: true,
                        },
                    })
                );
            }
        }
    });

    return config;
}

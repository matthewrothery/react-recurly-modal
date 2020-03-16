// Checkout: https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220
// and: https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "../public/index.html"),
    filename: "./index.html",
    minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
    },
});

const Dotenv = require('dotenv-webpack');
const dotenv = new Dotenv();

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const caseSensitivePathsPlugin = new CaseSensitivePathsPlugin();

const CompressionPlugin = require('compression-webpack-plugin');
const compressionPlugin = new CompressionPlugin();

module.exports = {
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        include: /src/,
                        use: {
                            loader: "babel-loader",
                            options: {
                                presets: [ '@babel/preset-env', '@babel/preset-react'],
                                plugins:[ 
                                    '@babel/plugin-proposal-object-rest-spread',
                                    '@babel/plugin-transform-react-jsx',
                                    '@babel/plugin-syntax-dynamic-import',
                                    'babel-plugin-minify-dead-code-elimination',
                                    '@babel/plugin-transform-modules-commonjs',
                                    ['babel-plugin-transform-imports',
                                        {
                                            "@fortawesome/free-solid-svg-icons": {
                                                "transform": "@fortawesome/free-solid-svg-icons/${member}",
                                                "skipDefaultConversion": true,
                                                "preventFullImport": true
                                            },
                                            "@fortawesome/fontawesome-svg-core": {
                                                "transform": "@fortawesome/fontawesome-svg-core/${member}",
                                                "skipDefaultConversion": true,
                                                "preventFullImport": true
                                            },
                                            "@fortawesome/free-brands-svg-icons": {
                                                "transform": "@fortawesome/free-brands-svg-icons/${member}",
                                                "skipDefaultConversion": true,
                                                "preventFullImport": true
                                            }
                                        }
                                    ],
                                    
                                ]
                            },
                        }
                    },
                    {
                        test: /\.less$/,
                        include: /src/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    sourceMap: true,
                                    modules: true,
                                    localIdentName: "[name]__[local]___[hash:base64:5]"
                                }
                            },
                            {
                                loader: require.resolve('less-loader')
                            }
                        ]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            {
                                loader: "style-loader",
                                options: {
                                    sourceMap: true
                                }
                            }, 
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    {
                        test: /\.(ts|txt|md)$/,
                        use: 'raw-loader'
                    },
                    {
                        test: /\.(png|svg|jpg|gif)$/,
                        use: [
                            {
                                loader: 'url-loader',
                                options:{
                                    fallback: "file-loader",
                                    name: "[name][md5:hash].[ext]",
                                    outputPath: 'assets/',
                                    publicPath: '/assets/'
                                }
                            }    
                        ]
                    },
                ]
            }
        ]
    },
    plugins: [
        dotenv,
        htmlWebpackPlugin, 
        caseSensitivePathsPlugin,
        compressionPlugin,
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /^\.\/locale$/, /moment$/),
    ],
    node: {
        fs: 'empty',
        module: 'empty'
    }
};
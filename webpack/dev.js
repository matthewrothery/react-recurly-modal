const merge = require('webpack-merge');
const common = require('./common.js');
const path = require('path');

module.exports = merge(
    common, 
    {
        mode: 'development',
        entry: ["idempotent-babel-polyfill", path.join(__dirname, "./../src/example.js")],
        devtool: 'inline-source-map',
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },
        output: {
            globalObject: 'self',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            pathinfo: true, // show module paths in the bundle, handy for debugging
        },
        devServer: {
            port: 3801,
            contentBase: path.join(__dirname, "dist"),
            compress: true,
            historyApiFallback: true,
            proxy: {
                '/api/': {
                    target: "http://localhost:3900/",
                    secure: true,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api/': ''
                    },
                }
            }
        },
        resolve: {
            extensions: [".js", ".jsx"],
            alias: { }
        }
    }
);
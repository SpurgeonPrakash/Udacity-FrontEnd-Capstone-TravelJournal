const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LinkTypePlugin = require('html-webpack-link-type-plugin').HtmlWebpackLinkTypePlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    output: {
        library: 'Client',
        libraryTarget: 'var'
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/views/index.html',
            filename: "index.html"
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
        }),
        new LinkTypePlugin({
            '**/*.css' : 'text/css'
        }),
        new WorkboxPlugin.GenerateSW()
    ]
}

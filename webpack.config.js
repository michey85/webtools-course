const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');

const mergeConfig = (mode) => require(`./builder/webpack.${mode}.js`)();

module.exports = ({ mode }) => {
    return webpackMerge(
        {
            mode: mode,
            entry: './src/index.js',
            output: {
                filename: 'main.js',
                path: path.resolve('./build'),
            },
            module: {
                rules: [
                    {
                        test: /\.js/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env'],
                                },
                            },
                        ],
                        exclude: /node_modules/,
                    },
                ],
            },
            plugins: [new HtmlWebpackPlugin()],
            devServer: {
                contentBase: './build',
            },
        },
        mergeConfig(mode)
    );
};

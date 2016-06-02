var path = require("path")
var HtmlWebpackPlugin = require("html-webpack-plugin")
var webpack = require("webpack")

module.exports = {
    devtool: "source-map",
    entry: {
        "basic": ["./examples/basic/Example"],
        "always-scroll": ["./examples/always-scroll/Example"],
        "dynamic-top": ["./examples/dynamic-top/Example"],
        "dynamic-bottom": ["./examples/dynamic-bottom/Example"],
        "scroller-height-changes": ["./examples/scroller-height-changes/Example"],
        "pull-down-to-refresh": ["./examples/pull-down-to-refresh/Example"],
    },
    output: {
        path: path.join(__dirname, '../demo'),
        filename: "[name]/[name].js",
        publicPath: ""
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            comments: false
        }),
        new HtmlWebpackPlugin({
            template: "./examples/index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./examples/always-scroll/index.html",
            filename: "./always-scroll/index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./examples/basic/index.html",
            filename: "./basic/index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./examples/dynamic-bottom/index.html",
            filename: "./dynamic-bottom/index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./examples/dynamic-top/index.html",
            filename: "./dynamic-top/index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./examples/pull-down-to-refresh/index.html",
            filename: "./pull-down-to-refresh/index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./examples/scroller-height-changes/index.html",
            filename: "./scroller-height-changes/index.html"
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ["babel"],
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                loader: "style!css!less"
            }
        ]
    }
}

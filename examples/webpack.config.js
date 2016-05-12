var path = require("path")

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        "basic": ["./examples/basic/basic.js"],
    },
    output: {
        path: __dirname,
        filename: "[name]/[name].js",
        publicPath: "/"
    },
    plugins: [],
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

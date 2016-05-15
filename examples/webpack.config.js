var path = require("path")

module.exports = {
    devtool: "cheap-module-source-map",
    entry: {
        "basic": ["./examples/basic/Example"],
        "always-scroll": ["./examples/always-scroll/Example"],
        "dynamic-top": ["./examples/dynamic-top/Example"],
        "dynamic-bottom": ["./examples/dynamic-bottom/Example"],
        "scroller-height-changes": ["./examples/scroller-height-changes/Example"],
        "pull-down-to-refresh": ["./examples/pull-down-to-refresh/Example"],
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

var path = require("path")

module.exports = {
    entry: {
        "react-iscroll": ["./src/IScroll.js"],
    },
    externals: {
        "react": "react",
        "react-dom" : "react-dom"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        library: 'react-iscroll',
        libraryTarget: 'umd'
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

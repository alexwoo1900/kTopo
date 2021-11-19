const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { library } = require("webpack");

let config = {
    entry: {
        main: "./src/Core"
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/    
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "Graph",
            filename: "demo.html",
            template: "template/demo.html",
            inject: false,
            minify: {
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        })
    ],
    optimization: {
        moduleIds: "deterministic"
    },
    output: {
        filename: "js/kTopo.js",
        path: path.resolve(__dirname, "dist"),
        library: "kTopo",
        libraryExport: "default",
        libraryTarget: "umd"
    },
    experiments: {
        topLevelAwait: true
    }
}

module.exports = (env, argv) => {
    if (argv.mode === "development") {
        config.devtool = "source-map";
    }
    return config;
}
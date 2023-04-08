const path = require("path");
module.exports = {
    devServer: {
        port: 8081,
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
    },
    entry: {
        main: "./src/index.js",
    },
    output: {
        filename: "bundle.js",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            { test: /\.js$/, use: ["babel-loader"] },
        ],
    },
};

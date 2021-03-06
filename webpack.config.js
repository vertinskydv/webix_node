var path = require('path');
var webpack = require('webpack');

module.exports = function (env) {
    var pack = require("./package.json");
    var ExtractTextPlugin = require("extract-text-webpack-plugin");
    var production = !!(env && env.production === "true");
    var babelSettings = {
        extends: path.join(__dirname, '/.babelrc')
    };
    
    var config = {
        entry: "./frontend/sources/start.js",
        output: {
            path: path.join(__dirname, "frontend/codebase"),
            publicPath: "frontend/codebase/",
            filename: "app.js"
        },
        devtool: "inline-source-map",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader?" + JSON.stringify(babelSettings)
                },
                {
                    test: /\.(svg|png|jpg|gif)$/,
                    loader: "url-loader?limit=25000"
                },
                {
                    test: /\.(less|css)$/,
                    loader: ExtractTextPlugin.extract("css-loader!less-loader")
                }
            ]
        },
        resolve: {
            extensions: [".js"],
            modules: ["./frontend/sources", "node_modules"],
            alias: {
                "jet-views": path.resolve(__dirname, "frontend/sources/views"),
                "jet-locales": path.resolve(__dirname, "frontend/sources/locales")
            }
        },
        watch: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        plugins: [
            new ExtractTextPlugin("./app.css"),
            new webpack.DefinePlugin({
                VERSION: `"${pack.version}"`,
                APPNAME: `"${pack.name}"`,
                PRODUCTION: production
            })
        ]
    };
    
    if (production) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                test: /\.js$/
            })
        );
    }
    
    return config;
}
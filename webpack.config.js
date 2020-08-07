const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssextractPlugin = require("mini-css-extract-plugin");
const path = require("path")

module.exports={
    entry:{
        main: './src/js/index.js',
        login:'./src/js/login.js'
    },
    output:{
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader"
                }
            },
            {
                test:/\.html$/,
                use:[
                    {
                        loader:"html-loader",
                        options:{minimize: true}
                    }
                ]
            },
            {
                test:/\.(sc|c|sa)ss$/,
                use:[
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use:[
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            chunks:['main']
        }),
        new HtmlWebPackPlugin({
            template: "./src/login.html",
            filename: "./login.html",
            chunks : ['login']
        }),
        new MiniCssextractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        
    ]
}
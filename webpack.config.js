const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js"
  },
  devServer: {
    contentBase: "./dist"
  },
    devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
        {
            test: /\.scss$/,
            use: [
                "style-loader",
                "css-loader",
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                },
                "sass-loader"
            ]
        },
        {
            test: /\.css/,
            use: [
                'style-loader',
                    'css-loader'
            ]
        },
        {
            test: /\.(png|jpg|gif|svg)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "img/"
                    }
                }
            ]
        },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};

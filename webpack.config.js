const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    publicPath: "auto",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  devServer: {
    port: 3003,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    static: {
      directory: path.join(__dirname, "dist"), // ✅ Serves CSS and other static files
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // ✅ Extracts CSS into a separate file
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "rolemanagement",
      filename: "remoteEntry.js",
      exposes: {
        "./store": "./src/store",
        "./rolemanagement": "./src/App",
        "./RoleApiSlice": "./src/features/RoleApiSlice",
        "./RoleSlice": "./src/features/RoleSlice",
        "./RolePaginationSlice": "./src/features/RolePaginationSlice",
        // "./AddRole":"./src/views/rolemanagement/AddRole/AddRole",
      },
      shared: {
        react: { singleton: true, requiredVersion: "18", eager: true },
        "react-dom": { singleton: true, requiredVersion: "18", eager: true },
        "react-redux": { singleton: true, requiredVersion: "^9.2.0", eager: true },
        "react-router-dom": { singleton: true, requiredVersion: "^7.1.3", eager: true },
        "@reduxjs/toolkit": { singleton: true, requiredVersion: "^2.5.1", eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "index.css", // ✅ Ensures CSS is saved as a separate file
    }),
  ],
};

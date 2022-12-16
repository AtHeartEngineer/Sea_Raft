import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";

export default function () {
  return {
    entry: './bootstrap.ts',
    mode: "development",
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Sea Raft",
        template: 'index.html'
      }),
      new WasmPackPlugin({
        crateDirectory: path.resolve()
      })
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: path.resolve() + '/pkg',
      filename: 'bundle.js',
    },
    experiments: {
      asyncWebAssembly: true
    },
    devServer: {
      host: '0.0.0.0',
      port: 8079,
      allowedHosts: ['all']
    },
    devtool: 'eval-source-map'

  }
}
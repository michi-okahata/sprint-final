const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // Set development mode
  entry: './renderer/index.js',
  output: {
    path: path.resolve(__dirname, 'devPack'),
    filename: 'renderer.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react' // Add this preset for JSX
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Load CSS files
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './renderer/index.html', // Use your HTML file as a template
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'devPack'),
    },
    hot: true, // Enable Hot Module Replacement
    port: 3000, // Port for the dev server
  },
}

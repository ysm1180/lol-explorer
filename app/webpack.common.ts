import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as CopyPlugin from 'copy-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export const externals = ['7zip'];

const outputDir = 'out';

const commonConfig: webpack.Configuration = {
  optimization: {
    noEmitOnErrors: true,
  },
  externals: externals,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', outputDir),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, '..', 'app', 'src'),
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true,
              babelCore: '@babel/core',
              useCache: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: [path.resolve(__dirname, 'node_modules/')],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};

export const main = merge({}, commonConfig, {
  entry: { main: path.resolve(__dirname, '../app/src/electron-main/main') },
  target: 'electron-main',
  output: {
    libraryTarget: 'commonjs2',
  },
});

export const renderer = merge({}, commonConfig, {
  entry: { renderer: path.resolve(__dirname, '../app/src/ui/index') },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|ico)$/,
        use: ['file?name=[path][name].[ext]'],
      },
      {
        test: /\.cmd$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'app', 'static', 'index.html'),
      chunks: ['renderer'],
    }),
    new CopyPlugin([{ from: 'app/static/assets', to: 'assets' }]),
  ],
});

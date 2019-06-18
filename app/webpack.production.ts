import * as common from './webpack.common';

import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config: webpack.Configuration = {
  mode: 'production',
  devtool: 'source-map',
};

const mainConfig = merge({}, common.main, config);

const rendererConfig = merge({}, common.renderer, config, {
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'renderer.css' }),
    new webpack.DefinePlugin({
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    }),
  ],
});

export = [mainConfig, rendererConfig];

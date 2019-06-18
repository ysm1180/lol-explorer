import * as common from './webpack.common';

import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

const config: webpack.Configuration = {
  mode: 'development',
  devtool: 'source-map',
};

const webpackHotModuleReloadUrl =
  'webpack-hot-middleware/client?path=http://localhost:11880/__webpack_hmr'

const getRendererEntryPoint = () => {
  const entry = common.renderer.entry as webpack.Entry;
  if (entry == null) {
    throw new Error(`Unable to resolve entry point. Check webpack.common.ts and try again`);
  }

  return entry.renderer as string;
};

const mainConfig = merge({}, common.main, config);

const rendererConfig = merge({}, common.renderer, config, {
  entry: {
    renderer: [webpackHotModuleReloadUrl, getRendererEntryPoint()],
  },
  output: {
    publicPath: 'http://localhost:11880/build/',
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});

export = [mainConfig, rendererConfig];

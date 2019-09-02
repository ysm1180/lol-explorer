module.exports = {
  chainWebpack: (config) => {
    ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach((match) => {
      config.module
        .rule('scss')
        .oneOf(match)
        .use('sass-loader');
    });
  },
};

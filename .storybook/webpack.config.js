module.exports = function(baseConfig, env, config) {
  config.module.rules.push({
    test: /\.tsx??$/,
    loader: 'babel-loader'
  });
  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};

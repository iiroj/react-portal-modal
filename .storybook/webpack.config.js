module.exports = function(baseConfig, env, config) {
  config.module.rules = [
    {
      test: /\.(jsx?|tsx?)$/,
      loader: "babel-loader"
    }
  ];

  config.resolve.extensions = [".js", ".ts", ".tsx"];

  return config;
};

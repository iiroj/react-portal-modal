module.exports = function(baseConfig, env, config) {
  config.module.rules.push(
    {
      test: /\.tsx?$/,
      use: {
        loader: "ts-loader",
        options: {
          transpileOnly: true
        }
      }
    });

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};

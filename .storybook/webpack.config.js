const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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

  config.plugins.push(new ForkTsCheckerWebpackPlugin())

  return config;
};

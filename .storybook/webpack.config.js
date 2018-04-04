module.exports = function (baseConfig, env, defaultConfig) {
    defaultConfig.module.rules.push({
      test: /\.tsx??$/,
      loader: "babel-loader",
    })
    defaultConfig.resolve.extensions.push(".tsx");
    defaultConfig.resolve.extensions.push(".ts");

    return defaultConfig;
};
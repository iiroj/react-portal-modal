module.exports = api => {
  api.cache(true);

  return {
    presets: [
      "@babel/preset-env",
      "@babel/preset-stage-3",
      "@babel/preset-react",
      "@babel/preset-typescript"
    ]
  }
}

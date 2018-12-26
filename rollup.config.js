import typescript from "rollup-plugin-typescript2";
import minify from "rollup-plugin-babel-minify";

import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/index.ts",

  output: [
    {
      exports: "named",
      file: pkg.main,
      format: "cjs"
    },
    {
      exports: "named",
      file: pkg.module,
      format: "es"
    }
  ],

  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],

  plugins: [
    typescript({
      tsconfig: "tsconfig.build.json",
      typescript: require("typescript")
    }),
    production &&
      minify({
        comments: false
      })
  ]
};

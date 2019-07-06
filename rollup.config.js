import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies)
];

const onwarn = warning => {
  if (warning.code !== "THIS_IS_UNDEFINED") console.warn(warning.message);
};

const plugins = [
  typescript({
    tsconfig: "tsconfig.build.json",
    typescript: require("typescript")
  }),
  production && terser()
];

export default [
  {
    input: "src/index.ts",
    output: [
      { exports: "named", file: pkg.main, format: "cjs" },
      { exports: "named", file: pkg.module, format: "es" }
    ],
    external,
    onwarn,
    plugins
  },
  {
    input: "src/index.ts",
    output: {
      exports: "named",
      file: pkg.browser,
      format: "umd",
      globals: {
        react: "React",
        "react-focus-lock": "FocusLock",
        "body-scroll-lock": "bodyScrollLock",
        "react-dom": "ReactDOM"
      },
      name: "styledModal"
    },
    external,
    onwarn,
    plugins: [...plugins, resolve(), commonjs()]
  }
];

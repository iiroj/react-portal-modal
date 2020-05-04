import compiler from "@ampproject/rollup-plugin-closure-compiler";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
];

const onwarn = (warning) => {
  if (warning.code !== "THIS_IS_UNDEFINED") console.warn(warning.message);
};
const getPlugins = (declaration) => {
  const tsOptions = {
    exclude: ["example/*"],
    sourceMap: false,
    tsconfig: "tsconfig.build.json",
    typescript: require("typescript"),
  };

  if (declaration) {
    tsOptions.declaration = true;
    tsOptions.declarationDir = "types";
    tsOptions.outDir = ".";
  }

  return [
    resolve(),
    commonjs(),
    typescript(tsOptions),
    production && compiler(),
  ];
};

export default [
  {
    input: "src/index.ts",
    output: { exports: "named", dir: ".", format: "cjs" },
    external,
    onwarn,
    plugins: getPlugins(true),
  },
  {
    input: "src/index.ts",
    output: { exports: "named", file: pkg.module, format: "esm" },
    external,
    onwarn,
    plugins: getPlugins(),
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
        "react-dom": "ReactDOM",
      },
      name: "styledModal",
    },
    external,
    onwarn,
    plugins: getPlugins(),
  },
];

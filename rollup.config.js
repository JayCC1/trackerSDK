import path from "path";
import ts from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "./src/core/index.ts",
    output: [
      {
        file: path.resolve(__dirname, "./dist/index.esm.js"),
        format: "es",
      },
      {
        file: path.resolve(__dirname, "./dist/index.cjs.js"),
        format: "es",
      },
      {
        file: path.resolve(__dirname, "./dist/index.js"),
        format: "umd",
        name: "TrackerSDK",
      },
    ],
    Plugin: [ts()],
  },
  {
    input: "./src/core/index.ts",
    output: {
      file: path.resolve(__dirname, "./dist/index.d.ts"),
      format: "es",
    },
    Plugin: [dts()],
  },
];

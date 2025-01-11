import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

const input = {
  app: "./assets/app.js",
};

export default {
  input,
  output: {
    dir: "../extensions/attempt2/assets",
  },
  plugins: [
    commonjs(),
    copy({
      targets: [
        { src: "./assets/*.css", dest: "../extensions/attempt2/assets" },
        {
          src: "./blocks/*.liquid",
          dest: "../extensions/attempt2/blocks",
        },
      ],
    }),
  ],
};
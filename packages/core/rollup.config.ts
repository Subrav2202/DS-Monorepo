import jpg from "@rollup/plugin-image";
import fs from "fs";
import path from "path";
import { OutputBundle, OutputChunk, RollupOptions } from "rollup";
import postcss from "rollup-plugin-postcss";
import { defineRollupSwcOption, swc } from "rollup-plugin-swc3";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

function copyFiles(from: string, to: string) {
  return {
    name: "copy-files",
    writeBundle() {
      console.log("\x1b[36m%s\x1b[0m", `copy files: ${from} → ${to}`);
      fs.copyFileSync(from, to);
    },
  };
}
// Custom plugin to rename .svg files and update references
function renameSvgFiles() {
  return {
    name: "rename-svg-files",
    generateBundle(options: RollupOptions, bundle: OutputBundle) {
      const svgFiles = new Map<string, string>();

      // Rename .svg.js files to .js
      for (const [fileName, file] of Object.entries(bundle)) {
        if (fileName.endsWith(".svg.js")) {
          const newFileName = fileName.replace(".svg.js", ".js");
          svgFiles.set(fileName, newFileName);
          bundle[newFileName] = { ...file, fileName: newFileName };
          delete bundle[fileName];
        }
      }

      // Update references in other files
      for (const file of Object.values(bundle)) {
        if (file.type === "chunk") {
          const chunk = file as OutputChunk;
          for (const [oldFileName, newFileName] of svgFiles.entries()) {
            chunk.code = chunk.code.replace(
              new RegExp(oldFileName, "g"),
              newFileName
            );
          }
        }
      }
    },
  };
}

const input = "src/index.ts";
const external = [
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const plugins = [
  swc(
    defineRollupSwcOption({
      jsc: {
        target: "esnext",
      },
      sourceMaps: true,
      // The return type of swc() is `import('rollup2').Plugin` while the required type is `import('rollup3').Plugin`
      // Although they are identical, typescript is not happy about that
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })
  ),
  postcss({
    extract: false,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config: {
      path: path.resolve("postcss.config.cjs"),
    },
    extensions: [".css"],
    minimize: true,
  }),
  jpg(),
  copyFiles(
    path.join(
      __dirname,
      "..",
      "..",
      "node_modules",
      "mapbox-gl",
      "dist",
      "mapbox-gl.css"
    ),
    path.join(__dirname, "lib", "mapbox-gl.css")
  ),
  renameSvgFiles(),
  terser(),
];

const config: RollupOptions = {
  input,
  external,
  plugins,
  output: [
    {
      dir: "lib",
      format: "esm",
      entryFileNames: "[name].js",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      exports: "named",
      interop: "auto",
    },
  ],
};

export default config;

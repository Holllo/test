import {build} from "esbuild";

await build({
  bundle: true,
  entryPoints: ["source/index.ts"],
  format: "esm",
  logLevel: "info",
  minify: true,
  outdir: "build",
  platform: "browser",
  splitting: false,
  target: ["es2022"],
  treeShaking: true,
});

import {defineConfig} from "vite";

const relative = (path: string) => new URL(path, import.meta.url).pathname;

export default defineConfig({
  root: relative("tests"),
});

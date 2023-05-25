import foxkit from "eslint-config-foxkit";
import foxkitTS from "eslint-config-foxkit/typescript";
import prettier from "eslint-config-prettier";

const __dirname = new URL(".", import.meta.url).pathname.slice(0, -1);

export default [
  { ignores: ["dist/**"] },
  foxkit.configure({ strict: true }),
  foxkitTS.configure({ tsconfigRootDir: __dirname, strict: true }),
  prettier
];

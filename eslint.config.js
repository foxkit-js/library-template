import foxkit from "eslint-config-foxkit/configs/base.js";
import prettier from "eslint-config-prettier";

const __dirname = new URL(".", import.meta.url).pathname.slice(0, -1);

/**
 * @see https://github.com/foxkit-js/eslint-config-foxkit/ for more information
 */
export default [
  { ignores: ["dist/**"] },
  foxkit.base,
  foxkit.typescript,
  foxkit.configureTS({ tsconfigRootDir: __dirname }),
  prettier
];

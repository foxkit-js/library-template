import fs from "fs/promises";
import path from "path";
import * as esbuild from "esbuild";

/**
 * Build config for esbuild
 * @typedef {import("esbuild").BuildOptions} BuildOptions
 * @type {BuildOptions}
 */
const config = {
  /**
   * Entrypoints for your package.
   * If you are doing multiple exports list all their files here like:
   * `["src/index.ts", "src/foobar.ts"]
   */
  entryPoints: ["src/index.ts"],
  /**
   * Directory in which your build is created.
   * Should match values in .prettierignore, eslint.config.js and package.json
   */
  outdir: "dist",
  /**
   * This option will bundle all of your code into a single file
   * (or multiple if you specified more entrypoints).
   * Disable this if you use multiple exports which share utils a lot.
   */
  bundle: true,
  /**
   * Builds modules for use with Node.js
   */
  platform: "node",
  /**
   * This option with the "external" value excludes dependencies
   * from the bundling process.
   */
  packages: "external",
  /**
   * Enable this if you prefer optimizing for package size and don't
   * care about readable code in packages.
   */
  minify: false,
  /**
   * This target should match the one set in ESLint and TypeScript
   */
  target: "es2022"
};

/**
 * Removes old build directory and creates a fresh one
 */
async function handleClean() {
  console.log("Cleaning");
  await fs.rm(config.outdir, { recursive: true, force: true });
  await fs.mkdir(config.outdir);
}

async function handlePkgJson() {
  const pkg = await fs
    .readFile("package.json", "utf-8")
    .then(file => JSON.parse(file));
  if (typeof pkg != "object" || pkg === null) {
    throw new Error("Could not read package.json");
  }

  console.log("Processing package.json");
  const { publishConfig, "clean-publish": cleanPublish, ...pkgRest } = pkg;
  const pkgProcessed = Object.assign({}, pkgRest, publishConfig);

  // handle removing fields
  const removeFields = ["devDependencies", ...cleanPublish.fields];
  for (const field of removeFields) {
    delete pkgProcessed[field];
  }

  return fs.writeFile(
    path.join(config.outdir, "package.json"),
    JSON.stringify(pkgProcessed, null, 2),
    "utf-8"
  );
}

/**
 * Statically copy files to the outdir
 * @typedef {string | [string, string]} File
 * @typedef {File[]} Files
 * @param {Files} files Array of files to copy to outdir. Use nested array to change filename such as ["foo.build.json", "foo.json"].
 * @returns
 */
async function copyFiles(files) {
  const res = await Promise.allSettled(
    files.map(file => {
      const [fileIn, fileOut] = Array.isArray(file) ? file : [file, file];
      const outPath = path.join(config.outdir, fileOut);
      console.log(`Copying ${fileIn} to ${outPath}`);
      return fs.cp(fileIn, outPath, { force: true });
    })
  );

  const err = res.find(r => r.status == "rejected");
  if (err) {
    throw new Error(`Error while copying files: ${err.reason}`);
  }

  return;
}

/**
 * Handle build of ESM bundle
 * @returns Promise
 */
function buildESM() {
  console.log("Building esm bundles");
  return esbuild.build({
    ...config,
    format: "esm"
  });
}

/**
 * Handle build of CJS bundle
 * @returns Promise
 */
function buildCJS() {
  console.log("Building cjs bundles");
  return esbuild.build({
    ...config,
    format: "cjs",
    outExtension: { ".js": ".cjs" },
    footer: {
      /**
       * This is required for interoperability with default exports
       * @see https://github.com/evanw/esbuild/issues/1182#issuecomment-1011414271
       * Feel free to remove this if you are not using default exports
       * and this is causing problems
       */
      js: "if (module.exports.default) module.exports = module.exports.default"
    }
  });
}

async function build() {
  // Clean dist directory
  await handleClean();

  console.log("Starting build");
  const res = await Promise.allSettled([
    buildESM(),
    buildCJS(),
    copyFiles(["README.md", "LICENSE"]),
    handlePkgJson()
  ]);

  // handle logging errors
  const err = res.filter(r => r.status === "rejected");
  for (const e of err) {
    console.error(`BuildError: ${e.reason}`);
  }
  if (err.length > 0) process.exit(1);
}

build().then(() => {
  console.log("Completed build");
});

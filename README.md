# Foxkit Library Template

This repository is a template for dual-published npm packages with [esbuild] and full [TypeScript] support.

## Getting Started

First make sure you have a recent version of Node.js (see [Releases](https://nodejs.dev/en/about/releases/)) and [pnpm] installed.

Create your repository using the button above. Once cloned move into the project directory and run `pnpm install`. You can now start development in "src/index.ts" or read the rest of this documentation to get more familiar with the build/publishing process and provided pre-configured tools.

Remember to replace README.md and adjust (at least the name) in the LICENSE file before publishing!

## Configuring Builds

The build process contains three steps: A build script using [esbuild], d.ts files through `tsc` ([TypeScript]).

The build script is a simple js file which can be freely adjusted. The provided configurations are for dual-publishing as native ES Modules with `.cjs` as fallback for older systems, while [TypeScript] takes care of providing types in d.ts files.

### Configuring package.json publishConfig

The build script uses the `"publishConfig"` to override and add keys in your production package.json file. This is achieved with a simple `Object.assign` call, so you can nest another `"publishConfig"` object inside to configure `npm publish` from there (note that this is slightly different from how pnpm handles this!). See the [pnpm docs](https://pnpm.io/package_json#publishconfig) for detailed information on available parameters that can be overriden.

When not using the `"exports"` key, in general `"main"` should be your cjs build, `"module"` your js (ESM) build and `"types"` should be added appropriately. Note that when using the `"exports"` key you should add `"types"` as the first key on every export to make sure [TypeScript] can find them. If you are exporting a file in a subdirectory of `./src` you may want to use the `"typesVersion"` key as a workaround for linking to the d.ts file as a workaround.

## Tools

### ESLint

[ESLint] is the go-to linter for JavaScript and TypeScript and is configured using [eslint-config-foxkit] and [eslint-config-prettier]. The config file uses the newer [Flat Config] style and is pre-configured with strict rulesets for JS and TS.

Run the `pnpm lint` or `pnpm lint:strict` scripts or install the editor integration for your code editor, such as the [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to run ESLint.

### Prettier

[Prettier] is an automatic code-formatter and is configured to auto-format all appropriate file types when creating a commit with git through [simple-git-hooks] and [nano-staged].

If you would like to remove git hooks simply uninstall the packages, remove their settings and the `"prepare"` script from package.json and delete the git hook file:

```sh
pnpm remove simple-git-hooks nano-staged
rm .git/hooks/pre-commit
```

Installing the editor integration for your code editor, such as the [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), is strongly recommended. You can also manually call prettier for the entire codebase with the `pnpm format` script or check for formatting errors with the `pnpm format:check` script.

### uvu

This repository comes with the test runner [uvu] set up to run from the `"tests"` directory. You can add any testing utilities in `"tests/utils"` (the `utils` directory is ignored by uvu). Test files fully support TypeScript thanks to `esbuild-register`. To run your tests simply run the command `pnpm test`.

## Publishing

- You should commit (or stash) any changes and ran `pnpm lint` and any tests (if you added any) before publishing!
- Increase the `"version"` key in your package.json appropriately (see [About semantic versioning](https://docs.npmjs.com/about-semantic-versioning)) then push a commit with this version:

```sh
# replace vX.X.X with your version!
git add package.json
git commit -m "vX.X.X"
```

- Now build your package, move into the dist directory and publish:

```sh
pnpm build
cd dist
npm publish # you can use --dry-run to test that all your files are included properly!
```

- If this succeeded and your package is now published you can push the versioning commit and create a tag

```sh
cd .. # exit dist directory
git push
git tag "vX.X.X" -m "vX.X.X"
git push --tags
```

- Remember to create a Release on Github!

[esbuild]: https://esbuild.github.io/
[TypeScript]: https://www.typescriptlang.org/
[pnpm]: https://pnpm.io/
[ESLint]: https://eslint.org/
[eslint-config-foxkit]: https://github.com/foxkit-js/eslint-config-foxkit
[eslint-config-prettier]: https://github.com/prettier/eslint-config-prettier
[Flat Config]: https://eslint.org/docs/latest/use/configure/configuration-files-new
[Prettier]: https://prettier.io/
[simple-git-hooks]: https://github.com/toplenboren/simple-git-hooks
[nano-staged]: https://github.com/usmanyunusov/nano-staged
[uvu]: https://github.com/lukeed/uvu

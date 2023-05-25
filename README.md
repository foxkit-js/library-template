# Foxkit Library Template

**WIP**

This repository is currently a work in progress, documentation will be added here in the future.

## Tools

### ESLint

[ESLint](https://eslint.org/) is the go-to linter for JavaScript and TypeScript and is configured using [eslint-config-foxkit](https://github.com/foxkit-js/eslint-config-foxkit) and [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier). The config file uses the newer [Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new) style and is pre-configured with strict rulesets for JS and TS.

Run the `pnpm lint` or `pnpm lint:strict` scripts or install the editor integration for your code editor, such as the [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to run ESLint.

### Prettier

[Prettier](https://prettier.io/) is an automatic code-formatter and is configured to auto-format all appropriate file types when creating a commit with git through [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) and [nano-staged](https://github.com/usmanyunusov/nano-staged).

If you would like to remove git hooks simply uninstall the packages, remove their settings and the `"prepare"` script from package.json and delete the git hook file:

```sh
pnpm remove simple-git-hooks nano-staged
rm .git/hooks/pre-commit
```

Installing the editor integration for your code editor, such as the [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), is strongly recommended. You can also manually call prettier for the entire codebase with the `pnpm format` script or check for formatting errors with the `pnpm format:check` script.

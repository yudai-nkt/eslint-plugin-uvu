# eslint-plugin-uvu

[![test](https://github.com/yudai-nkt/eslint-plugin-uvu/actions/workflows/test.yml/badge.svg)](https://github.com/yudai-nkt/eslint-plugin-uvu/actions/workflows/test.yml)
[![version](https://img.shields.io/npm/v/eslint-plugin-uvu)](https://www.npmjs.com/package/eslint-plugin-uvu)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/github/license/yudai-nkt/eslint-plugin-uvu)](https://github.com/yudai-nkt/eslint-plugin-uvu/blob/main/LICENSE.md)

ESLint plugin for [uvu](https://www.npmjs.com/package/uvu).

## Installation

This package is available on the NPM registry.
Install `eslint-plugin-uvu` using your favortite package manager.

## Usage

Enable the plugin in the `plugins` section, and configure rules according to your preference.

```json
{
  "plugins": ["uvu"],
  "rules": {
    "uvu/prefer-is-for-primitives": "error"
  }
}
```

## Rules

<!-- prettier-ignore-start -->
<!-- DO NOT MANUALLY EDIT THE TABLE BELOW -->
<!-- rules table begins -->
| Rule ID | Description | Recommended | Fixable |
| ------- | ----------- | :---------: | :-----: |
| [uvu/no-identical-titles](./docs/rules/no-identical-titles.md) | Enforce each test case to have a unique title. |  |  |
| [uvu/prefer-is-for-primitives](./docs/rules/prefer-is-for-primitives.md) | Prefer `is` to `equal` for assertions against primitive literals. |  |  |
<!-- rules table ends -->
<!-- prettier-ignore-end -->

## License

This package is distributed under the MIT License.
See [LICENSE.md](./LICENSE.md) for details.

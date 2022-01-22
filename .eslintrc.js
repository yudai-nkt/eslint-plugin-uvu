// @ts-check
/** @type import("@typescript-eslint/utils").TSESLint.Linter.Config */
module.exports = {
  extends: ["@yudai-nkt"],
  plugins: ["eslint-plugin"],
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: { project: "./tsconfig.eslint.json" },
      // Some errors cannot be resolved even with a DeepReadonly<T> utility,
      // so disable this rule temporarily until an investigation is made.
      rules: { "@typescript-eslint/prefer-readonly-parameter-types": "off" },
    },
    {
      files: ["src/rules/*.ts"],
      extends: ["plugin:eslint-plugin/rules-recommended"],
    },
    {
      files: ["src/__tests__/rules/*.ts"],
      extends: ["plugin:eslint-plugin/tests-recommended"],
    },
    {
      files: ["scripts/*.ts"],
      parserOptions: { project: "./scripts/tsconfig.json" },
    },
  ],
};

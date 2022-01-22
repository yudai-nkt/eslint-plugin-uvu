// @ts-check
/** @type import("@typescript-eslint/utils").TSESLint.Linter.Config */
module.exports = {
  extends: ["@yudai-nkt"],
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: { project: "./tsconfig.eslint.json" },
      // Some errors cannot be resolved even with a DeepReadonly<T> utility,
      // so disable this rule temporarily until an investigation is made.
      rules: { "@typescript-eslint/prefer-readonly-parameter-types": "off" },
    },
  ],
};

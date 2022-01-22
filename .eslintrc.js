// @ts-check
/** @type import("@typescript-eslint/utils").TSESLint.Linter.Config */
module.exports = {
  extends: ["@yudai-nkt"],
  overrides: [
    { files: ["*.ts"], parserOptions: { project: "./tsconfig.eslint.json" } },
  ],
};

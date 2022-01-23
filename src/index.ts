import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { TSESLint } from "@typescript-eslint/utils";

// Copied from https://github.com/testing-library/eslint-plugin-testing-library/blob/v5.0.0/lib/utils/file-import.ts
// MIT License (c) 2019 Mario Beltrán Alarcón
// https://github.com/testing-library/eslint-plugin-testing-library/blob/v5.0.0/LICENSE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const interopRequireDefault = <T>(obj: any): { default: T } =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
  obj?.__esModule ? obj : { default: obj };
const importDefault = <T>(moduleName: string): T =>
  /* eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, unicorn/prefer-module --
   * ESLint rules are CJS modules, so `require` is mandatory.
   */
  interopRequireDefault<T>(require(moduleName)).default;

/* eslint-disable-next-line unicorn/prefer-module --
 * ESLint rules need to be compiled as CJS modules, so import.meta cannot be used.
 */
const rulesDir = join(__dirname, "rules");

const rules = readdirSync(rulesDir).map<[string, TSESLint.RuleModule<string>]>(
  (curr) => [curr.replace(/\.js$/, ""), importDefault(join(rulesDir, curr))]
);

const createConfig = (
  rules: [string, TSESLint.RuleModule<string>][],
  filter: (rule: [string, TSESLint.RuleModule<string>]) => boolean
) => ({
  rules: Object.fromEntries(
    rules.flatMap<[string, TSESLint.Linter.RuleLevel]>((rule) =>
      filter(rule) ? [[`uvu/${rule[0]}`, "error"]] : []
    )
  ),
});

export = {
  rules: Object.fromEntries(rules),
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars --
   * The all config needs to enable all the rules.
   */
  configs: { all: createConfig(rules, (rule) => true) },
};

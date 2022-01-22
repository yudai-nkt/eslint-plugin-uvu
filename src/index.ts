import { readdirSync } from "node:fs";
import { join } from "node:path";
import { TSESLint } from "@typescript-eslint/experimental-utils";

// Copied from https://github.com/testing-library/eslint-plugin-testing-library/blob/v5.0.0/lib/utils/file-import.ts
// MIT License (c) 2019 Mario Beltrán Alarcón
// https://github.com/testing-library/eslint-plugin-testing-library/blob/v5.0.0/LICENSE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const interopRequireDefault = <T>(obj: any): { default: T } =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  obj?.__esModule ? obj : { default: obj };
const importDefault = <T>(moduleName: string): T =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  interopRequireDefault<T>(require(moduleName)).default;

const rulesDir = join(__dirname, "rules");

const rules = readdirSync(rulesDir).reduce<
  Record<string, TSESLint.RuleModule<string>>
>(
  (accum, curr) => ({
    ...accum,
    [curr.replace(/\.js$/, "")]: importDefault(join(rulesDir, curr)),
  }),
  {}
);

export = { rules };

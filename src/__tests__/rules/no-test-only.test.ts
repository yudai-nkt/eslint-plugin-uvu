import { resolve } from "node:path";
import { TSESLint } from "@typescript-eslint/utils";
import { dedent } from "ts-dedent";
import { suite } from "uvu";
import rule from "../../rules/no-test-only";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve("./node_modules/espree"),
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

const Test = suite("Test suite for `no-test-only`.");

TSESLint.RuleTester.it = (text, callback) => {
  Test(text, callback);
};
// @ts-expect-error: typing in @typescript-eslint/utils is missing
TSESLint.RuleTester.itOnly = (text: string, callback: () => void) => {
  Test.only(text, callback);
};

ruleTester.run("no-test-only", rule, {
  valid: [
    dedent`
      test()
    `,
  ],
  invalid: [
    {
      code: dedent`
        test.only()
      `,
      errors: [{ messageId: "noTestOnly" }],
    },
  ],
});

Test.run();

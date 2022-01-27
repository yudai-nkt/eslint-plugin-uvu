import { resolve } from "node:path";
import { TSESLint } from "@typescript-eslint/utils";
import { dedent } from "ts-dedent";
import { suite } from "uvu";
import rule from "../../rules/no-identical-titles";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve("./node_modules/espree"),
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

const Test = suite("Test suite for `no-identical-titles`.");

TSESLint.RuleTester.it = (text, callback) => {
  Test(text, callback);
};
// @ts-expect-error: typing in @typescript-eslint/utils is missing
TSESLint.RuleTester.itOnly = (text: string, callback: () => void) => {
  Test.only(text, callback);
};

ruleTester.run("no-identical-titles", rule, {
  valid: [
    dedent`
      import { test } from "uvu";
      test("foo", () => {});
      test("bar", () => {});
    `,
    dedent`
      import { suite } from "uvu";
      const foo = suite("");
      foo("bar", () => {});
      foo("baz", () => {});
    `,
    dedent`
      import { suite } from "uvu";
      const foo = suite("foo");
      foo("baz", () => {});
      const bar = suite("bar");
      bar("baz", () => {});
    `,
  ],
  invalid: [
    {
      code: dedent`
        import { test } from "uvu";
        test("foo", () => {});
        test("foo", () => {});
      `,
      errors: [{ messageId: "duplicateTitles" }],
    },
    {
      code: dedent`
        import { suite } from "uvu";
        const foo = suite("foo");
        foo("bar", () => {});
        foo("bar", () => {});
      `,
      errors: [{ messageId: "duplicateTitles" }],
    },
    {
      code: dedent`
        import { suite } from "uvu";
        const foo = suite("foo");
        const bar = suite("foo");
      `,
      errors: [{ messageId: "duplicateSuites" }],
    },
  ],
});

Test.run();

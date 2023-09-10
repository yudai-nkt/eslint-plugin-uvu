import { resolve } from "node:path";
import { TSESLint } from "@typescript-eslint/utils";
import { dedent } from "ts-dedent";
import { suite } from "uvu";
import rule from "../../rules/call-run";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve("./node_modules/espree"),
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

const Test = suite("Test suite for `call-run`.");

TSESLint.RuleTester.it = (text, callback) => {
  Test(text, callback);
};
// @ts-expect-error: typing in @typescript-eslint/utils is missing
TSESLint.RuleTester.itOnly = (text: string, callback: () => void) => {
  Test.only(text, callback);
};

ruleTester.run("call-run", rule, {
  valid: [
    dedent`
      import { test } from "uvu";
      test("foo", () => {});
      test.run();
    `,
    dedent`
      import { suite } from "uvu";
      const foo = suite("");
      foo("baz", () => {});
      foo.run();
    `,
    dedent`
      import { suite } from "uvu";
      const foo = suite("foo");
      foo("a", () => {});
      const bar = suite("bar");
      bar("b", () => {});
      foo.run();
      bar.run();
    `,
  ],
  invalid: [
    {
      code: dedent`
        import { test } from "uvu";
        test("foo", () => {});
      `,
      errors: [{ messageId: "callRunTest" }],
    },
    {
      code: dedent`
        import { suite } from "uvu";
        const foo = suite("foo");
        foo("a", () => {});
        const bar = suite("bar");
        bar("b", () => {});
        foo.run();
      `,
      errors: [{ messageId: "callRunSuite" }],
    },
  ],
});

Test.run();

import { resolve } from "node:path";
import { TSESLint } from "@typescript-eslint/utils";
import { dedent } from "ts-dedent";
import { suite } from "uvu";
import rule from "../../rules/prefer-is-for-primitives";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve("./node_modules/espree"),
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
});

const Test = suite("Test suite for `prefer-is-for-primitives`.");

TSESLint.RuleTester.it = (text, callback) => {
  Test(text, callback);
};

ruleTester.run("__filename", rule, {
  valid: [
    dedent`
      import * as assert from "uvu/assert";
      assert.is(0, 0);
    `,
    dedent`
      import assert from "assert/strict";
      assert.equal(0, 0);
    `,
    dedent`
      import * as assert from "uvu/assert";
      import * as foo from "foo"
      foo.equal(0, 0);
    `,
    dedent`
      import * as assert from "uvu/assert";
      assert.equal([0], [0]);
    `,
  ],
  invalid: [
    {
      code: dedent`
        import * as assert from "uvu/assert";
        assert.equal(0, 0);
      `,
      errors: [{ messageId: "preferIsForPrimitives" }],
    },
    {
      code: dedent`
        import { equal } from "uvu/assert";
        equal(0, 0);
      `,
      errors: [{ messageId: "preferIsForPrimitives" }],
    },
    {
      code: dedent`
        import { equal as uvuEqual } from "uvu/assert";
        uvuEqual(0, 0);
      `,
      errors: [{ messageId: "preferIsForPrimitives" }],
    },
  ],
});

Test.run();

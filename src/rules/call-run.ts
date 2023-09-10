import type { TSESTree } from "@typescript-eslint/utils";
import { createRule, getImportStatus } from "../utils";

/**
 * Rule object for call-run.
 */
export default createRule({
  name: "call-run",
  meta: {
    docs: {
      description: "Enforce each test case to be added to uvu's queue.",
      recommended: false,
    },
    messages: {
      callRunTest: "Test case has to be called via run() method",
      callRunSuite: "Test suite has to be called via run() method",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    const {
      ast: { body },
      text,
    } = context.getSourceCode();

    const uvuTest = getImportStatus({ module: "uvu", member: "test" }, body);
    const uvuSuite = getImportStatus({ module: "uvu", member: "suite" }, body);

    let testListener;
    if (uvuTest === undefined) {
      testListener = {};
    } else {
      const selector = uvuTest.isNamed
        ? `CallExpression[callee.name=${uvuTest.alias}]`
        : `CallExpression[callee.object.name=${uvuTest.namespace}][callee.property.name=test]`;
      const matcher = text.includes("test.run()");
      testListener = {
        [selector]: (node: TSESTree.CallExpression) => {
          if (!matcher) {
            context.report({
              node,
              messageId: "callRunTest",
            });
          }
        },
      };
    }

    let suitListener;
    if (uvuSuite === undefined) {
      suitListener = {};
    } else {
      const selector = uvuSuite.isNamed
        ? `CallExpression[callee.name=${uvuSuite.alias}]`
        : `CallExpression[callee.object.name=${uvuSuite.namespace}][callee.property.name=suite]`;
      suitListener = {
        [selector]: (node: TSESTree.CallExpression) => {
          if (node.parent) {
            const [{ name }] = context.getDeclaredVariables(node.parent);
            if (!text.includes(`${name}.run()`)) {
              context.report({
                node,
                messageId: "callRunSuite",
              });
            }
          }
        },
      };
    }

    return { ...testListener, ...suitListener };
  },
});

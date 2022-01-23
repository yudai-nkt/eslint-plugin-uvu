import type { TSESTree } from "@typescript-eslint/utils";
import { createRule, getImportStatus } from "../utils";

/**
 * Rule object for prefer-is-for-primitives.
 */
export default createRule({
  name: "prefer-is-for-primitives",
  meta: {
    docs: {
      description:
        "Prefer `is` to `equal` for assertions against primitive literals.",
      recommended: false,
    },
    messages: {
      preferIsForPrimitives:
        "Assertion against a {{type}} should use `is` instead of `equal`",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    const {
      ast: { body },
    } = context.getSourceCode();
    const uvuAssertEqual = getImportStatus(
      { module: "uvu/assert", member: "equal" },
      body
    );

    let listner;
    if (uvuAssertEqual === undefined) {
      listner = {};
    } else {
      const selector = uvuAssertEqual.isNamed
        ? `CallExpression[arguments.1.type=Literal][callee.name=${uvuAssertEqual.alias}]`
        : `CallExpression[arguments.1.type=Literal][callee.object.name=${uvuAssertEqual.namespace}][callee.property.name=equal]`;
      listner = {
        [selector]: (node: TSESTree.CallExpression) => {
          context.report({
            messageId: "preferIsForPrimitives",
            node,
            data: {
              // This downcast is safe because the query `[arguments.1.type=Literal]` guarantees that
              // `node.arguments[1]` corresponds to a literal.
              type: typeof (node.arguments[1] as TSESTree.Literal).value,
            },
          });
        },
      };
    }
    return listner;
  },
});

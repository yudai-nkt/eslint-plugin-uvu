import type { TSESTree } from "@typescript-eslint/experimental-utils";
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
      preferIsForPrimitives: "Prefer is to equal for primitive types",
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
          context.report({ messageId: "preferIsForPrimitives", node });
        },
      };
    }
    return listner;
  },
});

import { type TSESTree } from "@typescript-eslint/utils";
import { createRule } from "../utils";

/**
 * Rule object for no-test-only.
 */
export default createRule({
  name: "no-test-only",
  meta: {
    docs: {
      description: "Warn about forgotten test.only.",
      recommended: false,
    },
    messages: {
      noTestOnly: "Avoid `test.only` statement.",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    return {
      ExpressionStatement(node: TSESTree.ExpressionStatement) {
        const expressionCallee = (node.expression as TSESTree.CallExpression)
          .callee as TSESTree.MemberExpression;
        const isMemberExpression = expressionCallee.type === "MemberExpression";
        const isTest =
          expressionCallee.object &&
          (expressionCallee.object as TSESTree.Identifier).name === "test";
        const isTestOnly =
          expressionCallee.property &&
          (expressionCallee.property as TSESTree.Identifier).name === "only";

        if (isMemberExpression && isTest && isTestOnly) {
          context.report({
            node,
            messageId: "noTestOnly",
          });
        }
      },
    };
  },
});

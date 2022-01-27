import { type TSESTree, ASTUtils } from "@typescript-eslint/utils";
import { createRule, getImportStatus } from "../utils";

/**
 * Rule object for no-identical-titles.
 */
export default createRule({
  name: "no-identical-titles",
  meta: {
    docs: {
      description: "Enforce each test case to have a unique title.",
      recommended: false,
    },
    messages: {
      duplicateTitles: "More than one tests have the same title",
      duplicateSuites: "More than one test suites have the same title",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    const {
      ast: { body },
    } = context.getSourceCode();
    const uvuTest = getImportStatus({ module: "uvu", member: "test" }, body);
    const uvuSuite = getImportStatus({ module: "uvu", member: "suite" }, body);

    const testTitles = new Set<string>();
    const suiteTitles = new Set<string>();
    const namedTestTitles = new Map<string, Set<string>>();

    let testListener;
    if (uvuTest === undefined) {
      testListener = {};
    } else {
      const selector = uvuTest.isNamed
        ? `CallExpression[callee.name=${uvuTest.alias}]`
        : `CallExpression[callee.object.name=${uvuTest.namespace}][callee.property.name=test]`;
      testListener = {
        [selector]: (node: TSESTree.CallExpression) => {
          const title = ASTUtils.getStringIfConstant(node.arguments[0]);
          if (title != undefined) {
            if (testTitles.has(title)) {
              context.report({ messageId: "duplicateTitles", node });
            } else {
              testTitles.add(title);
            }
          }
        },
      };
    }

    let suiteListener;
    if (uvuSuite === undefined) {
      suiteListener = {};
    } else {
      const suiteDeclaration = `VariableDeclarator > ${
        uvuSuite.isNamed
          ? `CallExpression[callee.name=${uvuSuite.alias}]`
          : `CallExpression[callee.object.name=${uvuSuite.namespace}][callee.property.name=suite]`
      }`;
      suiteListener = {
        [suiteDeclaration]: (node: TSESTree.CallExpression) => {
          const suiteTitle = ASTUtils.getStringIfConstant(node.arguments[0]);
          const [{ name: suiteName }] = context.getDeclaredVariables(
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
             * The selector `suiteDeclaration` ensures that the variable node has a parent of
             * VariableDeclarator. Therefore, the simplicity brought by this non-null assertion
             * overweighs the type-safety gained by an extra if-statement.
             */
            node.parent!
          );
          if (suiteTitle != undefined) {
            if (suiteTitles.has(suiteTitle)) {
              context.report({ messageId: "duplicateSuites", node });
            } else {
              suiteTitles.add(suiteTitle);
              namedTestTitles.set(suiteName, new Set());
            }
          }
        },
        "CallExpression[callee.type=Identifier]": (
          node: TSESTree.CallExpression
        ) => {
          // This downcast is safe because the query `[callee.type=Identifier]` guarantees that
          // `node.callee` corresponds to an identifier.
          const { name } = node.callee as TSESTree.Identifier;
          if (namedTestTitles.has(name)) {
            const namedTitle = ASTUtils.getStringIfConstant(node.arguments[0]);
            if (namedTitle != undefined) {
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
               * We know `namedTestTitles.get(name)` can't be undefined if `namedTestTitles.has(name)`,
               * but the compiler doesn't.
               * cf. https://github.com/microsoft/TypeScript/issues/13086
               */
              if (namedTestTitles.get(name)!.has(namedTitle)) {
                context.report({ messageId: "duplicateTitles", node });
              } else {
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
                 * We know `namedTestTitles.get(name)` can't be undefined if `namedTestTitles.has(name)`,
                 * but the compiler doesn't.
                 * cf. https://github.com/microsoft/TypeScript/issues/13086
                 */
                namedTestTitles.get(name)!.add(namedTitle);
              }
            }
          }
        },
      };
    }
    return { ...testListener, ...suiteListener };
  },
});

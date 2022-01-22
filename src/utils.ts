import {
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/experimental-utils";

/**
 * Rule creator for eslint-plugin-uvu.
 */
export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/yudai-nkt/eslint-plugin-uvu/tree/main/docs/rule/${name}.md`
);

type ImportStatus =
  | undefined
  | {
      isNamed: true;
      alias: string;
    }
  | {
      isNamed: false;
      namespace: string;
    };

type UvuAPI =
  | {
      module: "uvu";
      member: "suite" | "test";
    }
  | {
      module: "uvu/assert";
      member:
        | "is"
        | "equal"
        | "type"
        | "instance"
        | "match"
        | "snapshot"
        | "fixture"
        | "throws"
        | "unreachable"
        | "not";
    };

const isImportDeclaration = (
  statement: TSESTree.ProgramStatement
): statement is TSESTree.ImportDeclaration =>
  statement.type === "ImportDeclaration";

const isImportSpecifier = (
  clause: TSESTree.ImportClause
): clause is TSESTree.ImportSpecifier => clause.type === "ImportSpecifier";

/**
 * Search a body of a parsed AST and find a given uvu API.
 * @param api uvu's API in question.
 * @param code Code to investigate.
 * @returns Whether and how the API is imported.
 */
export const getImportStatus = (
  { module, member }: UvuAPI,
  code: TSESTree.ProgramStatement[]
): ImportStatus => {
  const uvuImport = code.find(
    (statement): statement is TSESTree.ImportDeclaration =>
      isImportDeclaration(statement) && statement.source.value === module
  );

  // ${api.module} is not imported at all
  if (uvuImport === undefined) {
    return;
  }

  const {
    specifiers: [specifier],
  } = uvuImport;
  // import * as foo from ${api.module}
  const {
    type,
    local: { name },
  } = specifier;
  if (type === "ImportNamespaceSpecifier") {
    return {
      isNamed: false,
      namespace: name,
    };
  } else if (type === "ImportDefaultSpecifier") {
    return;
  }

  // import {bar, baz as qux} from ${api.module}
  const importedMember = uvuImport.specifiers.find(
    (specifier) =>
      isImportSpecifier(specifier) && specifier.imported.name === member
  );
  if (importedMember === undefined) {
    // ${api.member} is not imported.
    return;
  } else {
    return {
      isNamed: true,
      alias: importedMember.local.name,
    };
  }
};

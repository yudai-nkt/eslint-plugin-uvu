import type { TSESLint } from "@typescript-eslint/experimental-utils";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { compile } from "tempura";

type RuleModule = TSESLint.RuleModule<string> & {
  meta: Required<Pick<TSESLint.RuleMetaData<string>, "docs">>;
};

const rulesDir = "./src/rules";

const rules = await Promise.all(
  readdirSync(rulesDir).map(async (file) => {
    const name = file.replace(/\.ts$/, "");
    const rule = (await import(join("../", rulesDir, file))) as {
      default: RuleModule;
    };
    const {
      meta: {
        docs: { description, recommended },
      },
    } = rule.default;

    return { name, description, recommended };
  })
);

const template = readFileSync("./scripts/templates/rules-table.md.hbs", {
  encoding: "utf-8",
});
const renderer = compile(template);

const table = await renderer({ rules });
const readme = readFileSync("./README.md", {
  encoding: "utf-8",
});
writeFileSync(
  "./README.md",
  readme.replace(
    /<!-- rules table begins -->[\S\s]*<!-- rules table ends -->/,
    `<!-- rules table begins -->${table}\n<!-- rules table ends -->`
  ),
  { encoding: "utf-8" }
);

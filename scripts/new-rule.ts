import { readFile, readFileSync, writeFile, writeFileSync } from "node:fs";
import prompts, { type PromptObject } from "prompts";
import { compile } from "tempura";

const questions: PromptObject[] = [
  {
    type: "text",
    name: "name",
    message: "Name of the new rule.",
    validate: (name) =>
      name.match(/[a-z][a-z-]*[a-z]/)
        ? true
        : "Rule name should contain lowercase latin characters and hyphens only, and should not start/end with a hyphen.",
  },
  {
    type: "text",
    name: "description",
    message: "Concise description of the rule.",
    validate: (description) =>
      description.match(/[A-Z].+\./)
        ? true
        : "Description should start with an uppercase and end with a period.",
  },
  {
    type: "select",
    name: "type",
    message: "Type of the rule.",
    choices: [
      {
        title: "Problem",
        value: "problem",
        description:
          "A rule that identifies possible errors or confusing behaviors.",
      },
      {
        title: "Suggestion",
        value: "suggestion",
        description:
          "A rule that identifies something that could be done in a better way.",
      },
      {
        title: "Layout",
        value: "layout",
        description: "A rule that identifies stylistic issues.",
      },
    ],
  },
  {
    type: "confirm",
    name: "hasOption",
    message: "Will the new rule have an option?",
    initial: false,
  },
];

const answer = await prompts(questions);

const targets = [
  {
    src: "./scripts/templates/doc.md.hbs",
    dest: "./docs/rules",
    ext: "md",
  },
  {
    src: "./scripts/templates/rule.ts.hbs",
    dest: "./src/rules",
    ext: "ts",
  },
  {
    src: "./scripts/templates/test.ts.hbs",
    dest: "./src/__tests__/rules",
    ext: "test.ts",
  },
];

for (const { src, dest, ext } of targets) {
  writeFileSync(
    `${dest}/${answer.name}.${ext}`,
    await compile(readFileSync(src, { encoding: "utf-8" }))(answer),
    { encoding: "utf-8" }
  );
}

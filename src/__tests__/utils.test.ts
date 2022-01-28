import * as espree from "espree";
import { dedent } from "ts-dedent";
import { suite } from "uvu";
import assert from "uvu/assert";
import { getImportStatus } from "../utils";

const Utils = suite("Test suite for utils.ts");
const { body } = espree.parse(
  dedent`
    import { test as it } from "uvu";
    import * as assert from "uvu/assert";
  `,
  { ecmaVersion: 2015, sourceType: "module" }
);

Utils("should return an import status of uvu's API.", () => {
  const uvuSuite = getImportStatus({ module: "uvu", member: "suite" }, body);
  const uvuTest = getImportStatus({ module: "uvu", member: "test" }, body);
  const uvuAssertIs = getImportStatus(
    { module: "uvu/assert", member: "is" },
    body
  );
  assert.is(uvuSuite, undefined);
  assert.equal(uvuTest, { isNamed: true, alias: "it" });
  assert.equal(uvuAssertIs, { isNamed: false, namespace: "assert" });
});

Utils.run();

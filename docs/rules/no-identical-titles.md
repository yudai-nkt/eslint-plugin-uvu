# uvu/no-identical-titles

Enforce each test case to have a unique title.

## Rationale

Duplicate test titles make it hard to find failing tests.
This rule encourages users to define a unique title to each test.

## Examples

Examples of **incorrect** code for this rule:

```javascript
import { test } from "uvu";
test("foo", () => {});
test("foo", () => {});
```

```javascript
import { suite } from "uvu";
const foo = suite("foo");
foo("bar", () => {});
foo("bar", () => {});
```

```javascript
import { suite } from "uvu";
const foo = suite("foo");
const bar = suite("foo");
```

Examples of **correct** code for this rule:

```javascript
import { test } from "uvu";
test("foo", () => {});
test("bar", () => {});
```

```javascript
import { suite } from "uvu";
const foo = suite("foo");
foo("baz", () => {});
const bar = suite("bar");
// This is OK because the tests are under different suites.
bar("baz", () => {});
```

## Resources

- [Rule source](../../src/rules/no-identical-titles.ts)
- [Test source](../../src/__tests__/rules/no-identical-titles.test.ts)

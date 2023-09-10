# uvu/call-run

Enforce each test case to be added to uvu's queue.

## Rationale

It is popular mistake to forget `test.run()` from debug session.

## Examples

Examples of **incorrect** code for this rule:

```javascript
import { test } from "uvu";
test("foo", () => {});
```

```javascript
import { suite } from "uvu";
const foo = suite("foo");
foo("a", () => {});
const bar = suite("bar");
bar("b", () => {});
foo.run();
```

Examples of **correct** code for this rule:

```javascript
import { test } from "uvu";
test("foo", () => {});
test.run();
```

```javascript
import { suite } from "uvu";
const foo = suite("");
foo("baz", () => {});
foo.run();
```

```javascript
import { suite } from "uvu";
const foo = suite("foo");
foo("a", () => {});
const bar = suite("bar");
bar("b", () => {});
foo.run();
bar.run();
```

## Resources

- [Rule source](../../src/rules/call-run.ts)
- [Test source](../../src/__tests__/rules/call-run.test.ts)

# uvu/prefer-is-for-primitives

Prefer `is` to `equal` for assertions against primitive literals.

## Rationale

Methods `is` and `equal` act on primitive values almost identically, but give different messages when the test fails.
This rule encourage use of `is` where available to get more informative messages on test failures.
It also clarifies what types of value is expected in the test.

## Examples

Examples of __incorrect__ code for this rule:

```javascript
import * as assert from "uvu/assert";
assert.equal(0, 0);
```

```javascript
import { equal as uvuEqual } from "uvu/assert";
uvuEqual(0, 0);
```

Examples of __correct__ code for this rule:

```javascript
import * as assert from "uvu/assert";
assert.is(0, 0);
assert.equal([0], [0]);
```

## Resources

- [Rule source](../../src/rules/prefer-is-for-primitives.ts)
- [Test source](../../src/__tests__/rules/prefer-is-for-primitives.test.ts)

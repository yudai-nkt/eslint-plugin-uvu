# uvu/no-test-only

Warn about forgotten `test.only()`.

## Rationale

It is popular mistake to forget `test.only()` from debug session.

## Examples

Examples of **incorrect** code for this rule:

```javascript
test.only("sum", () => {
  tassert.type(math.sum, "function");
  tassert.is(math.sum(1, 2), 3);
  tassert.is(math.sum(-1, -2), -3);
  tassert.is(math.sum(-1, 1), 0);
});
```

Examples of **correct** code for this rule:

```javascript
test("sum", () => {
  tassert.type(math.sum, "function");
  tassert.is(math.sum(1, 2), 3);
  tassert.is(math.sum(-1, -2), -3);
  tassert.is(math.sum(-1, 1), 0);
});
test.run();
```

## Resources

- [Rule source](../../src/rules/no-test-only.ts)
- [Test source](../../src/__tests__/rules/no-test-only.test.ts)

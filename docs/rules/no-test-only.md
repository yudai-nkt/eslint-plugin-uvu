# uvu/no-test-only

Warn about forgotten `test.only()`.

## Rationale

It is popular mistake to forget `test.only()` from debug session.

## Examples

Examples of **incorrect** code for this rule:

```javascript
test.only();
```

Examples of **correct** code for this rule:

```javascript
test();
```

## Resources

- [Rule source](../../src/rules/no-test-only.ts)
- [Test source](../../src/__tests__/rules/no-test-only.test.ts)

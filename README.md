# coi-rules

A small rule engine for evaluating **certificates of insurance** against
client compliance requirements.

This is a simplified extract of something we actually run. Property managers
tell us what coverage their vendors and tenants must carry; certificates come
in from dozens of carriers in wildly inconsistent shapes; we normalize them and
check them against a rule tree.

## Setup

```bash
npm install
npm test          # vitest, one run
npm run test:watch
npm run typecheck
```

Node 20+. No other dependencies, no network access needed, no database.

## Layout

```
src/types.ts      Certificate and Rule types
src/evaluator.ts  evaluateRule() — the thing that does the work
src/fixtures.ts   Sample certificates and a standard requirement set
tests/            Vitest suite
```

## The model

A `Rule` is a tree. Leaves compare a field on the certificate against a value;
`and` / `or` nodes combine them.

```ts
const rule: Rule = {
  op: 'and',
  rules: [
    { op: 'gte', field: 'liabilityLimit', value: 2_000_000 },
    { op: 'exists', field: 'policyExpiry' },
    {
      op: 'or',
      rules: [
        { op: 'eq', field: 'coverageType', value: 'commercial-general-liability' },
        { op: 'eq', field: 'coverageType', value: 'umbrella' },
      ],
    },
  ],
};

evaluateRule(rule, certificate); // => boolean
```

`field` is a dot-path, so `broker.licenceNumber` works.

## Notes

Certificate fields are mostly optional. Carriers omit things constantly, and
the upstream normalizer does not fill in defaults.

In production, the rule trees on our quoting side are not hand-written — they
are compiled from spreadsheets that brokers maintain themselves.

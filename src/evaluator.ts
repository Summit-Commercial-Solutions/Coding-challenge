import type { Certificate, Rule } from './types';

/**
 * Resolve a dot-path against a certificate.
 * Returns undefined if any segment along the way is missing.
 */
export function getField(cert: Certificate, path: string): unknown {
  return path
    .split('.')
    .reduce<any>((acc, key) => (acc == null ? undefined : acc[key]), cert);
}

/**
 * Evaluate a rule against a certificate.
 *
 * Returns true if the certificate satisfies the rule.
 */
export function evaluateRule(rule: Rule, cert: Certificate): boolean {
  switch (rule.op) {
    case 'and':
      return rule.rules.every((r) => evaluateRule(r, cert));

    case 'or':
      return rule.rules.some((r) => evaluateRule(r, cert));

    case 'gte':
      return (getField(cert, rule.field) as number) >= rule.value;

    case 'lte':
      return (getField(cert, rule.field) as number) <= rule.value;

    case 'eq':
      return getField(cert, rule.field) === rule.value;

    case 'exists': {
      const actual = getField(cert, rule.field);
      return actual !== undefined && actual !== null;
    }
  }
}

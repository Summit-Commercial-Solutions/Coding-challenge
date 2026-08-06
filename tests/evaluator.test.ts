import { describe, it, expect } from 'vitest';
import { evaluateRule } from '../src/evaluator';
import type { Certificate, Rule } from '../src/types';
import {
  standardRequirements,
  acmeRestoration,
  bridgeportPlumbing,
  harbourviewElectric,
  kootenayRoofing,
} from '../src/fixtures';

describe('comparison operators', () => {
  it('accepts a limit at or above the threshold', () => {
    const rule: Rule = { op: 'gte', field: 'liabilityLimit', value: 2_000_000 };
    expect(evaluateRule(rule, acmeRestoration)).toBe(true);
    expect(evaluateRule(rule, { ...acmeRestoration, liabilityLimit: 2_000_000 })).toBe(true);
  });

  it('accepts a deductible at or below the threshold', () => {
    const rule: Rule = { op: 'lte', field: 'deductible', value: 10_000 };
    expect(evaluateRule(rule, acmeRestoration)).toBe(true);
    expect(evaluateRule(rule, kootenayRoofing)).toBe(false);
  });

  it('compares scalars with eq', () => {
    expect(
      evaluateRule({ op: 'eq', field: 'waiverOfSubrogation', value: true }, acmeRestoration),
    ).toBe(true);
    expect(
      evaluateRule({ op: 'eq', field: 'waiverOfSubrogation', value: true }, kootenayRoofing),
    ).toBe(false);
  });

  it('resolves dot-paths into nested objects', () => {
    const rule: Rule = { op: 'exists', field: 'broker.licenceNumber' };
    expect(evaluateRule(rule, acmeRestoration)).toBe(true);
    expect(evaluateRule(rule, harbourviewElectric)).toBe(false);
  });
});

describe('composition', () => {
  it('requires every branch of an and', () => {
    const rule: Rule = {
      op: 'and',
      rules: [
        { op: 'gte', field: 'liabilityLimit', value: 2_000_000 },
        { op: 'eq', field: 'waiverOfSubrogation', value: true },
      ],
    };
    expect(evaluateRule(rule, acmeRestoration)).toBe(true);
    expect(evaluateRule(rule, kootenayRoofing)).toBe(false);
  });

  it('requires only one branch of an or', () => {
    const rule: Rule = {
      op: 'or',
      rules: [
        { op: 'eq', field: 'coverageType', value: 'commercial-general-liability' },
        { op: 'eq', field: 'coverageType', value: 'umbrella' },
      ],
    };
    expect(evaluateRule(rule, kootenayRoofing)).toBe(true);
    expect(
      evaluateRule(rule, { ...kootenayRoofing, coverageType: 'professional-liability' }),
    ).toBe(false);
  });

  it('nests to arbitrary depth', () => {
    const rule: Rule = {
      op: 'and',
      rules: [
        { op: 'exists', field: 'certificateId' },
        {
          op: 'or',
          rules: [
            { op: 'gte', field: 'liabilityLimit', value: 10_000_000 },
            {
              op: 'and',
              rules: [
                { op: 'gte', field: 'liabilityLimit', value: 2_000_000 },
                { op: 'eq', field: 'waiverOfSubrogation', value: true },
              ],
            },
          ],
        },
      ],
    };
    expect(evaluateRule(rule, acmeRestoration)).toBe(true);
  });
});

describe('standard requirements', () => {
  it('accepts a fully compliant certificate', () => {
    expect(evaluateRule(standardRequirements, acmeRestoration)).toBe(true);
  });

  it('rejects certificates that do not meet the liability requirement', () => {
    const belowRequirement: Certificate[] = [bridgeportPlumbing, harbourviewElectric];
    for (const cert of belowRequirement) {
      expect(evaluateRule(standardRequirements, cert)).toBe(false);
    }
  });

  it('rejects a certificate with an excessive deductible', () => {
    expect(evaluateRule(standardRequirements, kootenayRoofing)).toBe(false);
  });
});

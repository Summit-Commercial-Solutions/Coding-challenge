import type { Certificate, Rule } from './types';

/**
 * The requirements most of our property-manager clients impose on
 * vendors and tenants. In production this is per-client and versioned;
 * here it's just a constant.
 */
export const standardRequirements: Rule = {
  op: 'and',
  rules: [
    { op: 'gte', field: 'liabilityLimit', value: 2_000_000 },
    { op: 'lte', field: 'deductible', value: 10_000 },
    { op: 'eq', field: 'waiverOfSubrogation', value: true },
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

export const acmeRestoration: Certificate = {
  certificateId: 'COI-10041',
  insuredName: 'Acme Restoration Ltd.',
  liabilityLimit: 5_000_000,
  deductible: 2_500,
  policyExpiry: '2027-03-31',
  coverageType: 'commercial-general-liability',
  waiverOfSubrogation: true,
  additionalInsureds: ['Summit Commercial Solutions Inc.', 'Strata Plan BCS-4417'],
  broker: { name: 'Fraser Valley Insurance', licenceNumber: 'BC-118204' },
};

export const bridgeportPlumbing: Certificate = {
  certificateId: 'COI-10042',
  insuredName: 'Bridgeport Plumbing & Heating',
  liabilityLimit: 1_000_000,
  deductible: 5_000,
  policyExpiry: '2026-12-15',
  coverageType: 'commercial-general-liability',
  waiverOfSubrogation: true,
  broker: { name: 'Fraser Valley Insurance', licenceNumber: 'BC-118204' },
};

export const harbourviewElectric: Certificate = {
  certificateId: 'COI-10043',
  insuredName: 'Harbourview Electric Inc.',
  deductible: 1_000,
  policyExpiry: '2027-01-09',
  coverageType: 'commercial-general-liability',
  waiverOfSubrogation: true,
  broker: { name: 'Coastline Brokers' },
};

export const kootenayRoofing: Certificate = {
  certificateId: 'COI-10044',
  insuredName: 'Kootenay Roofing Co.',
  liabilityLimit: 3_000_000,
  deductible: 25_000,
  policyExpiry: '2026-08-20',
  coverageType: 'umbrella',
  waiverOfSubrogation: false,
  broker: { name: 'Coastline Brokers', licenceNumber: 'BC-990311' },
};

export const allCertificates = [
  acmeRestoration,
  bridgeportPlumbing,
  harbourviewElectric,
  kootenayRoofing,
];

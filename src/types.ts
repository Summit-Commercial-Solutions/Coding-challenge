/**
 * A certificate of insurance, as we receive it from a broker or carrier
 * after normalization. Most fields are optional because carriers vary
 * wildly in what they actually send us.
 */
export interface Certificate {
  certificateId: string;
  insuredName: string;
  liabilityLimit?: number;
  deductible?: number;
  /** ISO-8601 date, e.g. "2026-11-30" */
  policyExpiry?: string;
  coverageType?: string;
  waiverOfSubrogation?: boolean;
  additionalInsureds?: string[];
  broker?: {
    name?: string;
    licenceNumber?: string;
  };
}

/**
 * A compliance rule. Rules are authored by our team (and, on the quoting
 * side, compiled down from broker-maintained spreadsheets) and evaluated
 * against an incoming certificate.
 *
 * `field` is a dot-path into the certificate, e.g. "liabilityLimit" or
 * "broker.licenceNumber".
 */
export type Rule =
  | { op: 'and'; rules: Rule[] }
  | { op: 'or'; rules: Rule[] }
  | { op: 'gte'; field: string; value: number }
  | { op: 'lte'; field: string; value: number }
  | { op: 'eq'; field: string; value: string | number | boolean }
  | { op: 'exists'; field: string };

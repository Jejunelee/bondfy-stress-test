export const RETAIL_PCT = 0.0025; // 0.25% of bond
export const DIST_PCT = 0.005; // 0.5% of bond
export const COUPON_MGMT = 0.2; // 20% of coupon payments
export const CASHOUT_BPS = 0.0025; // 25 bps cashout fee
export const SECONDARY_SALE_FEE = 0.0025; // 0.25% secondary sale fee

export const TIERS = [
  { label: "₱0–250M", rate: 0.001, pct: "0.1%" },
  { label: "₱250M–500M", rate: 0.002, pct: "0.2%" },
  { label: "₱500M–750M", rate: 0.003, pct: "0.3%" },
  { label: "₱750M+", rate: 0.004, pct: "0.4%" },
] as const;

export const SCENARIOS = {
  small: {
    bond: 100_000_000,
    tenor: 5,
    maRate: 0.02,
    bondfyShareOfMA: 0.01,
    couponRate: 0.055,
    cashoutVolumePct: 0.05,
    secondaryVolumePct: 0.10,
    secondarySaleFee: 0.0025,
  },
  mid: {
    bond: 400_000_000,
    tenor: 7,
    maRate: 0.03,
    bondfyShareOfMA: 0.01,
    couponRate: 0.06,
    cashoutVolumePct: 0.10,
    secondaryVolumePct: 0.15,
    secondarySaleFee: 0.0025,
  },
  large: {
    bond: 800_000_000,
    tenor: 10,
    maRate: 0.025,
    bondfyShareOfMA: 0.01,
    couponRate: 0.065,
    cashoutVolumePct: 0.15,
    secondaryVolumePct: 0.20,
    secondarySaleFee: 0.0025,
  },
  mega: {
    bond: 2_000_000_000,
    tenor: 15,
    maRate: 0.02,
    bondfyShareOfMA: 0.01,
    couponRate: 0.07,
    cashoutVolumePct: 0.20,
    secondaryVolumePct: 0.25,
    secondarySaleFee: 0.0025,
  },
} as const;

export type ScenarioKey = keyof typeof SCENARIOS;
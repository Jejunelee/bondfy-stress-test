export type TrancheMode = "split" | "close" | "retainer";

export interface CoreMetrics {
  bond: number;
  tenor: number;
  maRate: number;
  bondfyShareOfMA: number;
  couponRate: number;
  cashoutVolumePct: number;
  secondaryVolumePct: number;
  secondarySaleFee: number;
  maTotalFee: number;
  bondfyMA: number;
  aynKeeps: number;
  distFee: number;
  retailTranche: number;
  annualCoupons: number;
  annualCouponMgmt: number;
  annualCashout: number;
  annualCashoutVol: number;
  annualSecondaryVolume: number;
  annualSecondaryRevenue: number;
  totalSecondaryRevenue: number;
  annualRecurring: number;
  oneTime: number;
  year1Total: number;
  grandTotal: number;
  takeRate: number;
  lguNet: number;
  bankEst: number;
  totalCouponMgmt: number;
  totalCashout: number;
}

export interface ReferralMetrics {
  tier: {
    rate: number;
    label: string;
    pct: string;
  };
  refFeePerDeal: number;
  totalRefFees: number;
  signAmount: number;
  closeAmount: number;
  retainerTotal: number;
  bondfyNet: number;
  closedDeals: number;
  closeRate: number;
}

export interface LifecycleYear {
  year: number | string;
  amount: number;
  isBulk?: boolean;
}
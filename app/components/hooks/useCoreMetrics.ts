import { useMemo } from "react";
import { CoreMetrics } from "../types";
import { RETAIL_PCT, DIST_PCT, COUPON_MGMT, CASHOUT_BPS } from "../constants";

export const useCoreMetrics = ({
  bond,
  tenor,
  maRate,
  bondfyShareOfMA,
  couponRate,
  cashoutVolumePct,
  secondaryVolumePct,
  secondarySaleFee,
}: {
  bond: number;
  tenor: number;
  maRate: number;
  bondfyShareOfMA: number;
  couponRate: number;
  cashoutVolumePct: number;
  secondaryVolumePct: number;
  secondarySaleFee: number;
}): CoreMetrics => {
  return useMemo(() => {
    const maTotalFee = bond * maRate;
    const bondfyMA = bond * bondfyShareOfMA;
    const aynKeeps = maTotalFee - bondfyMA;

    const distFee = bond * DIST_PCT;
    const retailTranche = bond * RETAIL_PCT;

    const annualCoupons = bond * couponRate;
    const annualCouponMgmt = annualCoupons * COUPON_MGMT;

    const annualCashoutVol = bond * cashoutVolumePct;
    const annualCashout = annualCashoutVol * CASHOUT_BPS;

    const annualSecondaryVolume = bond * secondaryVolumePct;
    const annualSecondaryRevenue = annualSecondaryVolume * secondarySaleFee;
    const totalSecondaryRevenue = annualSecondaryRevenue * tenor;

    const annualRecurring = annualCouponMgmt + annualCashout + annualSecondaryRevenue;
    const oneTime = bondfyMA + distFee;

    const year1Total = oneTime + annualRecurring;
    const grandTotal = oneTime + annualRecurring * tenor;
    const takeRate = grandTotal / bond;

    const lguNet = bond - maTotalFee;
    const bankEst = bond * 0.005 * tenor;

    const totalCouponMgmt = annualCouponMgmt * tenor;
    const totalCashout = annualCashout * tenor;

    return {
      bond,
      tenor,
      maRate,
      bondfyShareOfMA,
      couponRate,
      cashoutVolumePct,
      secondaryVolumePct,
      secondarySaleFee,
      maTotalFee,
      bondfyMA,
      aynKeeps,
      distFee,
      retailTranche,
      annualCoupons,
      annualCouponMgmt,
      annualCashout,
      annualCashoutVol,
      annualSecondaryVolume,
      annualSecondaryRevenue,
      totalSecondaryRevenue,
      annualRecurring,
      oneTime,
      year1Total,
      grandTotal,
      takeRate,
      lguNet,
      bankEst,
      totalCouponMgmt,
      totalCashout,
    };
  }, [bond, tenor, maRate, bondfyShareOfMA, couponRate, cashoutVolumePct, secondaryVolumePct, secondarySaleFee]);
};
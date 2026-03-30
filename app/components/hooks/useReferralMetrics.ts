import { useMemo } from "react";
import { ReferralMetrics, TrancheMode } from "../types";
import { getReferralTier } from "../utils/formatters";

export const useReferralMetrics = (
  bond: number,
  nRefs: number,
  trancheMode: TrancheMode,
  grandTotal: number
): ReferralMetrics => {
  return useMemo(() => {
    const tier = getReferralTier(bond);
    const refFeePerDeal = bond * tier.rate;
    const totalRefFees = refFeePerDeal * nRefs;

    let signAmount = 0;
    let closeAmount = 0;
    let retainerTotal = 0;

    switch (trancheMode) {
      case "split":
        signAmount = refFeePerDeal * 0.5;
        closeAmount = refFeePerDeal * 0.5;
        break;
      case "close":
        closeAmount = refFeePerDeal;
        break;
      case "retainer":
        retainerTotal = 40000 * 24;
        closeAmount = Math.max(0, refFeePerDeal - retainerTotal);
        break;
    }

    const bondfyNet = grandTotal - totalRefFees;

    const closeRate = nRefs <= 3 ? 0.9 : nRefs <= 6 ? 0.8 : nRefs <= 10 ? 0.7 : 0.6;
    const closedDeals = Math.round(nRefs * closeRate);

    return {
      tier,
      refFeePerDeal,
      totalRefFees,
      signAmount,
      closeAmount,
      retainerTotal,
      bondfyNet,
      closedDeals,
      closeRate,
    };
  }, [bond, nRefs, trancheMode, grandTotal]);
};
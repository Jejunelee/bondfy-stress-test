import { StreamCard } from "./StreamCard";
import { formatCurrency, formatPercent } from "../utils/formatters";

interface RevenueStreamsDisplayProps {
  bondfyMA: number;
  distFee: number;
  totalCouponMgmt: number;
  annualCouponMgmt: number;
  totalCashout: number;
  cashoutVolumePct: number;
  totalSecondaryRevenue: number;
  secondaryVolumePct: number;
  secondarySaleFee: number;
  grandTotal: number;
  tenor: number;
  bondfyShareOfMA: number;
}

export const RevenueStreamsDisplay = ({
  bondfyMA,
  distFee,
  totalCouponMgmt,
  annualCouponMgmt,
  totalCashout,
  cashoutVolumePct,
  totalSecondaryRevenue,
  secondaryVolumePct,
  secondarySaleFee,
  grandTotal,
  tenor,
  bondfyShareOfMA,
}: RevenueStreamsDisplayProps) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-amber-500 rounded-full" /> Revenue Streams — Bondfy Only (Full Tenor)
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <StreamCard
          label="AYN Rev Share"
          value={bondfyMA}
          total={grandTotal}
          sub={`${formatPercent(bondfyShareOfMA * 100, 1)} of bond · one-time`}
          color="teal"
          tag="fixed"
        />
        <StreamCard
          label="Distribution Fee"
          value={distFee}
          total={grandTotal}
          sub="0.5% of bond · one-time"
          color="amber"
          tag="fixed"
        />
        <StreamCard
          label="Coupon Mgmt"
          value={totalCouponMgmt}
          total={grandTotal}
          sub={`${formatCurrency(annualCouponMgmt)}/yr × ${tenor} yrs`}
          color="purple"
          tag="recurring"
        />
        <StreamCard
          label="Cashout Fees"
          value={totalCashout}
          total={grandTotal}
          sub={`${formatPercent(cashoutVolumePct * 100, 1)} of bond cashed out/yr × ${tenor} yrs`}
          color="green"
          tag="recurring"
        />
        <StreamCard
          label="Secondary Market"
          value={totalSecondaryRevenue}
          total={grandTotal}
          sub={`${formatPercent(secondaryVolumePct * 100, 0)} of bond traded/yr @ ${formatPercent(secondarySaleFee * 100, 2)} fee × ${tenor} yrs`}
          color="cyan"
          tag="recurring"
        />
      </div>
    </div>
  );
};
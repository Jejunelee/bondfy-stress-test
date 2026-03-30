import { PartyCard } from "./PartyCard";
import { formatPercent, formatCurrency } from "../utils/formatters";

interface PartyEarningsProps {
  lguNet: number;
  aynKeeps: number;
  bankEst: number;
  grandTotal: number;
  maRate: number;
  tenor: number;
}

export const PartyEarnings = ({
  lguNet,
  aynKeeps,
  bankEst,
  grandTotal,
  maRate,
  tenor,
}: PartyEarningsProps) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-blue-500 rounded-full" /> Full Deal — Earnings by Party
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PartyCard label="LGU" role="Net proceeds" amount={lguNet} sub="after MA fee" />
        <PartyCard label="AYN Resources" role="MA fee net of Bondfy" amount={aynKeeps} sub={`${formatPercent(maRate * 100, 1)}% MA fee`} color="teal" />
        <PartyCard label="Trustee Bank" role="Est. trust spread" amount={bankEst} sub="50bps/yr est." color="amber" />
        <PartyCard label="Bondfy" role="All 5 streams" amount={grandTotal} sub={`${tenor}-yr total`} color="blue" />
      </div>
    </div>
  );
};
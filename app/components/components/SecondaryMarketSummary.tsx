import { formatCurrency, formatPercent } from "../utils/formatters";

interface SecondaryMarketSummaryProps {
  secondaryVolumePct: number;
  annualSecondaryVolume: number;
  annualSecondaryRevenue: number;
  totalSecondaryRevenue: number;
  secondarySaleFee: number;
  tenor: number;
}

export const SecondaryMarketSummary = ({
  secondaryVolumePct,
  annualSecondaryVolume,
  annualSecondaryRevenue,
  totalSecondaryRevenue,
  secondarySaleFee,
  tenor,
}: SecondaryMarketSummaryProps) => {
  return (
    <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900/40 backdrop-blur-sm border border-cyan-800/30 rounded-2xl p-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-cyan-500 rounded-full" /> Secondary Market Summary
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Volume</div>
          <div className="text-lg font-bold text-cyan-400">{formatPercent(secondaryVolumePct * 100, 0)}</div>
          <div className="text-[10px] text-slate-500">of total bond</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Trades</div>
          <div className="text-lg font-bold text-cyan-400">{formatCurrency(annualSecondaryVolume)}</div>
          <div className="text-[10px] text-slate-500">per year</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Revenue</div>
          <div className="text-lg font-bold text-cyan-400">{formatCurrency(annualSecondaryRevenue)}</div>
          <div className="text-[10px] text-slate-500">@ {formatPercent(secondarySaleFee * 100, 2)} fee</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Total Tenor Revenue</div>
          <div className="text-lg font-bold text-cyan-400">{formatCurrency(totalSecondaryRevenue)}</div>
          <div className="text-[10px] text-slate-500">over {tenor} years</div>
        </div>
      </div>
    </div>
  );
};
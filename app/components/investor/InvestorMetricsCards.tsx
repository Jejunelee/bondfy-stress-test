import { formatCurrency, formatPercent } from "../utils/formatters";

interface InvestorMetricsCardsProps {
  metrics: any;
}

export const InvestorMetricsCards = ({ metrics }: InvestorMetricsCardsProps) => {
  const showPrincipalReturn = metrics.principalReturned > 0;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-green-900/20 to-slate-900/40 border border-green-500/30 rounded-xl p-4">
        <div className="text-[10px] font-mono uppercase text-slate-400">Total Return</div>
        <div className="text-xl font-bold text-green-400">{formatCurrency(metrics.totalReturn)}</div>
        <div className="text-[10px] font-mono text-slate-500 mt-1">
          {metrics.yearsInvested} year{metrics.yearsInvested !== 1 ? "s" : ""} total
        </div>
        {showPrincipalReturn && (
          <div className="text-[9px] text-green-500/70 mt-1">
            Includes principal return
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/40 border border-blue-500/30 rounded-xl p-4">
        <div className="text-[10px] font-mono uppercase text-slate-400">Net Profit</div>
        <div className="text-xl font-bold text-blue-400">{formatCurrency(metrics.netProfit)}</div>
        <div className="text-[10px] font-mono text-slate-500 mt-1">
          ROI: {formatPercent(metrics.roi, 2)}
        </div>
        <div className="text-[9px] text-slate-500 mt-1">
          Yield: {formatPercent(metrics.effectiveYield, 2)}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/40 border border-purple-500/30 rounded-xl p-4">
        <div className="text-[10px] font-mono uppercase text-slate-400">Annualized Return</div>
        <div className="text-xl font-bold text-purple-400">{formatPercent(metrics.annualizedReturn, 2)}</div>
        <div className="text-[10px] font-mono text-slate-500 mt-1">
          CAGR
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-amber-900/20 to-slate-900/40 border border-amber-500/30 rounded-xl p-4">
        <div className="text-[10px] font-mono uppercase text-slate-400">Annual Income</div>
        <div className="text-xl font-bold text-amber-400">{formatCurrency(metrics.annualCouponIncome)}</div>
        <div className="text-[10px] font-mono text-slate-500 mt-1">
          {formatPercent(metrics.effectiveYield, 2)} yield
        </div>
        <div className="text-[9px] text-slate-500">
          Paid semi-annually
        </div>
      </div>
    </div>
  );
};
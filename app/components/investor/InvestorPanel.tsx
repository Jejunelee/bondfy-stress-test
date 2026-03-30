import { Slider } from "../components/Slider";
import { formatCurrency, formatPercent } from "../utils/formatters";

interface InvestorPanelProps {
  investedAmount: number;
  yearsInvested: number;
  bondSize: number;
  tenor: number;
  couponRate: number;
  onInvestedAmountChange: (v: number) => void;
  onYearsInvestedChange: (v: number) => void;
}

export const InvestorPanel = ({
  investedAmount,
  yearsInvested,
  bondSize,
  tenor,
  couponRate,
  onInvestedAmountChange,
  onYearsInvestedChange,
}: InvestorPanelProps) => {
  const maxInvestment = bondSize;
  const ownershipPct = (investedAmount / bondSize) * 100;
  const annualCouponIncome = bondSize * couponRate * (investedAmount / bondSize);
  
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-green-500 rounded-full" /> Investment Parameters
      </h2>
      
      <Slider
        label="Investment Amount"
        value={investedAmount}
        min={100_000}
        max={maxInvestment}
        step={100_000}
        display={formatCurrency(investedAmount)}
        onChange={onInvestedAmountChange}
      />
      
      <div className="flex justify-between text-xs mb-4">
        <span className="text-slate-400">Ownership Stake</span>
        <span className="font-mono text-green-400">{ownershipPct.toFixed(4)}%</span>
      </div>
      
      <Slider
        label="Investment Period"
        value={yearsInvested}
        min={1}
        max={tenor}
        step={1}
        display={`${yearsInvested} year${yearsInvested !== 1 ? "s" : ""}`}
        onChange={onYearsInvestedChange}
      />
      
      <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
        <div className="text-[10px] font-mono text-slate-400 uppercase mb-2">Bond Details</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Bond Size:</span>
            <span className="font-mono text-white">{formatCurrency(bondSize)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Bond Tenor:</span>
            <span className="font-mono text-white">{tenor} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Coupon Rate:</span>
            <span className="font-mono text-green-400">{formatPercent(couponRate * 100, 2)}</span>
          </div>
          <div className="flex justify-between pt-2 mt-2 border-t border-slate-700">
            <span className="text-slate-400">Annual Income:</span>
            <span className="font-mono text-green-400">{formatCurrency(annualCouponIncome)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-[10px] text-slate-500 text-center">
        <p>Investment is pro-rata based on bond ownership percentage</p>
      </div>
    </div>
  );
};
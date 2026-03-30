import { Slider } from "./Slider";
import { formatPercent } from "../utils/formatters";

interface RevenueStreamsPanelProps {
  couponRate: number;
  cashoutVolumePct: number;
  secondaryVolumePct: number;
  secondarySaleFee: number;
  onCouponRateChange: (v: number) => void;
  onCashoutVolumeChange: (v: number) => void;
  onSecondaryVolumeChange: (v: number) => void;
  onSecondarySaleFeeChange: (v: number) => void;
}

export const RevenueStreamsPanel = ({
  couponRate,
  cashoutVolumePct,
  secondaryVolumePct,
  secondarySaleFee,
  onCouponRateChange,
  onCashoutVolumeChange,
  onSecondaryVolumeChange,
  onSecondarySaleFeeChange,
}: RevenueStreamsPanelProps) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-amber-500 rounded-full" /> Revenue Streams
      </h2>

      <Slider
        label="Coupon Rate"
        value={couponRate * 100}
        min={3}
        max={12}
        step={0.25}
        display={formatPercent(couponRate * 100, 2)}
        onChange={(v) => onCouponRateChange(v / 100)}
      />

      <Slider
        label="Annual Cashout Volume"
        value={cashoutVolumePct * 100}
        min={0.5}
        max={30}
        step={0.5}
        display={formatPercent(cashoutVolumePct * 100, 1)}
        onChange={(v) => onCashoutVolumeChange(v / 100)}
      />
      <div className="text-[10px] text-slate-500 -mt-2 mb-2 font-mono">
        % of total bond value cashed out annually
      </div>

      {/* Secondary Market Controls */}
      <div className="mt-4 pt-2 border-t border-slate-800">
        <div className="text-xs font-mono text-cyan-400 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span>
          Secondary Market
        </div>
        
        <Slider
          label="Secondary Market Volume"
          value={secondaryVolumePct * 100}
          min={0}
          max={50}
          step={1}
          display={formatPercent(secondaryVolumePct * 100, 0)}
          onChange={(v) => onSecondaryVolumeChange(v / 100)}
        />
        <div className="text-[10px] text-slate-500 -mt-2 mb-3 font-mono">
          % of total bond value traded annually on secondary market
        </div>

        <Slider
          label="Secondary Sale Fee"
          value={secondarySaleFee * 100}
          min={0.1}
          max={1}
          step={0.05}
          display={formatPercent(secondarySaleFee * 100, 2)}
          onChange={(v) => onSecondarySaleFeeChange(v / 100)}
        />
        <div className="text-[10px] text-slate-500 -mt-2 mb-2 font-mono">
          Fee charged on secondary market trades
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-3 mt-3 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>Retail tranche</span>
          <span className="font-mono">0.25% of bond</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Distribution fee</span>
          <span className="font-mono">0.5% of bond</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Coupon mgmt fee</span>
          <span className="font-mono">20% of coupons</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Cashout fee</span>
          <span className="font-mono">25 bps</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Secondary sale fee</span>
          <span className="font-mono">{formatPercent(secondarySaleFee * 100, 2)}</span>
        </div>
      </div>
    </div>
  );
};
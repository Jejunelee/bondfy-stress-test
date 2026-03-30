import { Slider } from "./components/Slider";
import { formatCurrency, formatPercent } from "./utils/formatters";

interface DealParametersPanelProps {
  bond: number;
  tenor: number;
  maRate: number;
  bondfyShareOfMA: number;
  onBondChange: (v: number) => void;
  onTenorChange: (v: number) => void;
  onMaRateChange: (v: number) => void;
  onBondfyShareChange: (v: number) => void;
  coreMetrics: any;
}

export const DealParametersPanel = ({
  bond,
  tenor,
  maRate,
  bondfyShareOfMA,
  onBondChange,
  onTenorChange,
  onMaRateChange,
  onBondfyShareChange,
  coreMetrics,
}: DealParametersPanelProps) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-blue-500 rounded-full" /> Deal Parameters
      </h2>

      <Slider
        label="Bond Size"
        value={bond}
        min={50_000_000}
        max={2_000_000_000}
        step={10_000_000}
        display={formatCurrency(bond)}
        onChange={onBondChange}
      />

      <Slider
        label="Tenor"
        value={tenor}
        min={3}
        max={15}
        step={1}
        display={`${tenor} years`}
        onChange={onTenorChange}
      />

      <div className="h-px bg-slate-800 my-4" />

      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-teal-500 rounded-full" /> AYN Resources
      </h2>

      <Slider
        label="MA Fee Rate"
        value={maRate * 100}
        min={1}
        max={5}
        step={0.1}
        display={formatPercent(maRate * 100, 1)}
        onChange={(v) => onMaRateChange(v / 100)}
      />

      <Slider
        label="Bondfy Share of MA"
        value={bondfyShareOfMA * 100}
        min={0.5}
        max={3}
        step={0.1}
        display={formatPercent(bondfyShareOfMA * 100, 1)}
        onChange={(v) => onBondfyShareChange(v / 100)}
      />

      <div className="bg-slate-800/50 rounded-lg p-3 mt-2 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>Total MA Fee</span>
          <span className="font-mono text-teal-400">{formatCurrency(coreMetrics.maTotalFee)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Bondfy receives</span>
          <span className="font-mono text-blue-400">{formatCurrency(coreMetrics.bondfyMA)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>AYN keeps</span>
          <span className="font-mono text-amber-400">{formatCurrency(coreMetrics.aynKeeps)}</span>
        </div>
      </div>
    </div>
  );
};
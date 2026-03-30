import { formatCurrency } from "./utils/formatters";
import { LifecycleYear } from "./types";

interface LifecycleChartProps {
  lifecycleData: LifecycleYear[];
}

export const LifecycleChart = ({ lifecycleData }: LifecycleChartProps) => {
  const maxAmount = lifecycleData[0]?.amount || 1;
  
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-teal-500 rounded-full" /> Year-by-Year Revenue Projection
      </h2>
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
        {lifecycleData.map((item, idx) => {
          const isYear1 = item.year === 1;
          const color = isYear1 ? "blue" : item.year === 2 ? "teal" : "green";
          const width = Math.max(3, (item.amount / maxAmount) * 100);
          return (
            <div key={idx} className="flex items-center gap-3 text-sm">
              <div className="w-20 font-mono text-slate-400 text-xs">
                {typeof item.year === "number" ? `Year ${item.year}` : item.year}
              </div>
              <div className="flex-1 h-7 bg-slate-800 rounded overflow-hidden">
                <div
                  className={`h-full flex items-center px-2 text-xs font-mono text-white ${
                    color === "blue" && "bg-blue-600"
                  } ${color === "teal" && "bg-teal-600"} ${color === "green" && "bg-green-600"}`}
                  style={{ width: `${width}%` }}
                >
                  {formatCurrency(item.amount)}
                </div>
              </div>
              <div className="w-24 text-right font-mono text-xs text-slate-300">
                {formatCurrency(item.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
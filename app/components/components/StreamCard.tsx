import { formatCurrency, formatPercent } from "../utils/formatters";

interface StreamCardProps {
  label: string;
  value: number;
  total: number;
  sub: string;
  color: "teal" | "amber" | "purple" | "green" | "cyan";
  tag: "fixed" | "recurring";
}

export const StreamCard = ({ label, value, total, sub, color, tag }: StreamCardProps) => {
  const colorMap = {
    teal: "border-teal-500/30 bg-teal-500/5",
    amber: "border-amber-500/30 bg-amber-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
    green: "border-green-500/30 bg-green-500/5",
    cyan: "border-cyan-500/30 bg-cyan-500/5",
  };
  
  const textColor = {
    teal: "text-teal-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
    green: "text-green-400",
    cyan: "text-cyan-400",
  };
  
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div className={`rounded-xl p-4 border ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
          tag === "fixed" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
        }`}>
          {tag === "fixed" ? "fixed" : "recurring"}
        </span>
      </div>
      <div className={`text-xl font-bold ${textColor[color]}`}>{formatCurrency(value)}</div>
      <div className="text-[10px] font-mono text-slate-500 mt-1">{sub}</div>
      <div className="mt-3 h-1 bg-slate-700 rounded overflow-hidden">
        <div className={`h-full bg-${color}-500`} style={{ width: `${Math.max(4, percentage)}%` }} />
      </div>
      <div className="text-right text-[10px] text-slate-500 mt-1">{formatPercent(percentage, 1)} of total</div>
    </div>
  );
};
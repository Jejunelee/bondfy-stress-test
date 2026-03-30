import { formatCurrency } from "../utils/formatters";

interface PayoutBarProps {
  label: string;
  amount: number;
  color: "teal" | "orange" | "amber";
}

export const PayoutBar = ({ label, amount, color }: PayoutBarProps) => {
  const bgColor = color === "teal" ? "bg-teal-500" : color === "orange" ? "bg-orange-500" : "bg-amber-500";
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-24 text-slate-400">{label}</div>
      <div className="flex-1 h-6 bg-slate-800 rounded overflow-hidden">
        <div className={`h-full flex items-center px-2 text-white font-mono ${bgColor}`} style={{ width: "100%" }}>
          {formatCurrency(amount)}
        </div>
      </div>
      <div className="w-20 text-right font-mono text-slate-300">{formatCurrency(amount)}</div>
    </div>
  );
};
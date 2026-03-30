import { formatCurrency } from "../utils/formatters";

interface PartyCardProps {
  label: string;
  role: string;
  amount: number;
  sub: string;
  color?: "teal" | "amber" | "blue" | "default";
}

export const PartyCard = ({ label, role, amount, sub, color = "default" }: PartyCardProps) => {
  const textColor =
    color === "teal"
      ? "text-teal-400"
      : color === "amber"
      ? "text-amber-400"
      : color === "blue"
      ? "text-blue-400"
      : "text-white";
      
  return (
    <div className="bg-slate-800/30 rounded-xl p-4 text-center border border-slate-700">
      <div className={`text-xs font-mono uppercase ${textColor}`}>{label}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{role}</div>
      <div className={`text-lg font-bold mt-2 ${textColor}`}>{formatCurrency(amount)}</div>
      <div className="text-[9px] font-mono text-slate-600 mt-1">{sub}</div>
    </div>
  );
};
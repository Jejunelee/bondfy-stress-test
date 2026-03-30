interface HeroCardProps {
    label: string;
    value: string;
    sub: string;
    color?: "blue" | "amber" | "teal" | "default";
  }
  
  export const HeroCard = ({ label, value, sub, color = "default" }: HeroCardProps) => {
    const colorClass =
      color === "blue"
        ? "text-blue-400"
        : color === "amber"
        ? "text-amber-400"
        : color === "teal"
        ? "text-teal-400"
        : "text-white";
        
    return (
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
        <div className="text-[10px] font-mono uppercase text-slate-500">{label}</div>
        <div className={`text-xl font-bold ${colorClass}`}>{value}</div>
        <div className="text-[10px] font-mono text-slate-500 mt-1">{sub}</div>
      </div>
    );
  };
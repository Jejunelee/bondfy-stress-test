import { ScenarioKey, SCENARIOS } from "../constants";

interface ScenarioButtonsProps {
  onSelect: (scenario: ScenarioKey) => void;
}

export const ScenarioButtons = ({ onSelect }: ScenarioButtonsProps) => {
  const scenarios: ScenarioKey[] = ["small", "mid", "large", "mega"];
  
  const getLabel = (scenario: ScenarioKey): string => {
    switch (scenario) {
      case "small": return "Small LGU";
      case "mid": return "Mid City";
      case "large": return "Large City";
      case "mega": return "Mega Deal";
    }
  };
  
  return (
    <div className="flex gap-2">
      {scenarios.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full border border-slate-700 hover:border-blue-500/50 hover:text-blue-400 transition-all"
        >
          {getLabel(s)}
        </button>
      ))}
    </div>
  );
};
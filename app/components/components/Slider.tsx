interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    display: string;
    onChange: (v: number) => void;
  }
  
  export const Slider = ({ label, value, min, max, step, display, onChange }: SliderProps) => {
    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2 text-slate-400">
          <span>{label}</span>
          <span className="font-mono text-amber-400">{display}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
        />
      </div>
    );
  };
import {
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    ReferenceLine,
  } from "recharts";
  import { formatCurrency } from "../utils/formatters";
  
  interface InvestorCashFlowChartProps {
    yearlyCashFlow: any[];
    investedAmount: number;
    selectedYear: number;
    onYearChange: (year: number) => void;
  }
  
  export const InvestorCashFlowChart = ({
    yearlyCashFlow,
    investedAmount,
    selectedYear,
    onYearChange,
  }: InvestorCashFlowChartProps) => {
    const maxYear = yearlyCashFlow.length;
    
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const data = yearlyCashFlow.find(d => d.year === label);
        return (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl">
            <p className="text-sm font-bold text-white mb-2">Year {label}</p>
            {data && data.couponPayment > 0 && (
              <p className="text-xs" style={{ color: "#10B981" }}>
                Coupon Payment: {formatCurrency(data.couponPayment)}
              </p>
            )}
            {data && data.principalPayment > 0 && (
              <p className="text-xs" style={{ color: "#F59E0B" }}>
                Principal Return: {formatCurrency(data.principalPayment)}
              </p>
            )}
            <p className="text-xs" style={{ color: "#A855F7" }}>
              Cumulative Return: {formatCurrency(data?.cumulativeReturn || 0)}
            </p>
            {data && data.remainingPrincipal > 0 && (
              <p className="text-xs text-slate-400">
                Principal at Risk: {formatCurrency(data.remainingPrincipal)}
              </p>
            )}
            {data && data.remainingPrincipal === 0 && data.principalPayment > 0 && (
              <p className="text-xs text-green-400 mt-1">
                ✓ Principal Fully Returned
              </p>
            )}
          </div>
        );
      }
      return null;
    };
    
    return (
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-green-500 rounded-full" /> Cash Flow & Cumulative Returns
          </h2>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Year:</span>
            <input
              type="range"
              min={1}
              max={maxYear}
              step={1}
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-mono text-green-400 w-12">{selectedYear}</span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={yearlyCashFlow}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="year" 
              stroke="#94A3B8"
              label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#94A3B8' }}
            />
            <YAxis 
              stroke="#94A3B8"
              tickFormatter={(value) => formatCurrency(value)}
              label={{ value: 'Amount (₱)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              formatter={(value) => <span className="text-slate-300">{value}</span>}
            />
            
            <Bar dataKey="couponPayment" name="Annual Coupon Payment" fill="#10B981" stackId="cashflow" />
            <Bar dataKey="principalPayment" name="Principal Return" fill="#F59E0B" stackId="cashflow" />
            <Line 
              type="monotone" 
              dataKey="cumulativeReturn" 
              name="Cumulative Return" 
              stroke="#A855F7" 
              strokeWidth={3}
              dot={{ r: 4, fill: "#A855F7" }}
            />
            
            <ReferenceLine 
              y={investedAmount} 
              stroke="#F59E0B" 
              strokeDasharray="5 5"
              label={{ value: 'Investment Amount', position: 'right', fill: '#F59E0B', fontSize: 10 }}
            />
            <ReferenceLine 
              x={selectedYear} 
              stroke="#10B981" 
              strokeDasharray="3 3"
              label={{ value: `Year ${selectedYear}`, position: 'top', fill: '#10B981', fontSize: 10 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="text-slate-400 mb-1">Break-even Analysis</div>
            <div className="text-green-400 font-mono">
              {yearlyCashFlow.find(d => d.cumulativeReturn >= investedAmount)?.year || "Not reached"} years
            </div>
            <div className="text-[10px] text-slate-500">to recover initial investment</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="text-slate-400 mb-1">Principal Return</div>
            <div className="text-amber-400 font-mono">
              {yearlyCashFlow.find(d => d.principalPayment > 0)?.year || "Not returned"} years
            </div>
            <div className="text-[10px] text-slate-500">at bond maturity</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="text-slate-400 mb-1">Income Stability</div>
            <div className="text-blue-400 font-mono">
              {yearlyCashFlow.filter(y => y.couponPayment > 0).length} years
            </div>
            <div className="text-[10px] text-slate-500">of regular payments</div>
          </div>
        </div>
      </div>
    );
  };
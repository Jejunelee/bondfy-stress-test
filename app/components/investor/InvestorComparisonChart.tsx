import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
  } from "recharts";
  import { formatCurrency, formatPercent } from "../utils/formatters";
  
  interface InvestorComparisonChartProps {
    metrics: any;
  }
  
  export const InvestorComparisonChart = ({ metrics }: InvestorComparisonChartProps) => {
    const comparisonData = [
      {
        name: "Your Investment",
        totalReturn: metrics.totalReturn,
        roi: metrics.roi,
        color: "#10B981",
      },
      {
        name: "Bank Deposit (4%)",
        totalReturn: metrics.investedAmount + metrics.bankDepositReturn,
        roi: (metrics.bankDepositReturn / metrics.investedAmount) * 100,
        color: "#3B82F6",
      },
      {
        name: "Bond Market Avg (6%)",
        totalReturn: metrics.investedAmount + metrics.bondMarketAvgReturn,
        roi: (metrics.bondMarketAvgReturn / metrics.investedAmount) * 100,
        color: "#A855F7",
      },
    ];
    
    const roiComparisonData = [
      {
        name: "Your Investment",
        value: metrics.roi,
        fill: "#10B981",
      },
      {
        name: "Bank Deposit",
        value: (metrics.bankDepositReturn / metrics.investedAmount) * 100,
        fill: "#3B82F6",
      },
      {
        name: "Bond Market Avg",
        value: (metrics.bondMarketAvgReturn / metrics.investedAmount) * 100,
        fill: "#A855F7",
      },
    ];
    
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl">
            <p className="text-sm font-bold text-white mb-2">{label}</p>
            <p className="text-xs" style={{ color: payload[0].color }}>
              Total Return: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              ROI: {formatPercent(payload[0].payload.roi, 2)}
            </p>
          </div>
        );
      }
      return null;
    };
    
    const RoiTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl">
            <p className="text-sm font-bold text-white mb-2">{label}</p>
            <p className="text-xs" style={{ color: payload[0].fill }}>
              ROI: {formatPercent(payload[0].value, 2)}
            </p>
          </div>
        );
      }
      return null;
    };
    
    return (
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-blue-500 rounded-full" /> Investment Comparison
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Total Return Comparison */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Total Return Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis 
                  stroke="#94A3B8"
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalReturn" name="Total Return">
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* ROI Comparison */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">ROI Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={roiComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis 
                  stroke="#94A3B8"
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <Tooltip content={<RoiTooltip />} />
                <Bar dataKey="value" name="ROI">
                  {roiComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Premium vs Bank</div>
              <div className={`text-lg font-bold ${metrics.premiumVsBank >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.premiumVsBank >= 0 ? '+' : ''}{formatPercent(metrics.premiumVsBank, 1)}
              </div>
              <div className="text-[9px] text-slate-500">higher return than savings</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Risk-Adjusted Return</div>
              <div className="text-lg font-bold text-purple-400">{formatPercent(metrics.riskAdjustedReturn, 2)}</div>
              <div className="text-[9px] text-slate-500">return per year to break-even</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Break-Even Timeline</div>
              <div className="text-lg font-bold text-amber-400">
                {metrics.breakEvenYear > 0 ? `${metrics.breakEvenYear} years` : 'Not reached'}
              </div>
              <div className="text-[9px] text-slate-500">to recover principal</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
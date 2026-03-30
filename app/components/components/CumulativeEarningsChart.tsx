import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
  } from "recharts";
  import { formatCurrency } from "../utils/formatters";
  
  interface CumulativeDataPoint {
    year: number;
    AYN: number;
    TrusteeBank: number;
    BondfyNet: number;
    Total: number;
  }
  
  interface CumulativeEarningsChartProps {
    bond: number;
    tenor: number;
    maRate: number;
    bondfyShareOfMA: number;
    couponRate: number;
    cashoutVolumePct: number;
    secondaryVolumePct: number;
    secondarySaleFee: number;
    nRefs: number;
    trancheMode: "split" | "close" | "retainer";
    referralMetrics: any;
    coreMetrics: any;
    selectedYear: number;
  }
  
  export const CumulativeEarningsChart = ({
    bond,
    tenor,
    maRate,
    bondfyShareOfMA,
    couponRate,
    cashoutVolumePct,
    secondaryVolumePct,
    secondarySaleFee,
    nRefs,
    trancheMode,
    referralMetrics,
    coreMetrics,
    selectedYear,
  }: CumulativeEarningsChartProps) => {
    // Calculate cumulative earnings data
    const calculateCumulativeData = (): CumulativeDataPoint[] => {
      const data: CumulativeDataPoint[] = [];
      const maxYear = Math.min(tenor, 15);
      
      let cumulativeAYN = 0;
      let cumulativeTrustee = 0;
      let cumulativeBondfyNet = 0;
      
      // Calculate one-time fees
      const oneTimeAYN = bond * maRate - (bond * bondfyShareOfMA);
      const oneTimeBondfy = (bond * bondfyShareOfMA) + (bond * 0.005);
      
      for (let year = 1; year <= maxYear; year++) {
        // AYN: One-time in year 1
        if (year === 1) {
          cumulativeAYN += oneTimeAYN;
        }
        
        // Trustee Bank: 50bps per year
        cumulativeTrustee += bond * 0.005;
        
        // Bondfy calculations
        const recurringAnnual = (bond * couponRate * 0.2) + 
                                 (bond * cashoutVolumePct * 0.0025) + 
                                 (bond * secondaryVolumePct * secondarySaleFee);
        
        let bondfyBaseAnnual = recurringAnnual;
        if (year === 1) {
          bondfyBaseAnnual += oneTimeBondfy;
        }
        
        // Referral distribution
        let referralAnnual = 0;
        switch (trancheMode) {
          case "split":
            if (year === 1) referralAnnual = referralMetrics.totalRefFees;
            break;
          case "close":
            if (year === tenor) referralAnnual = referralMetrics.totalRefFees;
            break;
          case "retainer":
            if (year <= 2) referralAnnual = 40000 * 12;
            else if (year === tenor) referralAnnual = Math.max(0, referralMetrics.totalRefFees - 960000);
            break;
        }
        
        const bondfyNetAnnual = bondfyBaseAnnual - referralAnnual;
        cumulativeBondfyNet += bondfyNetAnnual;
        
        data.push({
          year,
          AYN: cumulativeAYN,
          TrusteeBank: cumulativeTrustee,
          BondfyNet: cumulativeBondfyNet,
          Total: cumulativeAYN + cumulativeTrustee + cumulativeBondfyNet,
        });
      }
      
      return data;
    };
    
    const cumulativeData = calculateCumulativeData();
    const selectedData = cumulativeData.find(d => d.year === selectedYear);
    
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
        return (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl">
            <p className="text-sm font-bold text-white mb-2">Year {label} (Cumulative)</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs" style={{ color: entry.color }}>
                {entry.name}: {formatCurrency(entry.value)}
              </p>
            ))}
            <div className="border-t border-slate-700 mt-2 pt-2">
              <p className="text-xs font-bold text-white">
                Total Market: {formatCurrency(total)}
              </p>
            </div>
          </div>
        );
      }
      return null;
    };
    
    return (
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 mt-6">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-indigo-500 rounded-full" /> Cumulative Earnings Over Time (Stacked)
        </h2>
        
        {selectedData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">AYN Total</div>
              <div className="text-sm font-bold text-teal-400">{formatCurrency(selectedData.AYN)}</div>
              <div className="text-[9px] text-slate-500">{((selectedData.AYN / selectedData.Total) * 100).toFixed(1)}% of total</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Trustee Bank Total</div>
              <div className="text-sm font-bold text-amber-400">{formatCurrency(selectedData.TrusteeBank)}</div>
              <div className="text-[9px] text-slate-500">{((selectedData.TrusteeBank / selectedData.Total) * 100).toFixed(1)}% of total</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-purple-500/30 bg-purple-500/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Bondfy Net Total</div>
              <div className="text-sm font-bold text-purple-400">{formatCurrency(selectedData.BondfyNet)}</div>
              <div className="text-[9px] text-slate-500">{((selectedData.BondfyNet / selectedData.Total) * 100).toFixed(1)}% of total</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-blue-500/30 bg-blue-500/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Market</div>
              <div className="text-sm font-bold text-blue-400">{formatCurrency(selectedData.Total)}</div>
              <div className="text-[9px] text-slate-500">all parties combined</div>
            </div>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height={450}>
          <AreaChart
            data={cumulativeData}
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
              label={{ value: '', angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              formatter={(value) => <span className="text-slate-300">{value}</span>}
            />
            
            {/* Stacked Areas - all three parties stacked together */}
            <Area 
              type="monotone" 
              dataKey="AYN" 
              name="AYN Resources" 
              stackId="1"
              fill="#14B8A6" 
              stroke="#14B8A6"
              fillOpacity={0.7}
            />
            <Area 
              type="monotone" 
              dataKey="TrusteeBank" 
              name="Trustee Bank" 
              stackId="1"
              fill="#F59E0B" 
              stroke="#F59E0B"
              fillOpacity={0.7}
            />
            <Area 
              type="monotone" 
              dataKey="BondfyNet" 
              name="Bondfy Net" 
              stackId="1"
              fill="#A855F7" 
              stroke="#A855F7"
              fillOpacity={0.8}
            />
            
            <ReferenceLine 
              x={selectedYear} 
              stroke="#A855F7" 
              strokeDasharray="3 3"
              label={{ value: `Year ${selectedYear}`, position: 'top', fill: '#A855F7', fontSize: 10 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Legend explanation with percentages */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-500 rounded"></div>
              <span>AYN Resources: MA Fee - Bondfy Share</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span>Trustee Bank: Estimated 50bps annual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Bondfy Net: All revenue after referrals</span>
            </div>
          </div>
          <div className="mt-3 text-center text-[10px] text-slate-600">
            <p>Stacked area chart showing cumulative earnings distribution across all parties. The total height represents the combined market value.</p>
          </div>
        </div>
      </div>
    );
  };
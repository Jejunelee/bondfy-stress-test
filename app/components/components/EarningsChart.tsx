import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart,
    ReferenceLine,
  } from "recharts";
  import { formatCurrency } from "../utils/formatters";
  
  interface EarningsDataPoint {
    year: number;
    AYN: number;
    TrusteeBank: number;
    BondfyBase: number;
    ReferralFees: number;
    BondfyNet: number;
  }
  
  interface EarningsChartProps {
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
    onYearChange: (year: number) => void;
  }
  
  export const EarningsChart = ({
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
    onYearChange,
  }: EarningsChartProps) => {
    // Calculate yearly earnings data
    const calculateYearlyData = (): EarningsDataPoint[] => {
      const data: EarningsDataPoint[] = [];
      const maxYear = Math.min(tenor, 15); // Limit to 15 years for readability
      
      for (let year = 1; year <= maxYear; year++) {
        // AYN: MA Fee net of Bondfy (one-time, but amortized)
        const aynTotal = bond * maRate - (bond * bondfyShareOfMA);
        const aynAnnual = aynTotal / tenor;
        
        // Trustee Bank: Estimated 50bps per year
        const trusteeAnnual = bond * 0.005;
        
        // Bondfy Base Revenue (before referral)
        let bondfyBaseAnnual = 0;
        
        if (year === 1) {
          // Year 1 includes one-time fees
          const oneTime = (bond * bondfyShareOfMA) + (bond * 0.005); // AYN share + distribution fee
          const recurring = calculateRecurringAnnual(year);
          bondfyBaseAnnual = oneTime + recurring;
        } else {
          bondfyBaseAnnual = calculateRecurringAnnual(year);
        }
        
        // Calculate referral fees distribution
        const referralAnnual = calculateReferralDistribution(year, referralMetrics.totalRefFees);
        
        // Bondfy Net = Base - Referral Fees
        const bondfyNetAnnual = bondfyBaseAnnual - referralAnnual;
        
        data.push({
          year,
          AYN: aynAnnual,
          TrusteeBank: trusteeAnnual,
          BondfyBase: bondfyBaseAnnual,
          ReferralFees: referralAnnual,
          BondfyNet: bondfyNetAnnual,
        });
      }
      
      return data;
    };
    
    const calculateRecurringAnnual = (year: number): number => {
      const annualCouponMgmt = bond * couponRate * 0.2; // 20% of coupons
      const annualCashout = bond * cashoutVolumePct * 0.0025;
      const annualSecondary = bond * secondaryVolumePct * secondarySaleFee;
      
      return annualCouponMgmt + annualCashout + annualSecondary;
    };
    
    const calculateReferralDistribution = (year: number, totalReferralFees: number): number => {
      switch (trancheMode) {
        case "split":
          // 50% on signing (year 1), 50% on close (year 1 or last year?)
          if (year === 1) {
            return totalReferralFees; // Both fees in year 1 for simplicity
          }
          return 0;
          
        case "close":
          // 100% on close (end of tenor)
          if (year === tenor) {
            return totalReferralFees;
          }
          return 0;
          
        case "retainer":
          // Retainer paid over 24 months (2 years), remainder on close
          if (year <= 2) {
            return 40000 * 12; // Annual retainer amount
          } else if (year === tenor) {
            return Math.max(0, totalReferralFees - 960000); // Subtract 2 years retainer
          }
          return 0;
          
        default:
          return 0;
      }
    };
    
    const yearlyData = calculateYearlyData();
    
    // Find selected year data point
    const selectedData = yearlyData.find(d => d.year === selectedYear);
    
    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl">
            <p className="text-sm font-bold text-white mb-2">Year {label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs" style={{ color: entry.color }}>
                {entry.name}: {formatCurrency(entry.value)}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };
    
    return (
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-purple-500 rounded-full" /> Earnings by Party (Including Referrals)
          </h2>
          
          {/* Year Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Year:</span>
            <input
              type="range"
              min={1}
              max={Math.min(tenor, 15)}
              step={1}
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-mono text-purple-400 w-12">{selectedYear}</span>
          </div>
        </div>
        
        {/* Summary Cards for Selected Year */}
        {selectedData && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">AYN Resources</div>
              <div className="text-sm font-bold text-teal-400">{formatCurrency(selectedData.AYN)}</div>
              <div className="text-[9px] text-slate-500">MA fee net</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Trustee Bank</div>
              <div className="text-sm font-bold text-amber-400">{formatCurrency(selectedData.TrusteeBank)}</div>
              <div className="text-[9px] text-slate-500">50bps/yr est.</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Bondfy Gross</div>
              <div className="text-sm font-bold text-green-400">{formatCurrency(selectedData.BondfyBase)}</div>
              <div className="text-[9px] text-slate-500">before referrals</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Referral Fees</div>
              <div className="text-sm font-bold text-orange-400">{formatCurrency(selectedData.ReferralFees)}</div>
              <div className="text-[9px] text-slate-500">{nRefs} deals</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center border border-purple-500/30 bg-purple-500/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Bondfy Net</div>
              <div className="text-sm font-bold text-purple-400">{formatCurrency(selectedData.BondfyNet)}</div>
              <div className="text-[9px] text-slate-500">after referrals</div>
            </div>
          </div>
        )}
        
        {/* Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={yearlyData}
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
            
            {/* Bars for parties */}
            <Bar dataKey="AYN" name="AYN Resources" fill="#14B8A6" stackId="parties" />
            <Bar dataKey="TrusteeBank" name="Trustee Bank" fill="#F59E0B" stackId="parties" />
            <Bar dataKey="BondfyBase" name="Bondfy Gross" fill="#10B981" />
            
            {/* Lines for referral and net */}
            <Line 
              type="monotone" 
              dataKey="ReferralFees" 
              name="Referral Fees" 
              stroke="#F97316" 
              strokeWidth={2}
              dot={{ r: 4, fill: "#F97316" }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="BondfyNet" 
              name="Bondfy Net (After Referrals)" 
              stroke="#A855F7" 
              strokeWidth={3}
              dot={{ r: 5, fill: "#A855F7" }}
              activeDot={{ r: 7 }}
            />
            
            <ReferenceLine 
              x={selectedYear} 
              stroke="#A855F7" 
              strokeDasharray="3 3"
              label={{ value: `Year ${selectedYear}`, position: 'top', fill: '#A855F7', fontSize: 10 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Legend explanation */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-500 rounded"></div>
              <span>AYN: MA Fee - Bondfy Share</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span>Trustee Bank: Estimated 50bps annual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span>Bondfy Gross: All revenue streams</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Referral Fees: Paid to referral partners</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Bondfy Net: Gross - Referral Fees</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
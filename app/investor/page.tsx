"use client";

import { useState } from "react";
import Link from "next/link";
import { InvestorPanel } from "../components/investor/InvestorPanel";
import { InvestorMetricsCards } from "../components/investor/InvestorMetricsCards";
import { InvestorCashFlowChart } from "../components/investor/InvestorCashFlowChart";

import { useInvestorMetrics } from "../components/hooks/useInvestorMetrics";
import { useBondContext } from "../contexts/BondContext";
import { formatCurrency, formatPercent } from "../components/utils/formatters";

export default function InvestorPage() {
  // Get bond parameters from shared context
  const { bondSize, tenor, couponRate } = useBondContext();
  
  // Investment parameters (adjustable by investor)
  const [investedAmount, setInvestedAmount] = useState(1_000_000);
  const [yearsInvested, setYearsInvested] = useState(Math.min(7, tenor));
  const [selectedYear, setSelectedYear] = useState(1);
  
  // Update yearsInvested if tenor changes and it exceeds new tenor
  if (yearsInvested > tenor) {
    setYearsInvested(tenor);
  }
  
  const metrics = useInvestorMetrics(
    investedAmount,
    yearsInvested,
    bondSize,
    tenor,
    couponRate
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Investor Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">LGU Bond Investment Analysis</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/"
              className="px-4 py-2 text-sm font-mono rounded-full border border-slate-700 hover:border-blue-500/70 hover:text-blue-400 transition-all"
            >
              ← Back to Main
            </Link>
            <div className="text-right">
              <div className="text-xs text-slate-500">Current Bond</div>
              <div className="text-sm font-mono text-green-400">
                {formatCurrency(bondSize)} @ {formatPercent(couponRate * 100, 2)} | {tenor} yrs
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-1 space-y-6">
            <InvestorPanel
              investedAmount={investedAmount}
              yearsInvested={yearsInvested}
              bondSize={bondSize}
              tenor={tenor}
              couponRate={couponRate}
              onInvestedAmountChange={setInvestedAmount}
              onYearsInvestedChange={setYearsInvested}
            />
            
            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-green-950/30 to-slate-900/40 border border-green-500/20 rounded-2xl p-5">
              <h3 className="text-xs font-mono uppercase text-green-400 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ownership</span>
                  <span className="font-mono text-green-400">
                    {((investedAmount / bondSize) * 100).toFixed(4)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Yield</span>
                  <span className="font-mono text-green-400">
                    {formatPercent(metrics.annualCouponIncome / investedAmount * 100, 2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Income</span>
                  <span className="font-mono text-green-400">
                    {formatCurrency(metrics.annualCouponIncome / 12)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel: Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Metrics Cards */}
            <InvestorMetricsCards metrics={metrics} />
            
            {/* Cash Flow Chart */}
            <InvestorCashFlowChart
              yearlyCashFlow={metrics.yearlyCashFlow}
              investedAmount={investedAmount}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
    
            
 
                </div>
              </div>
            </div>
          </div>
  );
}
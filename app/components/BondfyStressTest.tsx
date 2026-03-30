"use client";

import { useState, useMemo } from "react";
import { ScenarioButtons } from "./components/ScenarioButtons";
import { DealParametersPanel } from "./DealParametersPanel";
import { RevenueStreamsPanel } from "./components/RevenueStreamsPanel";
import { ReferralPanel } from "./components/ReferralPanel";
import { HeroCard } from "./components/HeroCard";
import { RevenueStreamsDisplay } from "./components/RevenueStreamsDisplay";
import { LifecycleChart } from "./LifeCycleChart";
import { PartyEarnings } from "./components/PartyEarnings";
import { SecondaryMarketSummary } from "./components/SecondaryMarketSummary";
import { useCoreMetrics } from "./hooks/useCoreMetrics";
import { useReferralMetrics } from "./hooks/useReferralMetrics";
import { formatCurrency, formatPercent } from "./utils/formatters";
import { SCENARIOS, ScenarioKey } from "./constants";
import { TrancheMode, LifecycleYear } from "./types";

export default function BondfyStressTest() {
  // Core parameters
  const [bond, setBond] = useState(400_000_000);
  const [tenor, setTenor] = useState(7);
  const [maRate, setMaRate] = useState(0.03);
  const [bondfyShareOfMA, setBondfyShareOfMA] = useState(0.01);
  const [couponRate, setCouponRate] = useState(0.06);
  const [cashoutVolumePct, setCashoutVolumePct] = useState(0.10);
  const [secondaryVolumePct, setSecondaryVolumePct] = useState(0.15);
  const [secondarySaleFee, setSecondarySaleFee] = useState(0.0025);

  // Referral state
  const [nRefs, setNRefs] = useState(3);
  const [trancheMode, setTrancheMode] = useState<TrancheMode>("split");

  // Core Calculations
  const coreMetrics = useCoreMetrics({
    bond,
    tenor,
    maRate,
    bondfyShareOfMA,
    couponRate,
    cashoutVolumePct,
    secondaryVolumePct,
    secondarySaleFee,
  });

  // Referral Calculations
  const referralMetrics = useReferralMetrics(bond, nRefs, trancheMode, coreMetrics.grandTotal);

  // Lifecycle Data
  const lifecycleData = useMemo(() => {
    const years: LifecycleYear[] = [];
    for (let y = 1; y <= Math.min(tenor, 15); y++) {
      const amount = y === 1 ? coreMetrics.year1Total : coreMetrics.annualRecurring;
      years.push({ year: y, amount });
    }
    if (tenor > 15) {
      const remainingYears = tenor - 15;
      const remainingTotal = coreMetrics.annualRecurring * remainingYears;
      years.push({ year: "13–" + tenor, amount: remainingTotal, isBulk: true });
    }
    return years;
  }, [tenor, coreMetrics]);

  // Scenario handler
  const setScenario = (scenario: ScenarioKey) => {
    const p = SCENARIOS[scenario];
    setBond(p.bond);
    setTenor(p.tenor);
    setMaRate(p.maRate);
    setBondfyShareOfMA(p.bondfyShareOfMA);
    setCouponRate(p.couponRate);
    setCashoutVolumePct(p.cashoutVolumePct);
    setSecondaryVolumePct(p.secondaryVolumePct);
    setSecondarySaleFee(p.secondarySaleFee);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              BONDFY
            </h1>
            <p className="text-slate-400 text-sm mt-1">LGU Bond Revenue Stress Test</p>
          </div>
          <ScenarioButtons onSelect={setScenario} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-1 space-y-6">
            <DealParametersPanel
              bond={bond}
              tenor={tenor}
              maRate={maRate}
              bondfyShareOfMA={bondfyShareOfMA}
              onBondChange={setBond}
              onTenorChange={setTenor}
              onMaRateChange={setMaRate}
              onBondfyShareChange={setBondfyShareOfMA}
              coreMetrics={coreMetrics}
            />
            
            <RevenueStreamsPanel
              couponRate={couponRate}
              cashoutVolumePct={cashoutVolumePct}
              secondaryVolumePct={secondaryVolumePct}
              secondarySaleFee={secondarySaleFee}
              onCouponRateChange={setCouponRate}
              onCashoutVolumeChange={setCashoutVolumePct}
              onSecondaryVolumeChange={setSecondaryVolumePct}
              onSecondarySaleFeeChange={setSecondarySaleFee}
            />
            
            <ReferralPanel
              nRefs={nRefs}
              trancheMode={trancheMode}
              bond={bond}
              grandTotal={coreMetrics.grandTotal}
              onNRefsChange={setNRefs}
              onTrancheModeChange={setTrancheMode}
              referralMetrics={referralMetrics}
            />
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HeroCard label="Bond Size" value={formatCurrency(coreMetrics.bond)} sub={`${coreMetrics.tenor}-year tenor`} />
              <HeroCard label="Year 1 Revenue" value={formatCurrency(coreMetrics.year1Total)} sub="deal + first year" color="blue" />
              <HeroCard label="Full Tenor Total" value={formatCurrency(coreMetrics.grandTotal)} sub={`over ${coreMetrics.tenor} years`} color="amber" />
              <HeroCard label="Bondfy Take Rate" value={formatPercent(coreMetrics.takeRate * 100, 3)} sub="% of bond value" color="teal" />
            </div>

            {/* Revenue Streams Display */}
            <RevenueStreamsDisplay
              bondfyMA={coreMetrics.bondfyMA}
              distFee={coreMetrics.distFee}
              totalCouponMgmt={coreMetrics.totalCouponMgmt}
              annualCouponMgmt={coreMetrics.annualCouponMgmt}
              totalCashout={coreMetrics.totalCashout}
              cashoutVolumePct={coreMetrics.cashoutVolumePct}
              totalSecondaryRevenue={coreMetrics.totalSecondaryRevenue}
              secondaryVolumePct={coreMetrics.secondaryVolumePct}
              secondarySaleFee={coreMetrics.secondarySaleFee}
              grandTotal={coreMetrics.grandTotal}
              tenor={coreMetrics.tenor}
              bondfyShareOfMA={coreMetrics.bondfyShareOfMA}
            />

            {/* Year-by-Year */}
            <LifecycleChart lifecycleData={lifecycleData} />

            {/* Party Earnings */}
            <PartyEarnings
              lguNet={coreMetrics.lguNet}
              aynKeeps={coreMetrics.aynKeeps}
              bankEst={coreMetrics.bankEst}
              grandTotal={coreMetrics.grandTotal}
              maRate={coreMetrics.maRate}
              tenor={coreMetrics.tenor}
            />

            {/* Secondary Market Summary */}
            <SecondaryMarketSummary
              secondaryVolumePct={coreMetrics.secondaryVolumePct}
              annualSecondaryVolume={coreMetrics.annualSecondaryVolume}
              annualSecondaryRevenue={coreMetrics.annualSecondaryRevenue}
              totalSecondaryRevenue={coreMetrics.totalSecondaryRevenue}
              secondarySaleFee={coreMetrics.secondarySaleFee}
              tenor={coreMetrics.tenor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
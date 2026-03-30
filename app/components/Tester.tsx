"use client"

import { useState, useMemo } from "react"

// --- Constants ---
const RETAIL_PCT = 0.0025 // 0.25% of bond
const DIST_PCT = 0.005 // 0.5% of bond
const COUPON_MGMT = 0.2 // 20% of coupon payments
const CASHOUT_BPS = 0.0025 // 25 bps cashout fee
const SECONDARY_SALE_FEE = 0.0025 // 0.25% secondary sale fee

// --- Types ---
type TrancheMode = "split" | "close" | "retainer"

// --- Helpers ---
const formatCurrency = (n: number): string => {
  if (n >= 1e9) return `₱${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `₱${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `₱${(n / 1e3).toFixed(0)}K`
  return `₱${Math.round(n)}`
}

const formatPercent = (n: number, decimals = 1): string =>
  `${n.toFixed(decimals)}%`

const getReferralTier = (bond: number): { rate: number; label: string; pct: string } => {
  if (bond <= 250_000_000) return { rate: 0.001, label: "₱0–250M", pct: "0.1%" }
  if (bond <= 500_000_000) return { rate: 0.002, label: "₱250M–500M", pct: "0.2%" }
  if (bond <= 750_000_000) return { rate: 0.003, label: "₱500M–750M", pct: "0.3%" }
  return { rate: 0.004, label: "₱750M+", pct: "0.4%" }
}

// --- Main Component ---
export default function BondfyStressTest() {
  // Core parameters
  const [bond, setBond] = useState(400_000_000)
  const [tenor, setTenor] = useState(7)
  const [maRate, setMaRate] = useState(0.03)
  const [bondfyShareOfMA, setBondfyShareOfMA] = useState(0.01)
  const [couponRate, setCouponRate] = useState(0.06)
  const [cashoutVolumePct, setCashoutVolumePct] = useState(0.10)
  
  // NEW: Secondary Market parameters
  const [secondaryVolumePct, setSecondaryVolumePct] = useState(0.15) // 15% of total bond traded annually
  const [secondarySaleFee, setSecondarySaleFee] = useState(0.0025) // 0.25% fee (adjustable)

  // Referral state
  const [nRefs, setNRefs] = useState(3)
  const [trancheMode, setTrancheMode] = useState<TrancheMode>("split")

  // --- Core Calculations ---
  const coreMetrics = useMemo(() => {
    const maTotalFee = bond * maRate
    const bondfyMA = bond * bondfyShareOfMA
    const aynKeeps = maTotalFee - bondfyMA

    const distFee = bond * DIST_PCT
    const retailTranche = bond * RETAIL_PCT

    const annualCoupons = bond * couponRate
    const annualCouponMgmt = annualCoupons * COUPON_MGMT

    // Cashout based on total bond value
    const annualCashoutVol = bond * cashoutVolumePct
    const annualCashout = annualCashoutVol * CASHOUT_BPS

    // NEW: Secondary market calculations
    const annualSecondaryVolume = bond * secondaryVolumePct
    const annualSecondaryRevenue = annualSecondaryVolume * secondarySaleFee
    const totalSecondaryRevenue = annualSecondaryRevenue * tenor

    const annualRecurring = annualCouponMgmt + annualCashout + annualSecondaryRevenue
    const oneTime = bondfyMA + distFee

    const year1Total = oneTime + annualRecurring
    const grandTotal = oneTime + annualRecurring * tenor
    const takeRate = grandTotal / bond

    // Party earnings
    const lguNet = bond - maTotalFee
    const bankEst = bond * 0.005 * tenor

    // Stream breakdowns
    const totalCouponMgmt = annualCouponMgmt * tenor
    const totalCashout = annualCashout * tenor

    return {
      bond,
      tenor,
      maRate,
      bondfyShareOfMA,
      couponRate,
      cashoutVolumePct,
      secondaryVolumePct,
      secondarySaleFee,
      maTotalFee,
      bondfyMA,
      aynKeeps,
      distFee,
      retailTranche,
      annualCoupons,
      annualCouponMgmt,
      annualCashout,
      annualCashoutVol,
      annualSecondaryVolume, // Added this
      annualSecondaryRevenue,
      totalSecondaryRevenue,
      annualRecurring,
      oneTime,
      year1Total,
      grandTotal,
      takeRate,
      lguNet,
      bankEst,
      totalCouponMgmt,
      totalCashout,
    }
  }, [bond, tenor, maRate, bondfyShareOfMA, couponRate, cashoutVolumePct, secondaryVolumePct, secondarySaleFee])

  // --- Referral Calculations ---
  const referralMetrics = useMemo(() => {
    const tier = getReferralTier(bond)
    const refFeePerDeal = bond * tier.rate
    const totalRefFees = refFeePerDeal * nRefs

    let signAmount = 0
    let closeAmount = 0
    let retainerTotal = 0

    switch (trancheMode) {
      case "split":
        signAmount = refFeePerDeal * 0.5
        closeAmount = refFeePerDeal * 0.5
        break
      case "close":
        closeAmount = refFeePerDeal
        break
      case "retainer":
        retainerTotal = 40000 * 24
        closeAmount = Math.max(0, refFeePerDeal - retainerTotal)
        break
    }

    const bondfyNet = coreMetrics.grandTotal - totalRefFees

    const closeRate = nRefs <= 3 ? 0.9 : nRefs <= 6 ? 0.8 : nRefs <= 10 ? 0.7 : 0.6
    const closedDeals = Math.round(nRefs * closeRate)

    return {
      tier,
      refFeePerDeal,
      totalRefFees,
      signAmount,
      closeAmount,
      retainerTotal,
      bondfyNet,
      closedDeals,
      closeRate,
    }
  }, [bond, nRefs, trancheMode, coreMetrics.grandTotal])

  // --- Lifecycle Data (year-by-year) ---
  const lifecycleData = useMemo(() => {
    const years = []
    for (let y = 1; y <= Math.min(tenor, 15); y++) {
      const amount = y === 1 ? coreMetrics.year1Total : coreMetrics.annualRecurring
      years.push({ year: y, amount })
    }
    if (tenor > 15) {
      const remainingYears = tenor - 15
      const remainingTotal = coreMetrics.annualRecurring * remainingYears
      years.push({ year: "13–" + tenor, amount: remainingTotal, isBulk: true })
    }
    return years
  }, [tenor, coreMetrics])

  // --- UI Helpers ---
  const setScenario = (scenario: "small" | "mid" | "large" | "mega") => {
    const presets = {
      small: { 
        bond: 100_000_000, tenor: 5, maRate: 0.02, bondfyShareOfMA: 0.01, 
        couponRate: 0.055, cashoutVolumePct: 0.05, secondaryVolumePct: 0.10, 
        secondarySaleFee: 0.0025 
      },
      mid: { 
        bond: 400_000_000, tenor: 7, maRate: 0.03, bondfyShareOfMA: 0.01, 
        couponRate: 0.06, cashoutVolumePct: 0.10, secondaryVolumePct: 0.15, 
        secondarySaleFee: 0.0025 
      },
      large: { 
        bond: 800_000_000, tenor: 10, maRate: 0.025, bondfyShareOfMA: 0.01, 
        couponRate: 0.065, cashoutVolumePct: 0.15, secondaryVolumePct: 0.20, 
        secondarySaleFee: 0.0025 
      },
      mega: { 
        bond: 2_000_000_000, tenor: 15, maRate: 0.02, bondfyShareOfMA: 0.01, 
        couponRate: 0.07, cashoutVolumePct: 0.20, secondaryVolumePct: 0.25, 
        secondarySaleFee: 0.0025 
      },
    }
    const p = presets[scenario]
    setBond(p.bond)
    setTenor(p.tenor)
    setMaRate(p.maRate)
    setBondfyShareOfMA(p.bondfyShareOfMA)
    setCouponRate(p.couponRate)
    setCashoutVolumePct(p.cashoutVolumePct)
    setSecondaryVolumePct(p.secondaryVolumePct)
    setSecondarySaleFee(p.secondarySaleFee)
  }

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
          <div className="flex gap-2">
            {(["small", "mid", "large", "mega"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full border border-slate-700 hover:border-blue-500/50 hover:text-blue-400 transition-all"
              >
                {s === "small" && "Small LGU"}
                {s === "mid" && "Mid City"}
                {s === "large" && "Large City"}
                {s === "mega" && "Mega Deal"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-500 rounded-full" /> Deal Parameters
              </h2>

              <Slider
                label="Bond Size"
                value={bond}
                min={50_000_000}
                max={2_000_000_000}
                step={10_000_000}
                display={formatCurrency(bond)}
                onChange={setBond}
              />

              <Slider
                label="Tenor"
                value={tenor}
                min={3}
                max={15}
                step={1}
                display={`${tenor} years`}
                onChange={setTenor}
              />

              <div className="h-px bg-slate-800 my-4" />

              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-teal-500 rounded-full" /> AYN Resources
              </h2>

              <Slider
                label="MA Fee Rate"
                value={maRate * 100}
                min={1}
                max={5}
                step={0.1}
                display={formatPercent(maRate * 100, 1)}
                onChange={(v) => setMaRate(v / 100)}
              />

              <Slider
                label="Bondfy Share of MA"
                value={bondfyShareOfMA * 100}
                min={0.5}
                max={3}
                step={0.1}
                display={formatPercent(bondfyShareOfMA * 100, 1)}
                onChange={(v) => setBondfyShareOfMA(v / 100)}
              />

              <div className="bg-slate-800/50 rounded-lg p-3 mt-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Total MA Fee</span>
                  <span className="font-mono text-teal-400">{formatCurrency(coreMetrics.maTotalFee)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Bondfy receives</span>
                  <span className="font-mono text-blue-400">{formatCurrency(coreMetrics.bondfyMA)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>AYN keeps</span>
                  <span className="font-mono text-amber-400">{formatCurrency(coreMetrics.aynKeeps)}</span>
                </div>
              </div>

              <div className="h-px bg-slate-800 my-4" />

              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-full" /> Revenue Streams
              </h2>

              <Slider
                label="Coupon Rate"
                value={couponRate * 100}
                min={3}
                max={12}
                step={0.25}
                display={formatPercent(couponRate * 100, 2)}
                onChange={(v) => setCouponRate(v / 100)}
              />

              <Slider
                label="Annual Cashout Volume"
                value={cashoutVolumePct * 100}
                min={0.5}
                max={30}
                step={0.5}
                display={formatPercent(cashoutVolumePct * 100, 1)}
                onChange={(v) => setCashoutVolumePct(v / 100)}
              />
              <div className="text-[10px] text-slate-500 -mt-2 mb-2 font-mono">
                % of total bond value cashed out annually
              </div>

              {/* NEW: Secondary Market Controls */}
              <div className="mt-4 pt-2 border-t border-slate-800">
                <div className="text-xs font-mono text-cyan-400 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span>
                  Secondary Market
                </div>
                
                <Slider
                  label="Secondary Market Volume"
                  value={secondaryVolumePct * 100}
                  min={0}
                  max={50}
                  step={1}
                  display={formatPercent(secondaryVolumePct * 100, 0)}
                  onChange={(v) => setSecondaryVolumePct(v / 100)}
                />
                <div className="text-[10px] text-slate-500 -mt-2 mb-3 font-mono">
                  % of total bond value traded annually on secondary market
                </div>

                <Slider
                  label="Secondary Sale Fee"
                  value={secondarySaleFee * 100}
                  min={0.1}
                  max={1}
                  step={0.05}
                  display={formatPercent(secondarySaleFee * 100, 2)}
                  onChange={(v) => setSecondarySaleFee(v / 100)}
                />
                <div className="text-[10px] text-slate-500 -mt-2 mb-2 font-mono">
                  Fee charged on secondary market trades
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 mt-3 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Retail tranche</span>
                  <span className="font-mono">0.25% of bond</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Distribution fee</span>
                  <span className="font-mono">0.5% of bond</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Coupon mgmt fee</span>
                  <span className="font-mono">20% of coupons</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Cashout fee</span>
                  <span className="font-mono">25 bps</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Secondary sale fee</span>
                  <span className="font-mono">{formatPercent(secondarySaleFee * 100, 2)}</span>
                </div>
              </div>
            </div>

            {/* Referral Section */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-orange-500 rounded-full" /> Referral Fee Calculator
              </h2>

              {/* Tier Cards */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {[
                  { label: "₱0–250M", rate: "0.1%" },
                  { label: "₱250M–500M", rate: "0.2%" },
                  { label: "₱500M–750M", rate: "0.3%" },
                  { label: "₱750M+", rate: "0.4%" },
                ].map((tier, idx) => {
                  const isActive = referralMetrics.tier.label === tier.label
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl p-2 text-center transition-all ${
                        isActive
                          ? "bg-orange-500/20 border border-orange-500/50 shadow-lg"
                          : "bg-slate-800/30 border border-slate-700"
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-400 uppercase">{tier.label}</div>
                      <div className={`text-lg font-bold ${isActive ? "text-orange-400" : "text-slate-200"}`}>
                        {tier.rate}
                      </div>
                    </div>
                  )
                })}
              </div>

              <Slider
                label="Number of deals referred"
                value={nRefs}
                min={1}
                max={20}
                step={1}
                display={`${nRefs} deal${nRefs !== 1 ? "s" : ""}`}
                onChange={setNRefs}
              />

              <div className="flex gap-2 mt-4 mb-5">
                {(["split", "close", "retainer"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTrancheMode(mode)}
                    className={`flex-1 text-xs font-mono py-2 rounded-full border transition-all ${
                      trancheMode === mode
                        ? "bg-orange-500/20 border-orange-500 text-orange-300"
                        : "border-slate-700 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {mode === "split" && "50/50 Split"}
                    {mode === "close" && "100% on Close"}
                    {mode === "retainer" && "Retainer + Close"}
                  </button>
                ))}
              </div>

              {/* Referral Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800/40 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Fee per deal</div>
                  <div className="text-lg font-bold text-amber-400">{formatCurrency(referralMetrics.refFeePerDeal)}</div>
                  <div className="text-[10px] text-slate-500">{referralMetrics.tier.pct} of bond</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Total Referral</div>
                  <div className="text-lg font-bold text-blue-400">{formatCurrency(referralMetrics.totalRefFees)}</div>
                  <div className="text-[10px] text-slate-500">for {nRefs} deals</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-3 text-center col-span-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Bondfy Net (after referral)</div>
                  <div className="text-xl font-bold text-blue-400">{formatCurrency(referralMetrics.bondfyNet)}</div>
                  <div className="text-[10px] text-slate-500">full tenor · {tenor} years</div>
                </div>
              </div>

              {/* Payout breakdown */}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-2">Payout Structure</div>
                {trancheMode === "split" && (
                  <div className="space-y-2">
                    <PayoutBar label="On signing (50%)" amount={referralMetrics.signAmount * nRefs} color="teal" />
                    <PayoutBar label="On close (50%)" amount={referralMetrics.closeAmount * nRefs} color="orange" />
                  </div>
                )}
                {trancheMode === "close" && (
                  <PayoutBar label="On close (100%)" amount={referralMetrics.closeAmount * nRefs} color="orange" />
                )}
                {trancheMode === "retainer" && (
                  <div className="space-y-2">
                    <PayoutBar label="Retainer (24 mo)" amount={40000 * 24} color="amber" />
                    <PayoutBar
                      label="On close"
                      amount={referralMetrics.closeAmount * nRefs}
                      color="orange"
                    />
                  </div>
                )}
              </div>
            </div>
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

            {/* Revenue Streams */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-full" /> Revenue Streams — Bondfy Only (Full Tenor)
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <StreamCard
                  label="AYN Rev Share"
                  value={coreMetrics.bondfyMA}
                  total={coreMetrics.grandTotal}
                  sub={`${formatPercent(coreMetrics.bondfyShareOfMA * 100, 1)} of bond · one-time`}
                  color="teal"
                  tag="fixed"
                />
                <StreamCard
                  label="Distribution Fee"
                  value={coreMetrics.distFee}
                  total={coreMetrics.grandTotal}
                  sub="0.5% of bond · one-time"
                  color="amber"
                  tag="fixed"
                />
                <StreamCard
                  label="Coupon Mgmt"
                  value={coreMetrics.totalCouponMgmt}
                  total={coreMetrics.grandTotal}
                  sub={`${formatCurrency(coreMetrics.annualCouponMgmt)}/yr × ${coreMetrics.tenor} yrs`}
                  color="purple"
                  tag="recurring"
                />
                <StreamCard
                  label="Cashout Fees"
                  value={coreMetrics.totalCashout}
                  total={coreMetrics.grandTotal}
                  sub={`${formatPercent(coreMetrics.cashoutVolumePct * 100, 1)} of bond cashed out/yr × ${coreMetrics.tenor} yrs`}
                  color="green"
                  tag="recurring"
                />
                {/* NEW: Secondary Market Revenue Stream */}
                <StreamCard
                  label="Secondary Market"
                  value={coreMetrics.totalSecondaryRevenue}
                  total={coreMetrics.grandTotal}
                  sub={`${formatPercent(coreMetrics.secondaryVolumePct * 100, 0)} of bond traded/yr @ ${formatPercent(coreMetrics.secondarySaleFee * 100, 2)} fee × ${coreMetrics.tenor} yrs`}
                  color="cyan"
                  tag="recurring"
                />
              </div>
            </div>

            {/* Year-by-Year */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-teal-500 rounded-full" /> Year-by-Year Revenue Projection
              </h2>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
                {lifecycleData.map((item, idx) => {
                  const isYear1 = item.year === 1
                  const color = isYear1 ? "blue" : item.year === 2 ? "teal" : "green"
                  const maxAmount = lifecycleData[0]?.amount || 1
                  const width = Math.max(3, (item.amount / maxAmount) * 100)
                  return (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-20 font-mono text-slate-400 text-xs">
                        {typeof item.year === "number" ? `Year ${item.year}` : item.year}
                      </div>
                      <div className="flex-1 h-7 bg-slate-800 rounded overflow-hidden">
                        <div
                          className={`h-full flex items-center px-2 text-xs font-mono text-white ${
                            color === "blue" && "bg-blue-600"
                          } ${color === "teal" && "bg-teal-600"} ${color === "green" && "bg-green-600"}`}
                          style={{ width: `${width}%` }}
                        >
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                      <div className="w-24 text-right font-mono text-xs text-slate-300">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Party Earnings */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-500 rounded-full" /> Full Deal — Earnings by Party
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PartyCard label="LGU" role="Net proceeds" amount={coreMetrics.lguNet} sub="after MA fee" />
                <PartyCard label="AYN Resources" role="MA fee net of Bondfy" amount={coreMetrics.aynKeeps} sub={`${formatPercent(coreMetrics.maRate * 100, 1)}% MA fee`} color="teal" />
                <PartyCard label="Trustee Bank" role="Est. trust spread" amount={coreMetrics.bankEst} sub="50bps/yr est." color="amber" />
                <PartyCard label="Bondfy" role="All 5 streams" amount={coreMetrics.grandTotal} sub={`${coreMetrics.tenor}-yr total`} color="blue" />
              </div>
            </div>

            {/* NEW: Secondary Market Summary Card */}
            <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900/40 backdrop-blur-sm border border-cyan-800/30 rounded-2xl p-5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-cyan-500 rounded-full" /> Secondary Market Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Volume</div>
                  <div className="text-lg font-bold text-cyan-400">{formatPercent(coreMetrics.secondaryVolumePct * 100, 0)}</div>
                  <div className="text-[10px] text-slate-500">of total bond</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Trades</div>
                  <div className="text-lg font-bold text-cyan-400">{formatCurrency(coreMetrics.annualSecondaryVolume)}</div>
                  <div className="text-[10px] text-slate-500">per year</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Revenue</div>
                  <div className="text-lg font-bold text-cyan-400">{formatCurrency(coreMetrics.annualSecondaryRevenue)}</div>
                  <div className="text-[10px] text-slate-500">@ {formatPercent(coreMetrics.secondarySaleFee * 100, 2)} fee</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Total Tenor Revenue</div>
                  <div className="text-lg font-bold text-cyan-400">{formatCurrency(coreMetrics.totalSecondaryRevenue)}</div>
                  <div className="text-[10px] text-slate-500">over {coreMetrics.tenor} years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Subcomponents ---

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}) {
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
  )
}

function HeroCard({
  label,
  value,
  sub,
  color = "default",
}: {
  label: string
  value: string
  sub: string
  color?: "blue" | "amber" | "teal" | "default"
}) {
  const colorClass =
    color === "blue"
      ? "text-blue-400"
      : color === "amber"
      ? "text-amber-400"
      : color === "teal"
      ? "text-teal-400"
      : "text-white"
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
      <div className="text-[10px] font-mono uppercase text-slate-500">{label}</div>
      <div className={`text-xl font-bold ${colorClass}`}>{value}</div>
      <div className="text-[10px] font-mono text-slate-500 mt-1">{sub}</div>
    </div>
  )
}

function StreamCard({
  label,
  value,
  total,
  sub,
  color,
  tag,
}: {
  label: string
  value: number
  total: number
  sub: string
  color: "teal" | "amber" | "purple" | "green" | "cyan"
  tag: "fixed" | "recurring"
}) {
  const colorMap = {
    teal: "border-teal-500/30 bg-teal-500/5",
    amber: "border-amber-500/30 bg-amber-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
    green: "border-green-500/30 bg-green-500/5",
    cyan: "border-cyan-500/30 bg-cyan-500/5",
  }
  const textColor = {
    teal: "text-teal-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
    green: "text-green-400",
    cyan: "text-cyan-400",
  }
  const percentage = total > 0 ? (value / total) * 100 : 0
  return (
    <div className={`rounded-xl p-4 border ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${tag === "fixed" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`}>
          {tag === "fixed" ? "fixed" : "recurring"}
        </span>
      </div>
      <div className={`text-xl font-bold ${textColor[color]}`}>{formatCurrency(value)}</div>
      <div className="text-[10px] font-mono text-slate-500 mt-1">{sub}</div>
      <div className="mt-3 h-1 bg-slate-700 rounded overflow-hidden">
        <div className={`h-full ${color === "teal" && "bg-teal-500"} ${color === "amber" && "bg-amber-500"} ${color === "purple" && "bg-purple-500"} ${color === "green" && "bg-green-500"} ${color === "cyan" && "bg-cyan-500"}`} style={{ width: `${Math.max(4, percentage)}%` }} />
      </div>
      <div className="text-right text-[10px] text-slate-500 mt-1">{formatPercent(percentage, 1)} of total</div>
    </div>
  )
}

function PartyCard({
  label,
  role,
  amount,
  sub,
  color = "default",
}: {
  label: string
  role: string
  amount: number
  sub: string
  color?: "teal" | "amber" | "blue" | "default"
}) {
  const textColor =
    color === "teal"
      ? "text-teal-400"
      : color === "amber"
      ? "text-amber-400"
      : color === "blue"
      ? "text-blue-400"
      : "text-white"
  return (
    <div className="bg-slate-800/30 rounded-xl p-4 text-center border border-slate-700">
      <div className={`text-xs font-mono uppercase ${textColor}`}>{label}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{role}</div>
      <div className={`text-lg font-bold mt-2 ${textColor}`}>{formatCurrency(amount)}</div>
      <div className="text-[9px] font-mono text-slate-600 mt-1">{sub}</div>
    </div>
  )
}

function PayoutBar({ label, amount, color }: { label: string; amount: number; color: "teal" | "orange" | "amber" }) {
  const bgColor = color === "teal" ? "bg-teal-500" : color === "orange" ? "bg-orange-500" : "bg-amber-500"
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-24 text-slate-400">{label}</div>
      <div className="flex-1 h-6 bg-slate-800 rounded overflow-hidden">
        <div className={`h-full flex items-center px-2 text-white font-mono ${bgColor}`} style={{ width: "100%" }}>
          {formatCurrency(amount)}
        </div>
      </div>
      <div className="w-20 text-right font-mono text-slate-300">{formatCurrency(amount)}</div>
    </div>
  )
}
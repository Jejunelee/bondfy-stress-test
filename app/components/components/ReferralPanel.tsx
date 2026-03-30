import { useState } from "react";
import { Slider } from "./Slider";
import { PayoutBar } from "./PayoutBar";
import { formatCurrency } from "../utils/formatters";
import { TrancheMode } from "../types";
import { TIERS } from "../constants";

interface ReferralPanelProps {
  nRefs: number;
  trancheMode: TrancheMode;
  bond: number;
  grandTotal: number;
  onNRefsChange: (v: number) => void;
  onTrancheModeChange: (mode: TrancheMode) => void;
  referralMetrics: any;
}

export const ReferralPanel = ({
  nRefs,
  trancheMode,
  bond,
  grandTotal,
  onNRefsChange,
  onTrancheModeChange,
  referralMetrics,
}: ReferralPanelProps) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-orange-500 rounded-full" /> Partner's Share Calculator
      </h2>

      {/* Tier Cards */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {TIERS.map((tier, idx) => {
          const isActive = referralMetrics.tier.label === tier.label;
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
                {tier.pct}
              </div>
            </div>
          );
        })}
      </div>

      <Slider
        label="Number of deals referred"
        value={nRefs}
        min={1}
        max={20}
        step={1}
        display={`${nRefs} deal${nRefs !== 1 ? "s" : ""}`}
        onChange={onNRefsChange}
      />

      <div className="flex gap-2 mt-4 mb-5">
        {(["split", "close", "retainer"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onTrancheModeChange(mode)}
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
          <div className="text-[10px] font-mono text-slate-400 uppercase">Total Share Revenue</div>
          <div className="text-lg font-bold text-blue-400">{formatCurrency(referralMetrics.totalRefFees)}</div>
          <div className="text-[10px] text-slate-500">for {nRefs} deals</div>
        </div>
        <div className="bg-slate-800/40 rounded-xl p-3 text-center col-span-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Bondfy Net (after partner share)</div>
          <div className="text-xl font-bold text-blue-400">{formatCurrency(referralMetrics.bondfyNet)}</div>
          <div className="text-[10px] text-slate-500">full tenor · {grandTotal} years</div>
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
            <PayoutBar label="On close" amount={referralMetrics.closeAmount * nRefs} color="orange" />
          </div>
        )}
      </div>
    </div>
  );
};
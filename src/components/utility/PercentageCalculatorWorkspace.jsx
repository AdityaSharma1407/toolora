"use client";

import React, { useState } from "react";
import {
  calculateWhatIsPercentOf,
  calculatePercentIsWhatOf,
  calculatePercentageChange,
  calculateAddSubtractPercent,
} from "@/tools/utility/percentageCalculator.js";
import {
  Percent,
  Calculator,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Tag,
} from "lucide-react";

export default function PercentageCalculatorWorkspace() {
  // Mode 1: What is X% of Y?
  const [m1Percent, setM1Percent] = useState("15");
  const [m1Total, setM1Total] = useState("200");

  // Mode 2: X is what % of Y?
  const [m2Val, setM2Val] = useState("35");
  const [m2Total, setM2Total] = useState("140");

  // Mode 3: Percentage increase/decrease from X to Y
  const [m3From, setM3From] = useState("50");
  const [m3To, setM3To] = useState("75");

  // Mode 4: Add / Subtract X% from Y (Tax / Discount)
  const [m4Base, setM4Base] = useState("100");
  const [m4Percent, setM4Percent] = useState("18");
  const [m4Op, setM4Op] = useState("add");

  const r1 = calculateWhatIsPercentOf(m1Percent, m1Total);
  const r2 = calculatePercentIsWhatOf(m2Val, m2Total);
  const r3 = calculatePercentageChange(m3From, m3To);
  const r4 = calculateAddSubtractPercent(m4Base, m4Percent, m4Op);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Card 1: What is X% of Y? */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Percent className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">What is X% of Y?</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">What is</span>
            <input
              type="number"
              value={m1Percent}
              onChange={(e) => setM1Percent(e.target.value)}
              className="w-24 p-2.5 rounded-xl border border-black/[0.08] text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="15"
            />
            <span className="text-xs text-slate-500">% of</span>
            <input
              type="number"
              value={m1Total}
              onChange={(e) => setM1Total(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-black/[0.08] text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="200"
            />
            <span className="text-xs text-slate-500">?</span>
          </div>

          {r1 && (
            <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-700 font-medium">Result:</span>
                <p className="text-2xl font-bold text-brand-900 tracking-tight">{r1.result}</p>
                <p className="text-[11px] text-brand-600 font-mono mt-0.5">{r1.formula}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: X is what % of Y? */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calculator className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">X is what % of Y?</h3>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={m2Val}
              onChange={(e) => setM2Val(e.target.value)}
              className="w-24 p-2.5 rounded-xl border border-black/[0.08] text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="35"
            />
            <span className="text-xs text-slate-500">is what % of</span>
            <input
              type="number"
              value={m2Total}
              onChange={(e) => setM2Total(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-black/[0.08] text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="140"
            />
            <span className="text-xs text-slate-500">?</span>
          </div>

          {r2 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Percentage:</span>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{r2.result}%</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{r2.formula}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Percentage Increase / Decrease */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Percentage Change (From &rarr; To)</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">From</span>
            <input
              type="number"
              value={m3From}
              onChange={(e) => setM3From(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-black/[0.08] text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="50"
            />
            <span className="text-xs text-slate-500">to</span>
            <input
              type="number"
              value={m3To}
              onChange={(e) => setM3To(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-black/[0.08] text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="75"
            />
          </div>

          {r3 && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                r3.type === "increase"
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-rose-50 text-rose-900 border-rose-200"
              }`}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {r3.type === "increase" ? "Increase (+)" : "Decrease (-)"}
                </span>
                <p className="text-2xl font-bold tracking-tight">
                  {r3.type === "increase" ? "+" : "-"}{r3.percent}%
                </p>
                <p className="text-[11px] font-mono mt-0.5 opacity-80">{r3.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Tax / Tip / Discount (Add or Subtract %) */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Add or Subtract % (Tax / Discount)</h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setM4Op("add")}
                className={`px-2 py-0.5 rounded ${m4Op === "add" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                + Add (Tax/Tip)
              </button>
              <button
                type="button"
                onClick={() => setM4Op("subtract")}
                className={`px-2 py-0.5 rounded ${m4Op === "subtract" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                - Subtract (Discount)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Base</span>
            <input
              type="number"
              value={m4Base}
              onChange={(e) => setM4Base(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-black/[0.08] text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="100"
            />
            <span className="text-xs text-slate-500">{m4Op === "add" ? "+" : "-"}</span>
            <input
              type="number"
              value={m4Percent}
              onChange={(e) => setM4Percent(e.target.value)}
              className="w-24 p-2.5 rounded-xl border border-black/[0.08] text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="18"
            />
            <span className="text-xs text-slate-500">%</span>
          </div>

          {r4 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Final Value:</span>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{r4.result}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{r4.formula}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

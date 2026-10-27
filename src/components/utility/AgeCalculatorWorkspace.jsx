"use client";

import React, { useState } from "react";
import { calculateAge } from "@/tools/utility/ageCalculator.js";
import {
  Calendar,
  Gift,
  Clock,
  Sparkles,
  Compass,
  Hourglass,
  Sun,
} from "lucide-react";

export default function AgeCalculatorWorkspace() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [birthDate, setBirthDate] = useState("1998-07-15");
  const [targetDate, setTargetDate] = useState(todayStr);

  const res = calculateAge(birthDate, targetDate);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Date Input Card */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <Calendar className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Select Birth Date & Comparison Date
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Date of Birth:
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={targetDate}
              className="w-full p-3 rounded-xl border border-black/[0.08] text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Age as of Date (Default Today):
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-black/[0.08] text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Main Results Display */}
      {res && !res.error && (
        <div className="space-y-5">
          {/* Primary Age Banner */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-6 sm:p-8 text-center space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Exact Age
            </span>
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                  {res.years}
                </span>
                <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Years
                </span>
              </div>
              <span className="text-2xl sm:text-4xl font-light text-slate-300">&bull;</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                  {res.months}
                </span>
                <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Months
                </span>
              </div>
              <span className="text-2xl sm:text-4xl font-light text-slate-300">&bull;</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                  {res.days}
                </span>
                <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Days
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Next Birthday */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Next Birthday
                </span>
                <Gift className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {res.nextBirthday.daysRemaining} days left
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Falls on a <strong>{res.nextBirthday.dayOfWeek}</strong> ({res.nextBirthday.date})
                </p>
              </div>
            </div>

            {/* Day Born & Zodiac */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Birth Day & Zodiac
                </span>
                <Sun className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {res.zodiac.sign} {res.zodiac.emoji}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Born on a <strong>{res.dayBorn}</strong>
                </p>
              </div>
            </div>

            {/* Total Life Stats */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 flex flex-col justify-between sm:col-span-2 md:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Lived
                </span>
                <Hourglass className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <p><strong>{res.totalDays.toLocaleString()}</strong> total days</p>
                <p><strong>{res.totalWeeks.toLocaleString()}</strong> weeks and {res.remainingDaysInWeek} days</p>
                <p><strong>{res.totalHours.toLocaleString()}</strong> hours</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {res && res.error && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs text-center font-medium">
          {res.error}
        </div>
      )}
    </div>
  );
}

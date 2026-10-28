"use client";

import React, { useState, useMemo } from "react";
import {
  parseCron,
  explainCron,
  getNextExecutions,
  CRON_PRESETS,
} from "@/tools/utility/cronParser.js";
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function CronGeneratorWorkspace() {
  const [cronExpression, setCronExpression] = useState("0 9 * * 1-5");
  const [copied, setCopied] = useState(false);

  const parseResult = useMemo(() => parseCron(cronExpression), [cronExpression]);
  const explanation = useMemo(() => explainCron(cronExpression), [cronExpression]);
  const nextRuns = useMemo(
    () => (parseResult.valid ? getNextExecutions(cronExpression, 5) : []),
    [cronExpression, parseResult.valid]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateField = (index, value) => {
    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length === 5) {
      parts[index] = value || "*";
      setCronExpression(parts.join(" "));
    }
  };

  const fields = parseResult.valid && parseResult.parts.length === 5
    ? parseResult.parts
    : ["*", "*", "*", "*", "*"];

  return (
    <div className="w-full space-y-6">
      {/* Preset Pills */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Quick Presets</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CRON_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setCronExpression(preset.cron)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-medium transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Cron Display & Explanation Box */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" />
            <h2 className="text-xs sm:text-sm font-semibold text-slate-800">
              Cron Expression
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCronExpression("* * * * *")}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-3 bg-slate-50 border border-black/[0.08] rounded-2xl p-3 sm:p-4">
          <input
            type="text"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="* * * * *"
            spellCheck={false}
            className="flex-1 bg-transparent font-mono text-base sm:text-xl font-bold tracking-wider text-slate-900 outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Explanation Banner */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            parseResult.valid
              ? "bg-brand-50/60 border-brand-200/60 text-brand-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {parseResult.valid ? (
            <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Human-Readable Schedule
            </div>
            <div className="text-sm sm:text-base font-medium">{explanation}</div>
          </div>
        </div>

        {/* 5 Field Visual Tuner */}
        {parseResult.valid && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-slate-700">Visual Field Editor:</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Minute", range: "0 - 59", val: fields[0], idx: 0 },
                { label: "Hour", range: "0 - 23", val: fields[1], idx: 1 },
                { label: "Day (Month)", range: "1 - 31", val: fields[2], idx: 2 },
                { label: "Month", range: "1 - 12", val: fields[3], idx: 3 },
                { label: "Weekday", range: "0 - 6 (Sun-Sat)", val: fields[4], idx: 4 },
              ].map((f) => (
                <div
                  key={f.label}
                  className="bg-slate-50/80 rounded-xl border border-black/[0.06] p-3 text-center space-y-1.5"
                >
                  <div className="text-xs font-semibold text-slate-700">{f.label}</div>
                  <input
                    type="text"
                    value={f.val}
                    onChange={(e) => updateField(f.idx, e.target.value)}
                    className="w-full text-center font-mono font-bold text-sm bg-white border border-slate-200 rounded-lg py-1 text-slate-900 outline-none focus:border-brand-500"
                  />
                  <div className="text-[10px] text-slate-400 font-mono">{f.range}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Execution Times */}
      {parseResult.valid && nextRuns.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
              Next 5 Scheduled Executions
            </h3>
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-black/[0.06] overflow-hidden">
            {nextRuns.map((date, idx) => (
              <div
                key={idx}
                className="p-3.5 flex items-center justify-between text-xs sm:text-sm font-mono hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-medium">
                    {date.toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>UTC {date.toISOString().slice(11, 16)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Clock } from "lucide-react";

export default function ComingSoonBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
      title="This tool is currently in development and will be available in an upcoming update."
    >
      <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
      <span>Coming Soon</span>
    </span>
  );
}

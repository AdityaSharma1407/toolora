import React from "react";
import { Loader2 } from "lucide-react";

export default function PrimaryButton({
  children,
  variant = "primary", // primary | secondary | outline | danger | ghost
  size = "md", // sm | md | lg
  loading = false,
  disabled = false,
  icon: Icon = null,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

  const sizeStyles = {
    sm: "min-h-[36px] px-3.5 py-1.5 text-xs gap-1.5",
    md: "min-h-[44px] px-4.5 py-2.5 text-sm gap-2",
    lg: "min-h-[48px] px-6 py-3 text-base gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-subtle border border-transparent",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200/60",
    outline:
      "bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100 border border-slate-300/80 shadow-2xs",
    danger:
      "bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 border border-red-200/80",
    ghost:
      "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-200/60",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

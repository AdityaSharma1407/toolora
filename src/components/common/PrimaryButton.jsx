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
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm border border-transparent",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200",
    outline:
      "bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-300 shadow-2xs",
    danger:
      "bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 border border-red-200",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200",
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

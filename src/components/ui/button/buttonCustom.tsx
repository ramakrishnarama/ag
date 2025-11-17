import React, { ReactNode } from "react";

type Variant = "primary" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  startIcon,
  endIcon,
  ...rest
}: ButtonProps) {
  const base = "inline-flex items-center gap-2 rounded-md font-medium transition";
  const variantCls =
    variant === "primary"
      ? "bg-green-600 hover:bg-green-500 text-white"
      : "bg-transparent border border-slate-600 text-white hover:bg-slate-800";
  const sizeCls = size === "sm" ? "px-3 py-1 text-sm" : size === "lg" ? "px-5 py-3" : "px-4 py-2";
  return (
    <button className={`${base} ${variantCls} ${sizeCls} ${className}`} {...rest}>
      {startIcon && <span>{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span>{endIcon}</span>}
    </button>
  );
}

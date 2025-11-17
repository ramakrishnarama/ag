import React, { ReactNode } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`rounded-xl bg-slate-800 border border-slate-700 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export function CardContent({ className = "", children }: CardContentProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

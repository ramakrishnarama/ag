"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card/Card";

interface KPIProps {
  title: string;
  value: string | number;
  onClick?: () => void;
  colorClass?: string;
}

export default function KPI({ title, value, onClick, colorClass = "text-white" }: KPIProps) {
  return (
    <Card
      className="cursor-pointer hover:scale-105 transition-transform"
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <CardContent className="text-center">
        <div className="text-sm text-gray-300">{title}</div>
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

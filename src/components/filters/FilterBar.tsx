"use client";
import React from "react";
// import { parseISO } from "date-fns";

interface FilterBarProps {
  startDate: string;
  endDate: string;
  salespersonId: number | null;
  salespeople: { id: number; name: string }[];
  onChange: (payload: { startDate: string; endDate: string; salespersonId: number | null }) => void;
}

export default function FilterBar({ startDate, endDate, salespersonId, salespeople, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center">
      <div className="flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange({ startDate: e.target.value, endDate, salespersonId })}
          className="px-3 py-2 rounded bg-[#0b1220] border border-slate-700"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange({ startDate, endDate: e.target.value, salespersonId })}
          className="px-3 py-2 rounded bg-[#0b1220] border border-slate-700"
        />
      </div>

      <select
        value={String(salespersonId ?? "")}
        onChange={(e) => onChange({ startDate, endDate, salespersonId: e.target.value ? Number(e.target.value) : null })}
        className="px-3 py-2 rounded bg-[#0b1220] border border-slate-700"
      >
        <option value="">All Salespersons</option>
        {salespeople.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}

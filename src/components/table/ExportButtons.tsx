"use client";

import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

interface ExportButtonsProps {
  data: unknown[];                    // ← Accept unknown[]
  filename?: string;
}

export default function ExportButtons({
  data,
  filename = "export",
}: ExportButtonsProps) {
  
  /* Convert unknown[] → object[] safely */
const safeData: Record<string, unknown>[] = Array.isArray(data)
  ? data.map((row) =>
      typeof row === "object" && row !== null
        ? (row as Record<string, unknown>)
        : ({} as Record<string, unknown>)
    )
  : [];



  /* ---------------------------
     EXPORT EXCEL
  ---------------------------- */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(safeData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  /* ---------------------------
     EXPORT CSV
  ---------------------------- */
  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(safeData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  /* ---------------------------
     EXPORT PDF
  ---------------------------- */
  const exportPDF = () => {
    if (safeData.length === 0) return;

    const doc = new jsPDF();

    const columns = Object.keys(safeData[0]);
    const rows: RowInput[] = safeData.map((row) =>
      columns.map((c) => String(row[c] ?? ""))
    );

    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 40, 40] },
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportExcel}
        className="px-3 py-1 bg-green-600 rounded text-white"
      >
        Excel
      </button>

      <button
        onClick={exportCSV}
        className="px-3 py-1 bg-blue-600 rounded text-white"
      >
        CSV
      </button>

      <button
        onClick={exportPDF}
        className="px-3 py-1 bg-slate-700 rounded text-white"
      >
        PDF
      </button>
    </div>
  );
}

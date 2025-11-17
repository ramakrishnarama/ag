"use client";

import React, { useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import ExportButtons from "./ExportButtons";

/*  
   ⭐ Generic row interface:
   - Accepts unknown key/value pairs  
   - Does NOT use ANY  
*/
export interface BaseRow {
  id: number;
  [key: string]: unknown;
}

interface DataTableProps<T extends BaseRow> {
  columns: TableColumn<T>[];
  data: T[];
  title?: string;
}

export default function MyDataTable<T extends BaseRow>({
  columns,
  data,
  title,
}: DataTableProps<T>) {
  const [perPage, setPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  /* SEARCH FILTER (Type-safe using unknown → string conversion) */
  const filtered = useMemo(() => {
    if (!filterText) return data;

    const query = filterText.toLowerCase();

    return data.filter((row) => {
      const rowString = JSON.stringify(row, (_, value) =>
        typeof value === "string" || typeof value === "number" ? value : ""
      ).toLowerCase();
      return rowString.includes(query);
    });
  }, [data, filterText]);

  return (
    <div>
      {/* SEARCH + PAGE SIZE + EXPORT BUTTONS */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <input
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="px-3 py-2 rounded bg-[#0b1220] border border-slate-700 text-white"
          />

          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="px-2 py-1 rounded bg-[#0b1220] border border-slate-700 text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <ExportButtons
          data={filtered as unknown[]}
          filename={title ?? "export"}
        />
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={filtered}
        pagination
        paginationPerPage={perPage}
        highlightOnHover
        dense
        persistTableHead
      />
    </div>
  );
}

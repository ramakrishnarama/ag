"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import MyDataTable from "@/components/table/DataTable";
import { Card, CardContent } from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import { TableColumn } from "react-data-table-component";

/* -----------------------------------------
   UNIVERSAL SAFE ROW TYPE (must include id)
------------------------------------------ */
type AnyRow = {
  id: number;
  [key: string]: string | number | undefined;
};

/* -----------------------------------------
   PAGE TYPES
------------------------------------------ */

type TableType =
  | "salespersons"
  | "visited"
  | "orders-taken"
  | "orders-executed"
  | "collection"
  | "follow-ups";

/* -----------------------------------------
   PAGE COMPONENT
------------------------------------------ */

export default function DataTablePage({ params }: { params: { type: TableType } }) {
  const searchParams = useSearchParams();
  const filterId = searchParams?.get("id") ? Number(searchParams.get("id")) : null;
  const type = params.type;

  const SAMPLE_NAMES = ["Rahul Sharma", "Anita Verma", "John Doe", "Sneha Nair", "Vikas Mehta", "Isha Rao"];
  const salesPeople = SAMPLE_NAMES.map((n, i) => ({ id: i + 1, name: n }));

  /* -----------------------------------------
     ROW GENERATOR (returns AnyRow[])
  ------------------------------------------ */

  const rows = useMemo<AnyRow[]>(() => {
    switch (type) {
      case "salespersons":
        return salesPeople.map<AnyRow>((s) => ({
          id: s.id,
          name: s.name,
          totalVisits: Math.floor(Math.random() * 60),
          ordersTaken: Math.floor(Math.random() * 40),
          ordersExecuted: Math.floor(Math.random() * 30),
          markets: Math.floor(Math.random() * 8),
          collection: Math.floor(Math.random() * 150000),
          followups: Math.floor(Math.random() * 12),
        }));

      case "visited": {
        const list: AnyRow[] = [];
        for (let i = 1; i <= 120; i++) {
          const sp = salesPeople[(i - 1) % salesPeople.length];
          list.push({
            id: i,
            date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
            salesperson: sp.name,
            clientName: `Client ${i}`,
            duration: `${Math.floor(Math.random() * 4)}h ${Math.floor(Math.random() * 60)}m`,
            market: `Market ${Math.floor(Math.random() * 6) + 1}`,
          });
        }
        return filterId
          ? list.filter((r) => r.salesperson === salesPeople.find((x) => x.id === filterId)?.name)
          : list;
      }

      case "orders-taken": {
        const list: AnyRow[] = [];
        for (let i = 1; i <= 120; i++) {
          const sp = salesPeople[(i - 1) % salesPeople.length];
          list.push({
            id: i,
            date: new Date(Date.now() - i * 3600000).toISOString().slice(0, 10),
            salesperson: sp.name,
            client: `Client ${i}`,
            amount: Math.floor(Math.random() * 100000),
            status: Math.random() > 0.5 ? "Pending" : "Confirmed",
          });
        }
        return filterId
          ? list.filter((r) => r.salesperson === salesPeople.find((x) => x.id === filterId)?.name)
          : list;
      }

      case "orders-executed": {
        const list: AnyRow[] = [];
        for (let i = 1; i <= 80; i++) {
          const sp = salesPeople[(i - 1) % salesPeople.length];
          list.push({
            id: i,
            date: new Date(Date.now() - i * 3600000).toISOString().slice(0, 10),
            salesperson: sp.name,
            client: `Client ${i}`,
            amount: Math.floor(Math.random() * 100000),
            execStatus: Math.random() > 0.5 ? "Done" : "Failed",
          });
        }
        return filterId
          ? list.filter((r) => r.salesperson === salesPeople.find((x) => x.id === filterId)?.name)
          : list;
      }

      case "collection": {
        const list: AnyRow[] = [];
        for (let i = 1; i <= 90; i++) {
          const sp = salesPeople[(i - 1) % salesPeople.length];
          list.push({
            id: i,
            date: new Date(Date.now() - i * 3600000).toISOString().slice(0, 10),
            salesperson: sp.name,
            client: `Client ${i}`,
            amount: Math.floor(Math.random() * 150000),
            mode: Math.random() > 0.5 ? "Cash" : "Online",
            reference: `REF${Math.floor(Math.random() * 90000) + 10000}`,
          });
        }
        return filterId
          ? list.filter((r) => r.salesperson === salesPeople.find((x) => x.id === filterId)?.name)
          : list;
      }

      case "follow-ups": {
        const list: AnyRow[] = [];
        for (let i = 1; i <= 80; i++) {
          const sp = salesPeople[(i - 1) % salesPeople.length];
          list.push({
            id: i,
            date: new Date(Date.now() - i * 3600000).toISOString().slice(0, 10),
            salesperson: sp.name,
            client: `Client ${i}`,
            status: Math.random() > 0.5 ? "Open" : "Closed",
            nextFollowup: new Date(Date.now() + Math.floor(Math.random() * 10) * 86400000)
              .toISOString()
              .slice(0, 10),
          });
        }
        return filterId
          ? list.filter((r) => r.salesperson === salesPeople.find((x) => x.id === filterId)?.name)
          : list;
      }

      default:
        return [];
    }
  }, [type, filterId, salesPeople]);

  /* -----------------------------------------
     COLUMNS (TABLECOLUMN<AnyRow>)
  ------------------------------------------ */

  const columns = useMemo<TableColumn<AnyRow>[]>(() => {
    switch (type) {
      case "salespersons":
        return [
          { name: "ID", selector: (r) => r.id },
          { name: "Name", selector: (r) => r.name as string },
          { name: "Total Visits", selector: (r) => r.totalVisits as number },
          { name: "Orders Taken", selector: (r) => r.ordersTaken as number },
          { name: "Orders Executed", selector: (r) => r.ordersExecuted as number },
          { name: "Markets", selector: (r) => r.markets as number },
          {
            name: "Collection",
            selector: (r) => `₹${Math.round(Number(r.collection) / 1000)}k`,
          },
        ];

      case "visited":
        return [
          { name: "Visit ID", selector: (r) => r.id },
          { name: "Date", selector: (r) => r.date as string },
          { name: "Salesperson", selector: (r) => r.salesperson as string },
          { name: "Client Name", selector: (r) => r.clientName as string },
          { name: "Duration", selector: (r) => r.duration as string },
          { name: "Market", selector: (r) => r.market as string },
        ];

      case "orders-taken":
        return [
          { name: "Order ID", selector: (r) => r.id },
          { name: "Date", selector: (r) => r.date as string },
          { name: "Salesperson", selector: (r) => r.salesperson as string },
          { name: "Client", selector: (r) => r.client as string },
          { name: "Amount", selector: (r) => `₹${Math.round(Number(r.amount) / 1000)}k` },
          { name: "Status", selector: (r) => r.status as string },
        ];

      case "orders-executed":
        return [
          { name: "Exec ID", selector: (r) => r.id },
          { name: "Date", selector: (r) => r.date as string },
          { name: "Salesperson", selector: (r) => r.salesperson as string },
          { name: "Client", selector: (r) => r.client as string },
          { name: "Amount", selector: (r) => `₹${Math.round(Number(r.amount) / 1000)}k` },
          { name: "Status", selector: (r) => r.execStatus as string },
        ];

      case "collection":
        return [
          { name: "Receipt ID", selector: (r) => r.id },
          { name: "Date", selector: (r) => r.date as string },
          { name: "Salesperson", selector: (r) => r.salesperson as string },
          { name: "Client", selector: (r) => r.client as string },
          { name: "Amount", selector: (r) => `₹${Math.round(Number(r.amount) / 1000)}k` },
          { name: "Mode", selector: (r) => r.mode as string },
          { name: "Reference", selector: (r) => r.reference as string },
        ];

      case "follow-ups":
        return [
          { name: "Follow-up ID", selector: (r) => r.id },
          { name: "Date", selector: (r) => r.date as string },
          { name: "Salesperson", selector: (r) => r.salesperson as string },
          { name: "Client", selector: (r) => r.client as string },
          { name: "Status", selector: (r) => r.status as string },
          { name: "Next Follow-up", selector: (r) => r.nextFollowup as string },
        ];

      default:
        return [];
    }
  }, [type]);

  /* -----------------------------------------
     TITLE
  ------------------------------------------ */

  const pretty =
    {
      salespersons: "Salespersons",
      visited: "Clients Visited",
      "orders-taken": "Orders Taken",
      "orders-executed": "Orders Executed",
      collection: "Collection",
      "follow-ups": "Follow-ups",
    }[type] ?? "Data";

  /* -----------------------------------------
     RENDER
  ------------------------------------------ */

  return (
    <div className="min-h-screen p-6" style={{ background: "#071027", color: "#fff" }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{pretty}</h1>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      <Card>
        <CardContent>
          <MyDataTable<AnyRow> title={pretty} columns={columns} data={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

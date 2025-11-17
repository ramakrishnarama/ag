"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import MyDataTable from "@/components/table/DataTable";
import { Card, CardContent } from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import { TableColumn } from "react-data-table-component";

/* -----------------------------------------
   BASE TYPE (ALL ROWS MUST EXTEND)
------------------------------------------ */
interface BaseRow {
  id: number;
}

/* -----------------------------------------
   TYPES FOR ALL TABLE ROWS (EXTENDING BaseRow)
------------------------------------------ */

type TableType =
  | "salespersons"
  | "visited"
  | "orders-taken"
  | "orders-executed"
  | "collection"
  | "follow-ups";

interface SalespersonRow extends BaseRow {
  name: string;
  totalVisits: number;
  ordersTaken: number;
  ordersExecuted: number;
  markets: number;
  collection: number;
  followups: number;
}

interface VisitedRow extends BaseRow {
  date: string;
  salesperson: string;
  clientName: string;
  duration: string;
  market: string;
  notes: string;
}

interface OrdersTakenRow extends BaseRow {
  date: string;
  salesperson: string;
  client: string;
  amount: number;
  status: string;
}

interface OrdersExecutedRow extends BaseRow {
  date: string;
  salesperson: string;
  client: string;
  amount: number;
  execStatus: string;
}

interface CollectionRow extends BaseRow {
  date: string;
  salesperson: string;
  client: string;
  amount: number;
  mode: string;
  reference: string;
}

interface FollowupRow extends BaseRow {
  date: string;
  salesperson: string;
  client: string;
  status: string;
  notes: string;
  nextFollowup: string;
}

/* -----------------------------------------
   MAP TABLE TYPE → EXACT ROW TYPE
------------------------------------------ */

type RowTypeMap = {
  salespersons: SalespersonRow;
  visited: VisitedRow;
  "orders-taken": OrdersTakenRow;
  "orders-executed": OrdersExecutedRow;
  collection: CollectionRow;
  "follow-ups": FollowupRow;
};

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
     GENERATE ROWS (STRICTLY TYPED)
  ------------------------------------------ */

  const rows = useMemo(() => {
    switch (type) {
      case "salespersons":
        return salesPeople.map<SalespersonRow>((s) => ({
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
        const list: VisitedRow[] = [];
        for (let i = 1; i <= 120; i++) {
          const sp = salesPeople[(i - 1) % salesPeople.length];
          list.push({
            id: i,
            date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
            salesperson: sp.name,
            clientName: `Client ${i}`,
            duration: `${Math.floor(Math.random() * 4)}h ${Math.floor(Math.random() * 60)}m`,
            market: `Market ${Math.floor(Math.random() * 6) + 1}`,
            notes: "",
          });
        }
        return filterId
          ? list.filter((r) => r.salesperson === salesPeople.find((x) => x.id === filterId)?.name)
          : list;
      }

      case "orders-taken": {
        const list: OrdersTakenRow[] = [];
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
        const list: OrdersExecutedRow[] = [];
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
        const list: CollectionRow[] = [];
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
        const list: FollowupRow[] = [];
        for (let i = 1; i <= 80; i++) {
          const sp = salesPeople[(i - 1) % salesPeople.length];
          list.push({
            id: i,
            date: new Date(Date.now() - i * 3600000).toISOString().slice(0, 10),
            salesperson: sp.name,
            client: `Client ${i}`,
            status: Math.random() > 0.5 ? "Open" : "Closed",
            notes: "",
            nextFollowup: new Date(Date.now() + Math.floor(Math.random() * 10) * 86400000)
              .toISOString()
              .slice(0, 10),
          });
        }
        return filterId
          ? list.filter((r) => r.salesperson === salesPeople.find((x) => x.id === filterId)?.name)
          : list;
      }
    }
  }, [type, filterId, salesPeople]);

  /* -----------------------------------------
     COLUMNS (TYPESAFE)
  ------------------------------------------ */

  const columns = useMemo(() => {
    switch (type) {
      case "salespersons":
        return [
          { name: "ID", selector: (r) => r.id, sortable: true },
          { name: "Name", selector: (r) => r.name, sortable: true },
          { name: "Total Visits", selector: (r) => r.totalVisits, sortable: true },
          { name: "Orders Taken", selector: (r) => r.ordersTaken, sortable: true },
          { name: "Orders Executed", selector: (r) => r.ordersExecuted, sortable: true },
          { name: "Markets", selector: (r) => r.markets, sortable: true },
          {
            name: "Collection",
            selector: (r) => `₹${Math.round(r.collection / 1000)}k`,
            sortable: true,
          },
        ] as TableColumn<SalespersonRow>[];

      case "visited":
        return [
          { name: "Visit ID", selector: (r) => r.id, sortable: true },
          { name: "Date", selector: (r) => r.date },
          { name: "Salesperson", selector: (r) => r.salesperson },
          { name: "Client Name", selector: (r) => r.clientName },
          { name: "Duration", selector: (r) => r.duration },
          { name: "Market", selector: (r) => r.market },
        ] as TableColumn<VisitedRow>[];

      case "orders-taken":
        return [
          { name: "Order ID", selector: (r) => r.id, sortable: true },
          { name: "Date", selector: (r) => r.date },
          { name: "Salesperson", selector: (r) => r.salesperson },
          { name: "Client", selector: (r) => r.client },
          { name: "Amount", selector: (r) => `₹${Math.round(r.amount / 1000)}k`, sortable: true },
          { name: "Status", selector: (r) => r.status },
        ] as TableColumn<OrdersTakenRow>[];

      case "orders-executed":
        return [
          { name: "Exec ID", selector: (r) => r.id },
          { name: "Date", selector: (r) => r.date },
          { name: "Salesperson", selector: (r) => r.salesperson },
          { name: "Client", selector: (r) => r.client },
          { name: "Amount", selector: (r) => `₹${Math.round(r.amount / 1000)}k` },
          { name: "Status", selector: (r) => r.execStatus },
        ] as TableColumn<OrdersExecutedRow>[];

      case "collection":
        return [
          { name: "Receipt ID", selector: (r) => r.id },
          { name: "Date", selector: (r) => r.date },
          { name: "Salesperson", selector: (r) => r.salesperson },
          { name: "Client", selector: (r) => r.client },
          { name: "Amount", selector: (r) => `₹${Math.round(r.amount / 1000)}k` },
          { name: "Mode", selector: (r) => r.mode },
          { name: "Reference", selector: (r) => r.reference },
        ] as TableColumn<CollectionRow>[];

      case "follow-ups":
        return [
          { name: "Follow-up ID", selector: (r) => r.id },
          { name: "Date", selector: (r) => r.date },
          { name: "Salesperson", selector: (r) => r.salesperson },
          { name: "Client", selector: (r) => r.client },
          { name: "Status", selector: (r) => r.status },
          { name: "Next Follow-up", selector: (r) => r.nextFollowup },
        ] as TableColumn<FollowupRow>[];
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
     CURRENT ROW TYPE EXTRACTION
  ------------------------------------------ */
  type CurrentRow = RowTypeMap[typeof type];

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
            <MyDataTable<CurrentRow>
            title={pretty}
            columns={columns}
            data={rows as CurrentRow[]}
            />
        </CardContent>
      </Card>
    </div>
  );
}

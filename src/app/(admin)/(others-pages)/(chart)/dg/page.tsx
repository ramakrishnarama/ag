"use client";

import { useMemo, useState } from "react";
import ApexChart from "@/components/charts/ApexWrapper";
import { Card, CardContent } from "@/components/ui/card/Card";
import KPI from "@/components/ui/KPI";
import Button from "@/components/ui/button/Button";
import FilterBar from "@/components/filters/FilterBar";
// import MyDataTable from "@/components/table/DataTable";
import { useRouter } from "next/navigation";

/* Types and generator (same structure used across pages) */
type SalesPerson = {
  id: number;
  name: string;
  visited: number;
  ordersTaken: number;
  ordersExecuted: number;
  duration: string;
  markets: number;
  collection: number;
  followups: number;
  totalSales: number;
  totalCollection: number;
  attainment: number;
  upsell: number;
  acquisition: number;
  retention: number;
  penetration: number;
};

const SAMPLE_NAMES = ["Rahul Sharma", "Anita Verma", "John Doe", "Sneha Nair", "Vikas Mehta", "Isha Rao"];

function genSalesPeople(): SalesPerson[] {
  return SAMPLE_NAMES.map((n, i) => {
    const visited = Math.floor(Math.random() * 30);
    const ordersTaken = Math.floor(Math.random() * 20);
    const ordersExecuted = Math.floor(Math.random() * ordersTaken);
    const markets = Math.floor(Math.random() * 8);
    const collection = Math.floor(Math.random() * 150000);
    const followups = Math.floor(Math.random() * 12);
    return {
      id: i + 1,
      name: n,
      visited,
      ordersTaken,
      ordersExecuted,
      duration: `${Math.floor(Math.random() * 6)}h ${Math.floor(Math.random() * 60)}m`,
      markets,
      collection,
      followups,
      totalSales: Math.floor(Math.random() * 900000),
      totalCollection: Math.floor(Math.random() * 700000),
      attainment: Math.floor(Math.random() * 120),
      upsell: Math.floor(Math.random() * 120000),
      acquisition: Math.floor(Math.random() * 60),
      retention: Math.floor(Math.random() * 100),
      penetration: Math.floor(Math.random() * 100),
    };
  });
}

export default function DashboardPage() {
  const [salesData] = useState<SalesPerson[]>(() => genSalesPeople());
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return d.toISOString().substring(0, 10);
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().substring(0, 10));
  const [salespersonFilter, setSalespersonFilter] = useState<number | null>(null);
  const router = useRouter();

  // const ordersSeries = [
  //   {
  //     name: "Orders",
  //     data: salesData.map((s) => s.ordersTaken),
  //   },
  // ];

  const totals = useMemo(() => {
    return salesData.reduce(
      (acc, s) => {
        acc.visited += s.visited;
        acc.ordersTaken += s.ordersTaken;
        acc.ordersExecuted += s.ordersExecuted;
        acc.markets += s.markets;
        acc.collection += s.collection;
        acc.followups += s.followups;
        acc.totalSales += s.totalSales;
        acc.totalCollection += s.totalCollection;
        return acc;
      },
      { visited: 0, ordersTaken: 0, ordersExecuted: 0, markets: 0, collection: 0, followups: 0, totalSales: 0, totalCollection: 0 }
    );
  }, [salesData]);

  // build stacked sample weekly series (simple distribution)
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const stackedSeries = useMemo(() => {
    const series = [
      { name: "Visited", data: weekDays.map(() => Math.floor(totals.visited / 7 * (0.6 + Math.random() * 0.8))) },
      { name: "Orders Taken", data: weekDays.map(() => Math.floor(totals.ordersTaken / 7 * (0.6 + Math.random() * 0.8))) },
      { name: "Orders Executed", data: weekDays.map(() => Math.floor(totals.ordersExecuted / 7 * (0.6 + Math.random() * 0.8))) },
      { name: "Follow-ups", data: weekDays.map(() => Math.floor(totals.followups / 7 * (0.6 + Math.random() * 0.8))) },
      { name: "Markets", data: weekDays.map(() => Math.floor(totals.markets / 7 * (0.6 + Math.random() * 0.8))) }
    ];
    return series;
  }, [totals]);

  const stackedOptions = {
    chart: { stacked: true, toolbar: { show: true }, background: "transparent" },
    plotOptions: { bar: { borderRadius: 10, columnWidth: "48%" } },
    dataLabels: { enabled: true, style: { colors: ["#0b1220"] }, formatter: (v: number) => (v > 3 ? String(v) : "") },
    xaxis: { categories: weekDays, labels: { style: { colors: "#94a3b8" } } },
    yaxis: { labels: { style: { colors: "#94a3b8" } } },
    grid: { borderColor: "#0f1724", strokeDashArray: 3 },
    legend: { position: "right" as const },
    colors: ["#22c55e", "#3b82f6", "#facc15", "#ef4444", "#a78bfa"]
  };

  // Day-wise collection series (sum of all SP collection / 7 + random offset)
const collectionDaySeries = [
  {
    name: "Collection",
    data: weekDays.map(() =>
      Math.floor((totals.collection / 7) * (0.5 + Math.random() * 1.2))
    ),
  },
];

const collectionDayOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    background: "transparent",
    foreColor: "#fff",
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 6,
      columnWidth: "45%",
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: weekDays,
    labels: { style: { colors: "#9ca3af" } },
  },
  yaxis: {
    labels: { style: { colors: "#9ca3af" } },
  },
  colors: [
    "#3b82f6", // green
    "#3b82f6", // blue
    "#3b82f6", // amber
    "#3b82f6", // red
    "#3b82f6", // purple
    "#3b82f6", // cyan
    "#3b82f6", // emerald
  ],
  grid: {
    borderColor: "#1f2937",
  },
};

  const revenueOptions = { labels: ["Sales", "Collection"], legend: { position: "bottom" as const }, dataLabels: { enabled: true }, colors: ["#3b82f6", "#10b981"] };

  // KPI click handlers: open datatable route
  const handleKPI = (type: string) => {
    router.push(`/datatable/${type}`);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#071027", color: "#fff" }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Sales Dashboard</h1>
        <div className="flex items-center gap-4">
          <FilterBar
            startDate={startDate}
            endDate={endDate}
            salespersonId={salespersonFilter}
            salespeople={salesData.map((s) => ({ id: s.id, name: s.name }))}
            onChange={({ startDate: sd, endDate: ed, salespersonId }) => {
              setStartDate(sd);
              setEndDate(ed);
              setSalespersonFilter(salespersonId);
            }}
          />
          <Button variant="primary" onClick={() => alert("Export whole dataset (future)")}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <KPI title="Total Salespersons" value={salesData.length} onClick={() => handleKPI("salespersons")} />
        <KPI title="Clients Visited" value={totals.visited} onClick={() => handleKPI("visited")} colorClass="text-green-400" />
        <KPI title="Orders Taken" value={totals.ordersTaken} onClick={() => handleKPI("orders-taken")} colorClass="text-blue-400" />
        <KPI title="Orders Executed" value={totals.ordersExecuted} onClick={() => handleKPI("orders-executed")} colorClass="text-yellow-400" />
        <KPI title="Total Collection" value={`₹${Math.round(totals.collection / 1000)}k`} onClick={() => handleKPI("collection")} colorClass="text-orange-400" />
        <KPI title="Follow-ups" value={totals.followups} onClick={() => handleKPI("follow-ups")} colorClass="text-pink-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-10">

        {/* DAILY ACTIVITY — left side large */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Daily Activity (Stacked)</h3>

              <ApexChart
                type="bar"
                height={340}
                series={stackedSeries}
                options={stackedOptions}
              />
            </CardContent>
          </Card>
        </div>

        {/* COLLECTION DAY WISE — middle large */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Collection (Day-wise)</h3>

              <ApexChart
                type="bar"
                height={340}
                series={collectionDaySeries}
                options={collectionDayOptions}
              />
            </CardContent>
          </Card>
        </div>

        {/* REVENUE STATUS — right sidebar */}
        <div className="xl:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4 self-start">Revenue Status</h3>

              <ApexChart
                type="pie"
                height={260}
                series={[totals.totalSales, totals.totalCollection]}
                options={revenueOptions}
              />
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Salesperson table snippet on dashboard (limited rows, can click KPI to view full dataset) */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-3">Salesperson Snapshot</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-slate-700">
                  <th className="p-2">Name</th>
                  <th className="p-2">Visited</th>
                  <th className="p-2">Orders</th>
                  <th className="p-2">Executed</th>
                  <th className="p-2">Collection</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {salesData.slice(0, 6).map((s) => (
                  <tr key={s.id} className="border-b border-slate-700 hover:bg-[#071426]">
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.visited}</td>
                    <td className="p-2">{s.ordersTaken}</td>
                    <td className="p-2">{s.ordersExecuted}</td>
                    <td className="p-2">₹{Math.round(s.collection / 1000)}k</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/datatable/salespersons?id=${s.id}`)}>View</Button>
                        <Button size="sm" variant="primary" onClick={() => router.push(`/datatable/visited?id=${s.id}`)}>Drill</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

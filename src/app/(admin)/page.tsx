import type { Metadata } from "next";
import { BengkelMetrics } from "@/components/bengkel/BengkelMetrics";
import React from "react";
import RingkasanServis from "@/components/bengkel/RingkasanServis";
import PendapatanChart from "@/components/bengkel/PendapatanChart";
import WorkOrderTable from "@/components/bengkel/WorkOrderTable";
import StokKritisTable from "@/components/bengkel/StokKritisTable";

export const metadata: Metadata = {
  title: "Dashboard | Bengkel ERP - Sistem Manajemen Bengkel",
  description: "Dashboard utama Bengkel ERP untuk monitoring operasional bengkel",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <BengkelMetrics />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <PendapatanChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <RingkasanServis />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <WorkOrderTable />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <StokKritisTable />
      </div>
    </div>
  );
}

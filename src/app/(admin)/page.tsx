import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { BengkelMetrics } from "@/components/bengkel/BengkelMetrics";
import RingkasanServis from "@/components/bengkel/RingkasanServis";
import PendapatanChart from "@/components/bengkel/PendapatanChart";
import WorkOrderTable from "@/components/bengkel/WorkOrderTable";
import StokKritisTable from "@/components/bengkel/StokKritisTable";
import Badge from "@/components/ui/badge/Badge";

export const metadata: Metadata = {
  title: "Dashboard | Auto7 - Sistem Manajemen Bengkel",
  description: "Dashboard utama Auto7 untuk monitoring operasional bengkel",
};

// Quick action data
const quickActions = [
  {
    title: "Work Order Baru",
    description: "Buat work order servis",
    href: "/servis/work-order/baru",
    color: "bg-brand-500",
  },
  {
    title: "Lihat Antrian",
    description: "Pantau antrian servis",
    href: "/servis/antrian",
    color: "bg-success-500",
  },
  {
    title: "Tambah Stok",
    description: "Input stok masuk",
    href: "/inventory/sparepart",
    color: "bg-warning-500",
  },
  {
    title: "Terima Pembayaran",
    description: "Proses pembayaran",
    href: "/keuangan/invoice",
    color: "bg-error-500",
  },
];

// Piutang summary
const piutangSummary = {
  total: 910000,
  jatuhTempo: 450000,
  items: [
    { pelanggan: "Andi Wijaya", jumlah: 450000, status: "Jatuh Tempo" },
    { pelanggan: "Raka Pratama", jumlah: 175000, status: "Sebagian" },
    { pelanggan: "Doni Saputra", jumlah: 285000, status: "Belum Lunas" },
  ],
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <BengkelMetrics />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
          >
            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-white/90 group-hover:text-brand-500">
              {action.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {action.description}
            </p>
          </Link>
        ))}
      </div>

      {/* 3 Pillars Section */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* PILLAR 1: SERVIS */}
        <div className="col-span-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-brand-500"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Servis & Work Order
            </h2>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-7">
          <WorkOrderTable />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <RingkasanServis />
        </div>

        {/* PILLAR 2: INVENTORY */}
        <div className="col-span-12">
          <div className="flex items-center gap-2 mb-4 mt-2">
            <div className="w-1 h-6 rounded-full bg-warning-500"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Inventory & Stok
            </h2>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <StokKritisTable />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Ringkasan Stok
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-success-50 dark:bg-success-500/10">
                  <p className="text-2xl font-bold text-success-600 dark:text-success-400">156</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stok Aman</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-warning-50 dark:bg-warning-500/10">
                  <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">23</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stok Menipis</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-error-50 dark:bg-error-500/10">
                  <p className="text-2xl font-bold text-error-600 dark:text-error-400">8</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stok Habis</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Nilai Stok</span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">Rp 245.750.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PILLAR 3: KEUANGAN */}
        <div className="col-span-12">
          <div className="flex items-center gap-2 mb-4 mt-2">
            <div className="w-1 h-6 rounded-full bg-success-500"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Keuangan
            </h2>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-7">
          <PendapatanChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Piutang Pelanggan
              </h3>
              <Link
                href="/keuangan/piutang"
                className="text-sm text-brand-500 hover:text-brand-600"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="p-6">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-error-50 dark:bg-error-500/10">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Piutang</p>
                  <p className="text-lg font-bold text-error-600 dark:text-error-400">
                    Rp {piutangSummary.total.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-500/10">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jatuh Tempo</p>
                  <p className="text-lg font-bold text-warning-600 dark:text-warning-400">
                    Rp {piutangSummary.jatuhTempo.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              {/* List */}
              <div className="space-y-3">
                {piutangSummary.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90 text-sm">
                        {item.pelanggan}
                      </p>
                      <Badge
                        size="sm"
                        color={
                          item.status === "Jatuh Tempo"
                            ? "error"
                            : item.status === "Sebagian"
                            ? "warning"
                            : "light"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="font-semibold text-error-500 text-sm">
                      Rp {item.jumlah.toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

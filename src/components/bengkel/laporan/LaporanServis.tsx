"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";

// Mock data laporan servis
const laporanData = [
  {
    periode: "Januari 2024",
    totalWO: 145,
    selesai: 138,
    pending: 7,
    pendapatanJasa: 48500000,
    pendapatanSparepart: 125000000,
    totalPendapatan: 173500000,
  },
  {
    periode: "Desember 2023",
    totalWO: 132,
    selesai: 132,
    pending: 0,
    pendapatanJasa: 44000000,
    pendapatanSparepart: 112000000,
    totalPendapatan: 156000000,
  },
  {
    periode: "November 2023",
    totalWO: 128,
    selesai: 128,
    pending: 0,
    pendapatanJasa: 42500000,
    pendapatanSparepart: 108000000,
    totalPendapatan: 150500000,
  },
  {
    periode: "Oktober 2023",
    totalWO: 135,
    selesai: 135,
    pending: 0,
    pendapatanJasa: 45000000,
    pendapatanSparepart: 115000000,
    totalPendapatan: 160000000,
  },
  {
    periode: "September 2023",
    totalWO: 121,
    selesai: 121,
    pending: 0,
    pendapatanJasa: 40500000,
    pendapatanSparepart: 102000000,
    totalPendapatan: 142500000,
  },
];

const jasaPopuler = [
  { nama: "Ganti Oli", jumlah: 85, pendapatan: 12750000 },
  { nama: "Tune Up", jumlah: 42, pendapatan: 16800000 },
  { nama: "Service AC", jumlah: 28, pendapatan: 8400000 },
  { nama: "Ganti Kampas Rem", jumlah: 35, pendapatan: 7000000 },
  { nama: "Spooring Balancing", jumlah: 22, pendapatan: 5500000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function LaporanServis() {
  const [periodeFilter, setPeriodeFilter] = useState("2024");

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Work Order
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            145
          </p>
          <p className="mt-1 text-xs text-success-600">+9.8% dari bulan lalu</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Rata-rata WO/Hari
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            4.8
          </p>
          <p className="mt-1 text-xs text-success-600">+0.3 dari bulan lalu</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pendapatan Jasa
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            Rp 48.5M
          </p>
          <p className="mt-1 text-xs text-success-600">
            +10.2% dari bulan lalu
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tingkat Penyelesaian
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            95.2%
          </p>
          <p className="mt-1 text-xs text-warning-600">-4.8% dari bulan lalu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Summary Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Ringkasan Bulanan
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Performa servis per bulan
              </p>
            </div>
            <div className="flex gap-2">
              <select
                className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                value={periodeFilter}
                onChange={(e) => setPeriodeFilter(e.target.value)}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              <Button size="sm" variant="outline">
                Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Periode
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Total WO
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Selesai
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Pendapatan Jasa
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Pendapatan Sparepart
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laporanData.map((item) => (
                  <TableRow
                    key={item.periode}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      {item.periode}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {item.totalWO}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {item.selesai}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-800 dark:text-white/90">
                      {formatCurrency(item.pendapatanJasa)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-800 dark:text-white/90">
                      {formatCurrency(item.pendapatanSparepart)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm font-semibold text-success-600 dark:text-success-400">
                      {formatCurrency(item.totalPendapatan)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Popular Services */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Jasa Terpopuler
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Bulan ini
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {jasaPopuler.map((jasa, index) => (
                <div
                  key={jasa.nama}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {jasa.nama}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {jasa.jumlah} transaksi
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    {formatCurrency(jasa.pendapatan)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

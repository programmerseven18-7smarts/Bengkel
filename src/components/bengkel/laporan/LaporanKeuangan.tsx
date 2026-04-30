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

// Mock data laporan keuangan
const pendapatanData = [
  { kategori: "Jasa Servis", jumlah: 48500000 },
  { kategori: "Penjualan Sparepart", jumlah: 125000000 },
  { kategori: "Pendapatan Lainnya", jumlah: 2500000 },
];

const pengeluaranData = [
  { kategori: "Pembelian Sparepart", jumlah: 85000000 },
  { kategori: "Gaji Karyawan", jumlah: 36000000 },
  { kategori: "Biaya Operasional", jumlah: 8500000 },
  { kategori: "Biaya Utilitas", jumlah: 4500000 },
  { kategori: "Biaya Lainnya", jumlah: 2000000 },
];

const arusKasBulanan = [
  {
    bulan: "Januari 2024",
    pendapatan: 176000000,
    pengeluaran: 136000000,
    netCashFlow: 40000000,
  },
  {
    bulan: "Desember 2023",
    pendapatan: 156000000,
    pengeluaran: 125000000,
    netCashFlow: 31000000,
  },
  {
    bulan: "November 2023",
    pendapatan: 150500000,
    pengeluaran: 118000000,
    netCashFlow: 32500000,
  },
  {
    bulan: "Oktober 2023",
    pendapatan: 160000000,
    pengeluaran: 128000000,
    netCashFlow: 32000000,
  },
  {
    bulan: "September 2023",
    pendapatan: 142500000,
    pengeluaran: 112000000,
    netCashFlow: 30500000,
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function LaporanKeuangan() {
  const [periodeFilter, setPeriodeFilter] = useState("januari-2024");

  const totalPendapatan = pendapatanData.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );
  const totalPengeluaran = pengeluaranData.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );
  const labaKotor = totalPendapatan - totalPengeluaran;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Pendapatan
          </p>
          <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
            {formatCurrency(totalPendapatan)}
          </p>
          <p className="mt-1 text-xs text-success-600">
            +12.8% dari bulan lalu
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Pengeluaran
          </p>
          <p className="mt-1 text-2xl font-bold text-error-600 dark:text-error-400">
            {formatCurrency(totalPengeluaran)}
          </p>
          <p className="mt-1 text-xs text-error-600">+8.8% dari bulan lalu</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Laba Kotor</p>
          <p className="mt-1 text-2xl font-bold text-brand-600 dark:text-brand-400">
            {formatCurrency(labaKotor)}
          </p>
          <p className="mt-1 text-xs text-success-600">
            +29.0% dari bulan lalu
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Margin Laba
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            {((labaKotor / totalPendapatan) * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-success-600">+2.1% dari bulan lalu</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <select
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            value={periodeFilter}
            onChange={(e) => setPeriodeFilter(e.target.value)}
          >
            <option value="januari-2024">Januari 2024</option>
            <option value="desember-2023">Desember 2023</option>
            <option value="november-2023">November 2023</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Export PDF
          </Button>
          <Button size="sm" variant="outline">
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pendapatan */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Rincian Pendapatan
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Kategori
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Jumlah
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    %
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendapatanData.map((item) => (
                  <TableRow
                    key={item.kategori}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                      {item.kategori}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-800 dark:text-white/90">
                      {formatCurrency(item.jumlah)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {((item.jumlah / totalPendapatan) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 dark:bg-white/[0.02]">
                  <TableCell className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                    Total Pendapatan
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-semibold text-success-600 dark:text-success-400">
                    {formatCurrency(totalPendapatan)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                    100%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pengeluaran */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Rincian Pengeluaran
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Kategori
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Jumlah
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    %
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pengeluaranData.map((item) => (
                  <TableRow
                    key={item.kategori}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                      {item.kategori}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-800 dark:text-white/90">
                      {formatCurrency(item.jumlah)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {((item.jumlah / totalPengeluaran) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 dark:bg-white/[0.02]">
                  <TableCell className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                    Total Pengeluaran
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-semibold text-error-600 dark:text-error-400">
                    {formatCurrency(totalPengeluaran)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                    100%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Arus Kas Bulanan */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Arus Kas Bulanan
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ringkasan arus kas 5 bulan terakhir
          </p>
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
                  Pendapatan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                >
                  Pengeluaran
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                >
                  Net Cash Flow
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {arusKasBulanan.map((item) => (
                <TableRow
                  key={item.bulan}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {item.bulan}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm text-success-600 dark:text-success-400">
                    {formatCurrency(item.pendapatan)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm text-error-600 dark:text-error-400">
                    {formatCurrency(item.pengeluaran)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {formatCurrency(item.netCashFlow)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

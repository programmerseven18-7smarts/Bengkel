"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { downloadCsv } from "@/lib/client-csv";

export interface LaporanServisSummary {
  totalWO: number;
  rataRataWoHarian: number;
  pendapatanJasa: number;
  tingkatPenyelesaian: number;
}

export interface LaporanServisMonthlyRow {
  periode: string;
  tahun: string;
  totalWO: number;
  selesai: number;
  pending: number;
  pendapatanJasa: number;
  pendapatanSparepart: number;
  totalPendapatan: number;
}

export interface JasaPopulerRow {
  nama: string;
  jumlah: number;
  pendapatan: number;
}

interface LaporanServisProps {
  summary: LaporanServisSummary;
  laporanData: LaporanServisMonthlyRow[];
  jasaPopuler: JasaPopulerRow[];
  years: string[];
  defaultYear: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);

export default function LaporanServis({
  summary,
  laporanData,
  jasaPopuler,
  years,
  defaultYear,
}: LaporanServisProps) {
  const [periodeFilter, setPeriodeFilter] = useState(defaultYear);

  const filteredData = useMemo(
    () => laporanData.filter((item) => item.tahun === periodeFilter),
    [laporanData, periodeFilter]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Work Order" value={`${summary.totalWO}`} />
        <SummaryCard
          title="Rata-rata WO/Hari"
          value={summary.rataRataWoHarian.toFixed(1)}
        />
        <SummaryCard
          title="Pendapatan Jasa"
          value={`Rp ${formatCompactCurrency(summary.pendapatanJasa)}`}
          tone="brand"
        />
        <SummaryCard
          title="Tingkat Penyelesaian"
          value={`${summary.tingkatPenyelesaian.toFixed(1)}%`}
          tone="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Ringkasan Bulanan
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Performa servis per bulan dari work order
              </p>
            </div>
            <div className="flex gap-2">
              <select
                className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                value={periodeFilter}
                onChange={(e) => setPeriodeFilter(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  downloadCsv(
                    `laporan-servis-${periodeFilter}.csv`,
                    [
                      { key: "periode", label: "Periode" },
                      { key: "totalWO", label: "Total WO" },
                      { key: "selesai", label: "Selesai" },
                      { key: "pending", label: "Pending" },
                      { key: "pendapatanJasa", label: "Pendapatan Jasa" },
                      { key: "pendapatanSparepart", label: "Pendapatan Sparepart" },
                      { key: "totalPendapatan", label: "Total Pendapatan" },
                    ],
                    filteredData
                  )
                }
              >
                Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  {[
                    "No",
                    "Periode",
                    "Total WO",
                    "Selesai",
                    "Pending",
                    "Pendapatan Jasa",
                    "Pendapatan Sparepart",
                    "Total",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow
                    key={`${item.tahun}-${item.periode}`}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      {item.periode}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {item.totalWO}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {item.selesai}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {item.pending}
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
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Belum ada data servis pada periode ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Jasa Terpopuler
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Berdasarkan work order
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {jasaPopuler.map((jasa, index) => (
                <div
                  key={jasa.nama}
                  className="flex items-center justify-between gap-4"
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
                  <p className="text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                    {formatCurrency(jasa.pendapatan)}
                  </p>
                </div>
              ))}
              {jasaPopuler.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Belum ada jasa pada work order.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  tone = "default",
}: {
  title: string;
  value: string;
  tone?: "default" | "brand" | "success";
}) {
  const valueClass =
    tone === "brand"
      ? "text-brand-600 dark:text-brand-400"
      : tone === "success"
        ? "text-success-600 dark:text-success-400"
        : "text-gray-800 dark:text-white/90";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

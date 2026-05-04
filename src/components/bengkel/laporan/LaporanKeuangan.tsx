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

export interface KeuanganKategoriRow {
  kategori: string;
  jumlah: number;
  tahun?: string;
}

export interface ArusKasBulananRow {
  bulan: string;
  tahun: string;
  pendapatan: number;
  pengeluaran: number;
  netCashFlow: number;
}

interface LaporanKeuanganProps {
  pendapatanData: KeuanganKategoriRow[];
  pengeluaranData: KeuanganKategoriRow[];
  arusKasBulanan: ArusKasBulananRow[];
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

const percentage = (value: number, total: number) =>
  total > 0 ? `${((value / total) * 100).toFixed(1)}%` : "0%";

export default function LaporanKeuangan({
  pendapatanData,
  pengeluaranData,
  arusKasBulanan,
  years,
  defaultYear,
}: LaporanKeuanganProps) {
  const [periodeFilter, setPeriodeFilter] = useState(defaultYear);

  const filteredArusKas = useMemo(
    () => arusKasBulanan.filter((item) => item.tahun === periodeFilter),
    [arusKasBulanan, periodeFilter]
  );
  const filteredPendapatanData = useMemo(
    () => pendapatanData.filter((item) => !item.tahun || item.tahun === periodeFilter),
    [pendapatanData, periodeFilter]
  );
  const filteredPengeluaranData = useMemo(
    () => pengeluaranData.filter((item) => !item.tahun || item.tahun === periodeFilter),
    [pengeluaranData, periodeFilter]
  );

  const totalPendapatan = filteredPendapatanData.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );
  const totalPengeluaran = filteredPengeluaranData.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );
  const labaKotor = totalPendapatan - totalPengeluaran;
  const marginLaba = totalPendapatan > 0 ? (labaKotor / totalPendapatan) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Pendapatan"
          value={formatCurrency(totalPendapatan)}
          tone="success"
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={formatCurrency(totalPengeluaran)}
          tone="error"
        />
        <SummaryCard
          title="Laba Kotor"
          value={formatCurrency(labaKotor)}
          tone="brand"
        />
        <SummaryCard title="Margin Laba" value={`${marginLaba.toFixed(1)}%`} />
      </div>

      <div className="flex items-center justify-between">
        <select
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          value={periodeFilter}
          onChange={(e) => setPeriodeFilter(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadCsv(
                `laporan-keuangan-${periodeFilter}.csv`,
                [
                  { key: "kategori", label: "Kategori" },
                  { key: "jumlah", label: "Jumlah" },
                ],
                [
                  ...filteredPendapatanData.map((item) => ({
                    kategori: `Pendapatan - ${item.kategori}`,
                    jumlah: item.jumlah,
                  })),
                  ...filteredPengeluaranData.map((item) => ({
                    kategori: `Pengeluaran - ${item.kategori}`,
                    jumlah: item.jumlah,
                  })),
                ]
              )
            }
          >
            Export Rincian
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadCsv(
                `arus-kas-${periodeFilter}.csv`,
                [
                  { key: "bulan", label: "Periode" },
                  { key: "pendapatan", label: "Pendapatan" },
                  { key: "pengeluaran", label: "Pengeluaran" },
                  { key: "netCashFlow", label: "Net Cash Flow" },
                ],
                filteredArusKas
              )
            }
          >
            Export Arus Kas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryTable
          title="Rincian Pendapatan"
          rows={filteredPendapatanData}
          total={totalPendapatan}
          totalLabel="Total Pendapatan"
          totalClass="text-success-600 dark:text-success-400"
        />
        <CategoryTable
          title="Rincian Pengeluaran"
          rows={filteredPengeluaranData}
          total={totalPengeluaran}
          totalLabel="Total Pengeluaran"
          totalClass="text-error-600 dark:text-error-400"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Arus Kas Bulanan
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ringkasan kas masuk dan keluar dari transaksi kas bank
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-800">
              <TableRow>
                {["No", "Periode", "Pendapatan", "Pengeluaran", "Net Cash Flow"].map(
                  (header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArusKas.map((item, index) => (
                <TableRow
                  key={`${item.tahun}-${item.bulan}`}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
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
              {filteredArusKas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Belum ada arus kas pada periode ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
  tone?: "default" | "brand" | "success" | "error";
}) {
  const valueClass =
    tone === "brand"
      ? "text-brand-600 dark:text-brand-400"
      : tone === "success"
        ? "text-success-600 dark:text-success-400"
        : tone === "error"
          ? "text-error-600 dark:text-error-400"
          : "text-gray-800 dark:text-white/90";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function CategoryTable({
  title,
  rows,
  total,
  totalLabel,
  totalClass,
}: {
  title: string;
  rows: KeuanganKategoriRow[];
  total: number;
  totalLabel: string;
  totalClass: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 dark:border-gray-800">
            <TableRow>
              {["No", "Kategori", "Jumlah", "%"].map((header) => (
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
            {rows.map((item, index) => (
              <TableRow
                key={item.kategori}
                className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
              >
                <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                  {item.kategori}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(item.jumlah)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                  {percentage(item.jumlah, total)}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Belum ada data.
                </TableCell>
              </TableRow>
            )}
            <TableRow className="bg-gray-50 dark:bg-white/[0.02]">
              <TableCell colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                {totalLabel}
              </TableCell>
              <TableCell className={`px-6 py-4 text-right text-sm font-semibold ${totalClass}`}>
                {formatCurrency(total)}
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                100%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

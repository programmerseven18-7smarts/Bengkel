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

export interface LaporanStokRow {
  kode: string;
  nama: string;
  kategori: string;
  stokAwal: number;
  masuk: number;
  keluar: number;
  stokAkhir: number;
  minStok: number;
  nilaiStok: number;
}

export interface KategoriStokSummary {
  nama: string;
  totalItem: number;
  nilaiStok: number;
}

export interface LaporanStokSummary {
  totalSku: number;
  totalUnit: number;
  totalNilaiStok: number;
  stokMinimum: number;
}

interface LaporanStokProps {
  summary: LaporanStokSummary;
  stokData: LaporanStokRow[];
  kategoriSummary: KategoriStokSummary[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default function LaporanStok({
  summary,
  stokData,
  kategoriSummary,
}: LaporanStokProps) {
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");

  const kategoriOptions = useMemo(
    () => Array.from(new Set(stokData.map((item) => item.kategori))).sort(),
    [stokData]
  );

  const filteredData = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return stokData.filter((item) => {
      const matchSearch =
        !keyword ||
        `${item.nama} ${item.kode}`.toLowerCase().includes(keyword);
      const matchKategori =
        kategoriFilter === "Semua" || item.kategori === kategoriFilter;
      return matchSearch && matchKategori;
    });
  }, [kategoriFilter, searchTerm, stokData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total SKU Aktif" value={`${summary.totalSku}`} />
        <SummaryCard title="Total Unit Stok" value={`${summary.totalUnit}`} />
        <SummaryCard
          title="Nilai Total Stok"
          value={formatCurrency(summary.totalNilaiStok)}
          tone="brand"
        />
        <SummaryCard
          title="Stok di Bawah Minimum"
          value={`${summary.stokMinimum}`}
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Stok per Kategori
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {kategoriSummary.map((kategori) => (
                <div
                  key={kategori.nama}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {kategori.nama}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {kategori.totalItem} SKU
                    </p>
                  </div>
                  <p className="text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                    {formatCurrency(kategori.nilaiStok)}
                  </p>
                </div>
              ))}
              {kategoriSummary.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Belum ada kategori stok.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Pergerakan Stok
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Pergerakan stok bulan ini dari ledger
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                downloadCsv(
                  "laporan-stok.csv",
                  [
                    { key: "kode", label: "Kode" },
                    { key: "nama", label: "Nama Sparepart" },
                    { key: "kategori", label: "Kategori" },
                    { key: "stokAwal", label: "Stok Awal" },
                    { key: "masuk", label: "Masuk" },
                    { key: "keluar", label: "Keluar" },
                    { key: "stokAkhir", label: "Stok Akhir" },
                    { key: "minStok", label: "Min Stok" },
                    { key: "nilaiStok", label: "Nilai Stok" },
                  ],
                  filteredData
                )
              }
            >
              Export
            </Button>
          </div>

          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800 sm:flex-row">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari sparepart..."
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
            >
              <option value="Semua">Semua Kategori</option>
              {kategoriOptions.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  {[
                    "No",
                    "Kode",
                    "Nama Sparepart",
                    "Awal",
                    "Masuk",
                    "Keluar",
                    "Akhir",
                    "Min.",
                    "Nilai",
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
                    key={item.kode}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      {item.kode}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-800 dark:text-white/90">
                          {item.nama}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.kategori}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {item.stokAwal}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-success-600 dark:text-success-400">
                      +{item.masuk}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-error-600 dark:text-error-400">
                      -{item.keluar}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                      {item.stokAkhir}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {item.minStok}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-800 dark:text-white/90">
                      {formatCurrency(item.nilaiStok)}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Belum ada data stok sesuai filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
  tone?: "default" | "brand" | "warning";
}) {
  const valueClass =
    tone === "brand"
      ? "text-brand-600 dark:text-brand-400"
      : tone === "warning"
        ? "text-warning-600 dark:text-warning-400"
        : "text-gray-800 dark:text-white/90";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

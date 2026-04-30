"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

// Mock data laporan stok
const stokData = [
  {
    kode: "SPR-001",
    nama: "Oli Mesin 10W-40",
    kategori: "Oli & Pelumas",
    stokAwal: 100,
    masuk: 50,
    keluar: 85,
    stokAkhir: 65,
    nilaiStok: 6500000,
  },
  {
    kode: "SPR-002",
    nama: "Filter Oli",
    kategori: "Filter",
    stokAwal: 80,
    masuk: 40,
    keluar: 72,
    stokAkhir: 48,
    nilaiStok: 2400000,
  },
  {
    kode: "SPR-003",
    nama: "Kampas Rem Depan",
    kategori: "Rem",
    stokAwal: 50,
    masuk: 30,
    keluar: 35,
    stokAkhir: 45,
    nilaiStok: 4500000,
  },
  {
    kode: "SPR-004",
    nama: "Busi NGK",
    kategori: "Kelistrikan",
    stokAwal: 120,
    masuk: 60,
    keluar: 95,
    stokAkhir: 85,
    nilaiStok: 2125000,
  },
  {
    kode: "SPR-005",
    nama: "Aki 45Ah",
    kategori: "Kelistrikan",
    stokAwal: 20,
    masuk: 10,
    keluar: 12,
    stokAkhir: 18,
    nilaiStok: 14400000,
  },
  {
    kode: "SPR-006",
    nama: "V-Belt",
    kategori: "Mesin",
    stokAwal: 30,
    masuk: 20,
    keluar: 28,
    stokAkhir: 22,
    nilaiStok: 3300000,
  },
];

const kategoriSummary = [
  { nama: "Oli & Pelumas", totalItem: 15, nilaiStok: 18500000 },
  { nama: "Filter", totalItem: 8, nilaiStok: 5200000 },
  { nama: "Rem", totalItem: 12, nilaiStok: 9800000 },
  { nama: "Kelistrikan", totalItem: 25, nilaiStok: 28500000 },
  { nama: "Mesin", totalItem: 18, nilaiStok: 15200000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function LaporanStok() {
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = stokData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori =
      kategoriFilter === "Semua" || item.kategori === kategoriFilter;
    return matchSearch && matchKategori;
  });

  const totalNilaiStok = stokData.reduce((sum, item) => sum + item.nilaiStok, 0);
  const totalItem = stokData.reduce((sum, item) => sum + item.stokAkhir, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total SKU Aktif
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            {stokData.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Unit Stok
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            {totalItem}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nilai Total Stok
          </p>
          <p className="mt-1 text-2xl font-bold text-brand-600 dark:text-brand-400">
            {formatCurrency(totalNilaiStok)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stok di Bawah Minimum
          </p>
          <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">
            8
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kategori Summary */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
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
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {kategori.nama}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {kategori.totalItem} item
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    {formatCurrency(kategori.nilaiStok)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Movement Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Pergerakan Stok
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Bulan ini
              </p>
            </div>
            <Button size="sm" variant="outline">
              Export
            </Button>
          </div>

          {/* Filters */}
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
              <option value="Oli & Pelumas">Oli & Pelumas</option>
              <option value="Filter">Filter</option>
              <option value="Rem">Rem</option>
              <option value="Kelistrikan">Kelistrikan</option>
              <option value="Mesin">Mesin</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Kode
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Nama Sparepart
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Awal
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Masuk
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Keluar
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Akhir
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    Nilai
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow
                    key={item.kode}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                  >
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
                    <TableCell className="px-6 py-4 text-right text-sm text-gray-800 dark:text-white/90">
                      {formatCurrency(item.nilaiStok)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

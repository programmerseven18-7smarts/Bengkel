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

// Mock data kas & bank
const kasBankData = [
  {
    id: "TRX-2024-001",
    tanggal: "2024-01-15",
    jenis: "Masuk",
    kategori: "Pembayaran Invoice",
    deskripsi: "Pembayaran INV-2024-001",
    jumlah: 1200000,
    akun: "Kas",
    saldoAkhir: 15200000,
  },
  {
    id: "TRX-2024-002",
    tanggal: "2024-01-15",
    jenis: "Keluar",
    kategori: "Pembelian Stok",
    deskripsi: "Pembelian sparepart dari CV. Maju Jaya",
    jumlah: 5000000,
    akun: "Bank BCA",
    saldoAkhir: 45000000,
  },
  {
    id: "TRX-2024-003",
    tanggal: "2024-01-14",
    jenis: "Masuk",
    kategori: "Pembayaran Invoice",
    deskripsi: "Pembayaran INV-2024-003",
    jumlah: 650000,
    akun: "Kas",
    saldoAkhir: 14000000,
  },
  {
    id: "TRX-2024-004",
    tanggal: "2024-01-14",
    jenis: "Keluar",
    kategori: "Operasional",
    deskripsi: "Biaya listrik bulan Januari",
    jumlah: 1500000,
    akun: "Bank BCA",
    saldoAkhir: 50000000,
  },
  {
    id: "TRX-2024-005",
    tanggal: "2024-01-13",
    jenis: "Masuk",
    kategori: "Pembayaran Invoice",
    deskripsi: "Pembayaran INV-2024-005",
    jumlah: 450000,
    akun: "QRIS",
    saldoAkhir: 3500000,
  },
  {
    id: "TRX-2024-006",
    tanggal: "2024-01-13",
    jenis: "Keluar",
    kategori: "Gaji Karyawan",
    deskripsi: "Gaji mekanik bulan Januari",
    jumlah: 12000000,
    akun: "Bank BCA",
    saldoAkhir: 51500000,
  },
];

const akunSummary = [
  { nama: "Kas", saldo: 15200000, icon: "💵" },
  { nama: "Bank BCA", saldo: 45000000, icon: "🏦" },
  { nama: "QRIS", saldo: 3500000, icon: "📱" },
];

const getJenisBadge = (jenis: string) => {
  switch (jenis) {
    case "Masuk":
      return <Badge color="success">{jenis}</Badge>;
    case "Keluar":
      return <Badge color="error">{jenis}</Badge>;
    default:
      return <Badge color="light">{jenis}</Badge>;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function KasBankList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [akunFilter, setAkunFilter] = useState("Semua");

  const filteredData = kasBankData.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJenis = jenisFilter === "Semua" || item.jenis === jenisFilter;
    const matchAkun = akunFilter === "Semua" || item.akun === akunFilter;
    return matchSearch && matchJenis && matchAkun;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {akunSummary.map((akun) => (
          <div
            key={akun.nama}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {akun.nama}
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
                  {formatCurrency(akun.saldo)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl dark:bg-gray-800">
                {akun.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Transaksi Kas & Bank
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Riwayat transaksi keuangan bengkel
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              + Kas Masuk
            </Button>
            <Button size="sm" variant="outline">
              + Kas Keluar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
            >
              <option value="Semua">Semua Jenis</option>
              <option value="Masuk">Kas Masuk</option>
              <option value="Keluar">Kas Keluar</option>
            </select>
            <select
              className="rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
              value={akunFilter}
              onChange={(e) => setAkunFilter(e.target.value)}
            >
              <option value="Semua">Semua Akun</option>
              <option value="Kas">Kas</option>
              <option value="Bank BCA">Bank BCA</option>
              <option value="QRIS">QRIS</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                >
                  ID Transaksi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                >
                  Tanggal
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-center text-sm font-semibold text-gray-800 dark:text-white/90"
                >
                  Jenis
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                >
                  Kategori
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                >
                  Deskripsi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
                >
                  Jumlah
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                >
                  Akun
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {item.id}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    {getJenisBadge(item.jenis)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                    {item.kategori}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.deskripsi}
                  </TableCell>
                  <TableCell
                    className={`px-6 py-4 text-right text-sm font-semibold ${
                      item.jenis === "Masuk"
                        ? "text-success-600 dark:text-success-400"
                        : "text-error-600 dark:text-error-400"
                    }`}
                  >
                    {item.jenis === "Masuk" ? "+" : "-"}
                    {formatCurrency(item.jumlah)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.akun}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {filteredData.length} dari {kasBankData.length}{" "}
            transaksi
          </p>
        </div>
      </div>
    </div>
  );
}

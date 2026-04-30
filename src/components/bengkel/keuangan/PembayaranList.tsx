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

// Mock data pembayaran
const pembayaranData = [
  {
    id: "PAY-2024-001",
    invoiceId: "INV-2024-001",
    tanggal: "2024-01-15",
    pelanggan: "Budi Santoso",
    jumlahBayar: 1200000,
    metodePembayaran: "Transfer Bank",
    nomorReferensi: "TRF001234",
    kasir: "Admin 1",
  },
  {
    id: "PAY-2024-002",
    invoiceId: "INV-2024-003",
    tanggal: "2024-01-14",
    pelanggan: "Ahmad Wijaya",
    jumlahBayar: 650000,
    metodePembayaran: "Tunai",
    nomorReferensi: "-",
    kasir: "Admin 2",
  },
  {
    id: "PAY-2024-003",
    invoiceId: "INV-2024-005",
    tanggal: "2024-01-13",
    pelanggan: "Rudi Hermawan",
    jumlahBayar: 450000,
    metodePembayaran: "QRIS",
    nomorReferensi: "QRIS789012",
    kasir: "Admin 1",
  },
  {
    id: "PAY-2024-004",
    invoiceId: "INV-2024-006",
    tanggal: "2024-01-12",
    pelanggan: "Eka Pratama",
    jumlahBayar: 2150000,
    metodePembayaran: "Kartu Debit",
    nomorReferensi: "DEB345678",
    kasir: "Admin 2",
  },
  {
    id: "PAY-2024-005",
    invoiceId: "INV-2024-007",
    tanggal: "2024-01-11",
    pelanggan: "Lisa Maharani",
    jumlahBayar: 875000,
    metodePembayaran: "Transfer Bank",
    nomorReferensi: "TRF567890",
    kasir: "Admin 1",
  },
];

const getMetodeBadge = (metode: string) => {
  switch (metode) {
    case "Transfer Bank":
      return <Badge color="primary">{metode}</Badge>;
    case "Tunai":
      return <Badge color="success">{metode}</Badge>;
    case "QRIS":
      return <Badge color="info">{metode}</Badge>;
    case "Kartu Debit":
      return <Badge color="warning">{metode}</Badge>;
    default:
      return <Badge color="light">{metode}</Badge>;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function PembayaranList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [metodeFilter, setMetodeFilter] = useState("Semua");

  const filteredData = pembayaranData.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pelanggan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMetode =
      metodeFilter === "Semua" || item.metodePembayaran === metodeFilter;
    return matchSearch && matchMetode;
  });

  const totalPembayaran = filteredData.reduce(
    (sum, item) => sum + item.jumlahBayar,
    0
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Riwayat Pembayaran
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Daftar pembayaran yang telah diterima
          </p>
        </div>
        <div className="rounded-lg bg-success-50 px-4 py-2 dark:bg-success-500/10">
          <p className="text-sm text-success-600 dark:text-success-400">
            Total Pembayaran:{" "}
            <span className="font-semibold">
              {formatCurrency(totalPembayaran)}
            </span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari ID pembayaran, invoice, atau pelanggan..."
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
            value={metodeFilter}
            onChange={(e) => setMetodeFilter(e.target.value)}
          >
            <option value="Semua">Semua Metode</option>
            <option value="Tunai">Tunai</option>
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="QRIS">QRIS</option>
            <option value="Kartu Debit">Kartu Debit</option>
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
                ID Pembayaran
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
              >
                No. Invoice
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
              >
                Tanggal
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
              >
                Pelanggan
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90"
              >
                Jumlah Bayar
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-center text-sm font-semibold text-gray-800 dark:text-white/90"
              >
                Metode
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
              >
                No. Referensi
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
              >
                Kasir
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
                <TableCell className="px-6 py-4 text-sm text-brand-500">
                  {item.invoiceId}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(item.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                  {item.pelanggan}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-semibold text-success-600 dark:text-success-400">
                  {formatCurrency(item.jumlahBayar)}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  {getMetodeBadge(item.metodePembayaran)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {item.nomorReferensi}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {item.kasir}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {filteredData.length} dari {pembayaranData.length}{" "}
          pembayaran
        </p>
      </div>
    </div>
  );
}

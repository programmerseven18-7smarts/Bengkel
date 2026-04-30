"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

// Mock data invoice
const invoiceData = [
  {
    id: "INV-2024-001",
    workOrderId: "WO-2024-001",
    tanggal: "2024-01-15",
    pelanggan: "Budi Santoso",
    kendaraan: "B 1234 CD",
    totalJasa: 350000,
    totalSparepart: 850000,
    totalInvoice: 1200000,
    status: "Lunas",
  },
  {
    id: "INV-2024-002",
    workOrderId: "WO-2024-002",
    tanggal: "2024-01-15",
    pelanggan: "Siti Rahayu",
    kendaraan: "B 5678 EF",
    totalJasa: 500000,
    totalSparepart: 1500000,
    totalInvoice: 2000000,
    status: "Belum Lunas",
  },
  {
    id: "INV-2024-003",
    workOrderId: "WO-2024-003",
    tanggal: "2024-01-14",
    pelanggan: "Ahmad Wijaya",
    kendaraan: "B 9012 GH",
    totalJasa: 200000,
    totalSparepart: 450000,
    totalInvoice: 650000,
    status: "Lunas",
  },
  {
    id: "INV-2024-004",
    workOrderId: "WO-2024-004",
    tanggal: "2024-01-14",
    pelanggan: "Dewi Lestari",
    kendaraan: "B 3456 IJ",
    totalJasa: 750000,
    totalSparepart: 2500000,
    totalInvoice: 3250000,
    status: "Belum Lunas",
  },
  {
    id: "INV-2024-005",
    workOrderId: "WO-2024-005",
    tanggal: "2024-01-13",
    pelanggan: "Rudi Hermawan",
    kendaraan: "B 7890 KL",
    totalJasa: 150000,
    totalSparepart: 300000,
    totalInvoice: 450000,
    status: "Lunas",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Lunas":
      return <Badge color="success">{status}</Badge>;
    case "Belum Lunas":
      return <Badge color="warning">{status}</Badge>;
    default:
      return <Badge color="light">{status}</Badge>;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function InvoiceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const filteredData = invoiceData.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kendaraan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "Semua" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6 sm:py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Invoice
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kelola invoice servis pelanggan
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari invoice, pelanggan, atau kendaraan..."
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="Lunas">Lunas</option>
            <option value="Belum Lunas">Belum Lunas</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {filteredData.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link
                    href={`/keuangan/invoice/${item.id}`}
                    className="font-medium text-brand-500 hover:text-brand-600"
                  >
                    {item.id}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {getStatusBadge(item.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Pelanggan</span>
                  <span className="text-gray-800 dark:text-white/90">{item.pelanggan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Kendaraan</span>
                  <span className="text-gray-800 dark:text-white/90">{item.kendaraan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Jasa</span>
                  <span className="text-gray-800 dark:text-white/90">{formatCurrency(item.totalJasa)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Sparepart</span>
                  <span className="text-gray-800 dark:text-white/90">{formatCurrency(item.totalSparepart)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-white/[0.05]">
                  <span className="font-medium text-gray-800 dark:text-white/90">Total Invoice</span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">{formatCurrency(item.totalInvoice)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.05]">
                <Button size="sm" variant="outline">
                  Cetak
                </Button>
                {item.status === "Belum Lunas" && (
                  <Button size="sm" variant="primary">
                    Bayar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90">
                No. Invoice
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90">
                Tanggal
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90">
                Pelanggan
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90">
                Kendaraan
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                Total Jasa
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                Total Sparepart
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                Total Invoice
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-center text-sm font-semibold text-gray-800 dark:text-white/90">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-center text-sm font-semibold text-gray-800 dark:text-white/90">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]">
                <TableCell className="px-6 py-4">
                  <Link href={`/keuangan/invoice/${item.id}`} className="font-medium text-brand-500 hover:text-brand-600">
                    {item.id}
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                  {item.pelanggan}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {item.kendaraan}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(item.totalJasa)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(item.totalSparepart)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                  {formatCurrency(item.totalInvoice)}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button size="sm" variant="outline">Cetak</Button>
                    {item.status === "Belum Lunas" && <Button size="sm" variant="primary">Bayar</Button>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {filteredData.length} dari {invoiceData.length} invoice
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total Lunas: </span>
              <span className="font-semibold text-success-600">
                {formatCurrency(filteredData.filter((i) => i.status === "Lunas").reduce((sum, i) => sum + i.totalInvoice, 0))}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total Belum Lunas: </span>
              <span className="font-semibold text-warning-600">
                {formatCurrency(filteredData.filter((i) => i.status === "Belum Lunas").reduce((sum, i) => sum + i.totalInvoice, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
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
import { cancelPembayaranAction } from "@/lib/keuangan/actions";

export interface PembayaranRow {
  id: string;
  noPembayaran: string;
  noInvoice: string;
  invoiceId: string;
  tanggal: string;
  pelanggan: string;
  jumlahBayar: number;
  metodePembayaran: string;
  nomorReferensi: string;
  kasir: string;
  status: "DRAFT" | "SELESAI" | "BATAL";
}

interface PembayaranListProps {
  pembayaran: PembayaranRow[];
}

const getMetodeBadge = (metode: string) => {
  if (!metode) return <Badge color="light">-</Badge>;
  if (metode.toLowerCase().includes("tunai")) {
    return <Badge color="success">{metode}</Badge>;
  }
  if (metode.toLowerCase().includes("qris")) {
    return <Badge color="info">{metode}</Badge>;
  }
  if (metode.toLowerCase().includes("transfer")) {
    return <Badge color="primary">{metode}</Badge>;
  }
  return <Badge color="warning">{metode}</Badge>;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function PembayaranList({ pembayaran }: PembayaranListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [metodeFilter, setMetodeFilter] = useState("Semua");

  const metodeOptions = useMemo(
    () => Array.from(new Set(pembayaran.map((item) => item.metodePembayaran).filter(Boolean))),
    [pembayaran]
  );
  const filteredData = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return pembayaran.filter((item) => {
      const text =
        `${item.noPembayaran} ${item.noInvoice} ${item.pelanggan} ${item.nomorReferensi}`.toLowerCase();
      const matchSearch = !keyword || text.includes(keyword);
      const matchMetode =
        metodeFilter === "Semua" || item.metodePembayaran === metodeFilter;
      return matchSearch && matchMetode;
    });
  }, [metodeFilter, pembayaran, searchTerm]);
  const totalPembayaran = filteredData.reduce(
    (sum, item) => sum + (item.status === "SELESAI" ? item.jumlahBayar : 0),
    0
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
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
            <span className="font-semibold">{formatCurrency(totalPembayaran)}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800 sm:flex-row">
        <input
          type="text"
          placeholder="Cari ID pembayaran, invoice, atau pelanggan..."
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select
          className="rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
          value={metodeFilter}
          onChange={(event) => setMetodeFilter(event.target.value)}
        >
          <option value="Semua">Semua Metode</option>
          {metodeOptions.map((metode) => (
            <option key={metode} value={metode}>
              {metode}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1160px]">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-800">
              <TableRow>
                {[
                  "No",
                  "ID Pembayaran",
                  "No. Invoice",
                  "Tanggal",
                  "Pelanggan",
                  "Jumlah Bayar",
                  "Metode",
                  "No. Referensi",
                  "Kasir",
                  "Status",
                  "Aksi",
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
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {item.noPembayaran}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-brand-500">
                    <Link href={`/keuangan/invoice/${item.invoiceId}`}>
                      {item.noInvoice}
                    </Link>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(item.tanggal)}
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
                    {item.nomorReferensi || "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.kasir || "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      color={
                        item.status === "SELESAI"
                          ? "success"
                          : item.status === "BATAL"
                            ? "error"
                            : "light"
                      }
                    >
                      {item.status === "SELESAI"
                        ? "Selesai"
                        : item.status === "BATAL"
                          ? "Batal"
                          : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {item.status === "SELESAI" ? (
                      <form action={cancelPembayaranAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <Button type="submit" size="sm" variant="outline">
                          Batalkan
                        </Button>
                      </form>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {filteredData.length} dari {pembayaran.length} pembayaran
        </p>
      </div>
    </div>
  );
}

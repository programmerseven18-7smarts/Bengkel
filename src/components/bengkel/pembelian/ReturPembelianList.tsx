"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Pagination from "@/components/tables/Pagination";
import Link from "next/link";

type ReturStatus = "DRAFT" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";

export interface ReturPembelianRow {
  id: string;
  noRetur: string;
  tanggal: string;
  supplier: string;
  referensi: string;
  alasan: string;
  totalItem: number;
  totalNilai: number;
  status: ReturStatus;
}

interface ReturPembelianListProps {
  returPembelian: ReturPembelianRow[];
}

const statusLabel = (status: ReturStatus) => {
  switch (status) {
    case "DIKIRIM":
      return "Dikirim";
    case "SELESAI":
      return "Selesai";
    case "DIBATALKAN":
      return "Dibatalkan";
    case "DRAFT":
      return "Draft";
  }
};

const getStatusColor = (status: ReturStatus) => {
  switch (status) {
    case "DRAFT":
      return "light";
    case "DIKIRIM":
      return "warning";
    case "SELESAI":
      return "success";
    case "DIBATALKAN":
      return "error";
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ReturPembelianList({
  returPembelian,
}: ReturPembelianListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return returPembelian.filter((item) => {
      const text =
        `${item.noRetur} ${item.supplier} ${item.referensi} ${item.alasan}`.toLowerCase();
      return !keyword || text.includes(keyword);
    });
  }, [query, returPembelian]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Cari retur pembelian..."
            className="w-full"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Link href="/pembelian/retur-pembelian/create">
          <Button size="md" variant="primary" className="w-full sm:w-auto">
            Buat Retur
          </Button>
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[980px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "No",
                  "No. Retur",
                  "Tanggal",
                  "Supplier",
                  "Referensi",
                  "Alasan",
                  "Item",
                  "Nilai",
                  "Status",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm font-medium">
                    <Link
                      href={`/pembelian/retur-pembelian/${item.id}`}
                      className="text-brand-500 hover:text-brand-600"
                    >
                      {item.noRetur}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.tanggal)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.supplier}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.referensi || "-"}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {item.alasan || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-800 dark:text-white/90">
                    {item.totalItem}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-end text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(item.totalNilai)}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge size="sm" color={getStatusColor(item.status)}>
                      {statusLabel(item.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {filteredData.length} dari {returPembelian.length} data
        </p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

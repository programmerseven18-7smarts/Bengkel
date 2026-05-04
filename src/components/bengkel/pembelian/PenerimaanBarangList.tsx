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
import Input from "@/components/form/input/InputField";
import Pagination from "@/components/tables/Pagination";

type PenerimaanStatus = "DRAFT" | "PARSIAL" | "SELESAI" | "DIBATALKAN";

export interface PenerimaanBarangRow {
  id: string;
  noPenerimaan: string;
  noPurchaseOrder: string;
  tanggal: string;
  supplier: string;
  diterimaOleh: string;
  totalItem: number;
  totalNilai: number;
  status: PenerimaanStatus;
}

interface PenerimaanBarangListProps {
  penerimaanBarang: PenerimaanBarangRow[];
}

const statusLabel = (status: PenerimaanStatus) => {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "PARSIAL":
      return "Parsial";
    case "SELESAI":
      return "Selesai";
    case "DIBATALKAN":
      return "Dibatalkan";
  }
};

const getStatusColor = (status: PenerimaanStatus) => {
  switch (status) {
    case "DRAFT":
      return "light";
    case "PARSIAL":
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

export default function PenerimaanBarangList({
  penerimaanBarang,
}: PenerimaanBarangListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return penerimaanBarang.filter((item) => {
      const text =
        `${item.noPenerimaan} ${item.noPurchaseOrder} ${item.supplier} ${item.diterimaOleh}`.toLowerCase();
      return !keyword || text.includes(keyword);
    });
  }, [penerimaanBarang, query]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari penerimaan..."
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <Link href="/pembelian/penerimaan-barang/create">
          <Button size="md" variant="primary" className="w-full sm:w-auto">
            Terima Barang
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
                  "No. Penerimaan",
                  "No. PO",
                  "Supplier",
                  "Tanggal",
                  "Penerima",
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
                  <TableCell className="px-5 py-4 text-theme-sm font-medium text-brand-500">
                    <Link href={`/pembelian/penerimaan-barang/${item.id}`}>
                      {item.noPenerimaan}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.noPurchaseOrder || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.supplier}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.tanggal)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.diterimaOleh || "-"}
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
          Menampilkan {filteredData.length} dari {penerimaanBarang.length} data
        </p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

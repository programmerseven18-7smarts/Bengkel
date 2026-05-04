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
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";

type StokKeluarTipe = "SERVIS" | "PENJUALAN" | "RETUR" | "LAINNYA";

export interface StokKeluarRow {
  id: string;
  noTransaksi: string;
  tanggal: string;
  referensi: string;
  tipe: StokKeluarTipe;
  totalItem: number;
  totalNilai: number;
}

interface StokKeluarListProps {
  stokKeluar: StokKeluarRow[];
}

const tipeOptions = [
  { value: "", label: "Semua Tipe" },
  { value: "SERVIS", label: "Servis" },
  { value: "PENJUALAN", label: "Penjualan" },
  { value: "RETUR", label: "Retur" },
  { value: "LAINNYA", label: "Lainnya" },
];

const tipeLabel = (tipe: StokKeluarTipe) =>
  tipeOptions.find((item) => item.value === tipe)?.label ?? tipe;

const getTipeColor = (tipe: StokKeluarTipe) => {
  switch (tipe) {
    case "SERVIS":
      return "primary";
    case "PENJUALAN":
      return "success";
    case "RETUR":
      return "warning";
    case "LAINNYA":
      return "light";
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

export default function StokKeluarList({ stokKeluar }: StokKeluarListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTipe, setSelectedTipe] = useState("");
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return stokKeluar.filter((item) => {
      const text = `${item.noTransaksi} ${item.referensi}`.toLowerCase();
      const matchKeyword = !keyword || text.includes(keyword);
      const matchTipe = !selectedTipe || item.tipe === selectedTipe;
      return matchKeyword && matchTipe;
    });
  }, [query, selectedTipe, stokKeluar]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari transaksi..."
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              options={tipeOptions}
              placeholder="Tipe"
              onChange={setSelectedTipe}
              defaultValue={selectedTipe}
            />
          </div>
        </div>
        <Link href="/servis/work-order">
          <Button size="md" variant="primary" className="w-full sm:w-auto">
            Buat dari Work Order
          </Button>
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "No",
                  "No. Transaksi",
                  "Tanggal",
                  "Referensi",
                  "Tipe",
                  "Total Item",
                  "Total Nilai",
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
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    <Link
                      href={`/inventory/stok-keluar/${item.id}`}
                      className="text-brand-500 hover:text-brand-600"
                    >
                      {item.noTransaksi}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.tanggal)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-brand-500">
                    {item.referensi || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge size="sm" color={getTipeColor(item.tipe)}>
                      {tipeLabel(item.tipe)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-800 dark:text-white/90">
                    {item.totalItem}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-end text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(item.totalNilai)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {filteredData.length} dari {stokKeluar.length} data
        </p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

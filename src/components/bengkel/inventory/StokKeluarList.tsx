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
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";
import { EyeIcon } from "@/icons";
import Link from "next/link";

interface StokKeluar {
  id: string;
  noTransaksi: string;
  tanggal: string;
  referensi: string;
  tipe: "Servis" | "Penjualan" | "Retur" | "Lainnya";
  totalItem: number;
  totalNilai: number;
}

const stokKeluarData: StokKeluar[] = [
  {
    id: "1",
    noTransaksi: "SK-2024-001",
    tanggal: "30 Apr 2024",
    referensi: "WO-2024-001",
    tipe: "Servis",
    totalItem: 3,
    totalNilai: 155000,
  },
  {
    id: "2",
    noTransaksi: "SK-2024-002",
    tanggal: "30 Apr 2024",
    referensi: "INV-2024-015",
    tipe: "Penjualan",
    totalItem: 2,
    totalNilai: 170000,
  },
  {
    id: "3",
    noTransaksi: "SK-2024-003",
    tanggal: "29 Apr 2024",
    referensi: "WO-2024-003",
    tipe: "Servis",
    totalItem: 5,
    totalNilai: 285000,
  },
  {
    id: "4",
    noTransaksi: "SK-2024-004",
    tanggal: "28 Apr 2024",
    referensi: "RTR-2024-001",
    tipe: "Retur",
    totalItem: 1,
    totalNilai: 65000,
  },
  {
    id: "5",
    noTransaksi: "SK-2024-005",
    tanggal: "27 Apr 2024",
    referensi: "INV-2024-012",
    tipe: "Penjualan",
    totalItem: 4,
    totalNilai: 420000,
  },
];

const tipeOptions = [
  { value: "", label: "Semua Tipe" },
  { value: "Servis", label: "Servis" },
  { value: "Penjualan", label: "Penjualan" },
  { value: "Retur", label: "Retur" },
  { value: "Lainnya", label: "Lainnya" },
];

const getTipeColor = (tipe: StokKeluar["tipe"]) => {
  switch (tipe) {
    case "Servis":
      return "primary";
    case "Penjualan":
      return "success";
    case "Retur":
      return "warning";
    default:
      return "light";
  }
};

export default function StokKeluarList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTipe, setSelectedTipe] = useState("");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari transaksi..."
              className="w-full"
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
          <div className="w-40">
            <Input type="date" className="w-full" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  No. Transaksi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tanggal
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Referensi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tipe
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Total Item
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                >
                  Total Nilai
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {stokKeluarData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {item.noTransaksi}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.tanggal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href="#"
                      className="text-brand-500 hover:text-brand-600 text-theme-sm"
                    >
                      {item.referensi}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={getTipeColor(item.tipe)}>
                      {item.tipe}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm dark:text-white/90">
                    {item.totalItem}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">
                    Rp {item.totalNilai.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <button className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                      <EyeIcon className="size-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan 1-5 dari 5 data
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

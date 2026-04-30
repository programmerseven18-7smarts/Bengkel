"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Pagination from "@/components/tables/Pagination";
import { PlusIcon, EyeIcon } from "@/icons";
import Link from "next/link";

interface StokMasuk {
  id: string;
  noTransaksi: string;
  tanggal: string;
  supplier: string;
  totalItem: number;
  totalNilai: number;
  keterangan: string;
}

const stokMasukData: StokMasuk[] = [
  {
    id: "1",
    noTransaksi: "SM-2024-001",
    tanggal: "30 Apr 2024",
    supplier: "CV Mitra Oli",
    totalItem: 5,
    totalNilai: 3250000,
    keterangan: "Pembelian rutin bulanan",
  },
  {
    id: "2",
    noTransaksi: "SM-2024-002",
    tanggal: "28 Apr 2024",
    supplier: "PT Astra Honda Motor",
    totalItem: 12,
    totalNilai: 5400000,
    keterangan: "Restock sparepart Honda",
  },
  {
    id: "3",
    noTransaksi: "SM-2024-003",
    tanggal: "25 Apr 2024",
    supplier: "PT NGK Busi Indonesia",
    totalItem: 8,
    totalNilai: 1440000,
    keterangan: "Pembelian busi",
  },
  {
    id: "4",
    noTransaksi: "SM-2024-004",
    tanggal: "22 Apr 2024",
    supplier: "CV Maju Jaya Aki",
    totalItem: 3,
    totalNilai: 2800000,
    keterangan: "Pembelian aki",
  },
  {
    id: "5",
    noTransaksi: "SM-2024-005",
    tanggal: "20 Apr 2024",
    supplier: "PT Toyota Astra Motor",
    totalItem: 7,
    totalNilai: 4200000,
    keterangan: "Sparepart Toyota",
  },
];

export default function StokMasukList() {
  const [currentPage, setCurrentPage] = useState(1);

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
            <Input type="date" className="w-full" />
          </div>
        </div>
        <Button
          size="md"
          variant="primary"
          startIcon={<PlusIcon className="size-5" />}
        >
          Tambah Stok Masuk
        </Button>
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
                  Supplier
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
                  Keterangan
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
              {stokMasukData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href={`/inventory/stok-masuk/${item.id}`}
                      className="font-medium text-brand-500 hover:text-brand-600 text-theme-sm"
                    >
                      {item.noTransaksi}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.tanggal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {item.supplier}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm dark:text-white/90">
                    {item.totalItem}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">
                    Rp {item.totalNilai.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-[200px] truncate">
                    {item.keterangan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Link href={`/inventory/stok-masuk/${item.id}`}>
                      <button className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                        <EyeIcon className="size-5" />
                      </button>
                    </Link>
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

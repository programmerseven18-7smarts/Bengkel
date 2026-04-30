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
import Link from "next/link";
import { EyeIcon } from "@/icons";

interface RiwayatItem {
  id: string;
  noWorkOrder: string;
  pelanggan: string;
  kendaraan: string;
  platNomor: string;
  mekanik: string;
  tanggalMasuk: string;
  tanggalSelesai: string;
  totalBiaya: string;
  status: "Selesai" | "Batal";
}

const riwayatData: RiwayatItem[] = [
  {
    id: "1",
    noWorkOrder: "WO-2024-004",
    pelanggan: "Joko Prasetyo",
    kendaraan: "Honda Vario",
    platNomor: "B 5678 DEF",
    mekanik: "Rudi",
    tanggalMasuk: "29 Apr 2024",
    tanggalSelesai: "29 Apr 2024",
    totalBiaya: "Rp 450.000",
    status: "Selesai",
  },
  {
    id: "2",
    noWorkOrder: "WO-2024-005",
    pelanggan: "Dewi Lestari",
    kendaraan: "Suzuki Ertiga",
    platNomor: "B 9012 GHI",
    mekanik: "Dimas",
    tanggalMasuk: "28 Apr 2024",
    tanggalSelesai: "28 Apr 2024",
    totalBiaya: "-",
    status: "Batal",
  },
  {
    id: "3",
    noWorkOrder: "WO-2024-006",
    pelanggan: "Agus Hermawan",
    kendaraan: "Honda CBR 150",
    platNomor: "B 3344 JKL",
    mekanik: "Ahmad",
    tanggalMasuk: "28 Apr 2024",
    tanggalSelesai: "28 Apr 2024",
    totalBiaya: "Rp 180.000",
    status: "Selesai",
  },
  {
    id: "4",
    noWorkOrder: "WO-2024-003",
    pelanggan: "Siti Rahma",
    kendaraan: "Yamaha NMAX",
    platNomor: "F 9921 ZZ",
    mekanik: "Ahmad",
    tanggalMasuk: "27 Apr 2024",
    tanggalSelesai: "27 Apr 2024",
    totalBiaya: "Rp 850.000",
    status: "Selesai",
  },
  {
    id: "5",
    noWorkOrder: "WO-2024-002",
    pelanggan: "Andi Wijaya",
    kendaraan: "Toyota Avanza",
    platNomor: "D 7788 KA",
    mekanik: "Dimas",
    tanggalMasuk: "26 Apr 2024",
    tanggalSelesai: "27 Apr 2024",
    totalBiaya: "Rp 1.250.000",
    status: "Selesai",
  },
];

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "Selesai", label: "Selesai" },
  { value: "Batal", label: "Batal" },
];

export default function RiwayatServis() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari riwayat servis..."
              className="w-full"
            />
          </div>
          <div className="flex gap-3">
            <div className="w-40">
              <Select
                options={statusOptions}
                placeholder="Status"
                onChange={setSelectedStatus}
                defaultValue={selectedStatus}
              />
            </div>
            <div className="w-40">
              <Input type="date" className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  No. Work Order
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Pelanggan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Kendaraan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Mekanik
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tgl. Masuk
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tgl. Selesai
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
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
              {riwayatData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href={`/servis/work-order/${item.id}`}
                      className="font-medium text-brand-500 hover:text-brand-600 text-theme-sm"
                    >
                      {item.noWorkOrder}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {item.pelanggan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="text-gray-800 text-theme-sm dark:text-white/90">
                      {item.kendaraan}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {item.platNomor}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {item.mekanik}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.tanggalMasuk}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.tanggalSelesai}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {item.totalBiaya}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge
                      size="sm"
                      color={item.status === "Selesai" ? "success" : "error"}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Link href={`/servis/work-order/${item.id}`}>
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

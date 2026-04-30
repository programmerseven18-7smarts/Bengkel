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

interface MutasiStok {
  id: string;
  tanggal: string;
  kodeBarang: string;
  namaBarang: string;
  tipe: "Masuk" | "Keluar";
  qty: number;
  satuan: string;
  stokAwal: number;
  stokAkhir: number;
  referensi: string;
  keterangan: string;
}

const mutasiData: MutasiStok[] = [
  {
    id: "1",
    tanggal: "30 Apr 2024 10:30",
    kodeBarang: "SPR-001",
    namaBarang: "Oli Mesin MPX2 1L",
    tipe: "Keluar",
    qty: 1,
    satuan: "Liter",
    stokAwal: 26,
    stokAkhir: 25,
    referensi: "WO-2024-001",
    keterangan: "Pemakaian servis",
  },
  {
    id: "2",
    tanggal: "30 Apr 2024 09:15",
    kodeBarang: "SPR-003",
    namaBarang: "Busi NGK Standard",
    tipe: "Keluar",
    qty: 1,
    satuan: "Pcs",
    stokAwal: 6,
    stokAkhir: 5,
    referensi: "WO-2024-001",
    keterangan: "Pemakaian servis",
  },
  {
    id: "3",
    tanggal: "30 Apr 2024 08:00",
    kodeBarang: "SPR-001",
    namaBarang: "Oli Mesin MPX2 1L",
    tipe: "Masuk",
    qty: 20,
    satuan: "Liter",
    stokAwal: 6,
    stokAkhir: 26,
    referensi: "SM-2024-001",
    keterangan: "Pembelian dari supplier",
  },
  {
    id: "4",
    tanggal: "29 Apr 2024 16:45",
    kodeBarang: "SPR-002",
    namaBarang: "Kampas Rem Depan Honda",
    tipe: "Keluar",
    qty: 1,
    satuan: "Set",
    stokAwal: 9,
    stokAkhir: 8,
    referensi: "INV-2024-015",
    keterangan: "Penjualan langsung",
  },
  {
    id: "5",
    tanggal: "29 Apr 2024 14:20",
    kodeBarang: "SPR-004",
    namaBarang: "Filter Udara Beat",
    tipe: "Keluar",
    qty: 2,
    satuan: "Pcs",
    stokAwal: 3,
    stokAkhir: 1,
    referensi: "WO-2024-003",
    keterangan: "Pemakaian servis",
  },
];

const tipeOptions = [
  { value: "", label: "Semua Tipe" },
  { value: "Masuk", label: "Masuk" },
  { value: "Keluar", label: "Keluar" },
];

export default function MutasiStokList() {
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
              placeholder="Cari barang..."
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
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
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
                  Kode
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nama Barang
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
                  Qty
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Stok Awal
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Stok Akhir
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Referensi
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {mutasiData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.tanggal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {item.kodeBarang}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {item.namaBarang}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge
                      size="sm"
                      color={item.tipe === "Masuk" ? "success" : "error"}
                    >
                      {item.tipe}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span
                      className={`text-theme-sm font-medium ${
                        item.tipe === "Masuk"
                          ? "text-success-600 dark:text-success-500"
                          : "text-error-600 dark:text-error-500"
                      }`}
                    >
                      {item.tipe === "Masuk" ? "+" : "-"}
                      {item.qty} {item.satuan}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {item.stokAwal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm font-medium dark:text-white/90">
                    {item.stokAkhir}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="text-brand-500 text-theme-sm">{item.referensi}</p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {item.keterangan}
                    </p>
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

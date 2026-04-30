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
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";

interface Sparepart {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  supplier: string;
  stok: number;
  satuan: string;
  minStok: number;
  hargaBeli: number;
  hargaJual: number;
}

const sparepartData: Sparepart[] = [
  {
    id: "1",
    kode: "SPR-001",
    nama: "Oli Mesin MPX2 1L",
    kategori: "Oli",
    supplier: "CV Mitra Oli",
    stok: 25,
    satuan: "Liter",
    minStok: 10,
    hargaBeli: 65000,
    hargaJual: 85000,
  },
  {
    id: "2",
    kode: "SPR-002",
    nama: "Kampas Rem Depan Honda",
    kategori: "Rem",
    supplier: "PT Astra Honda Motor",
    stok: 8,
    satuan: "Set",
    minStok: 5,
    hargaBeli: 45000,
    hargaJual: 65000,
  },
  {
    id: "3",
    kode: "SPR-003",
    nama: "Busi NGK Standard",
    kategori: "Kelistrikan",
    supplier: "PT NGK Busi Indonesia",
    stok: 5,
    satuan: "Pcs",
    minStok: 15,
    hargaBeli: 18000,
    hargaJual: 25000,
  },
  {
    id: "4",
    kode: "SPR-004",
    nama: "Filter Udara Beat",
    kategori: "Filter",
    supplier: "PT Astra Honda Motor",
    stok: 1,
    satuan: "Pcs",
    minStok: 8,
    hargaBeli: 35000,
    hargaJual: 45000,
  },
  {
    id: "5",
    kode: "SPR-005",
    nama: "Aki GS 12V 5A",
    kategori: "Kelistrikan",
    supplier: "CV Maju Jaya Aki",
    stok: 0,
    satuan: "Pcs",
    minStok: 3,
    hargaBeli: 280000,
    hargaJual: 350000,
  },
  {
    id: "6",
    kode: "SPR-006",
    nama: "Oli Gardan MPX",
    kategori: "Oli",
    supplier: "CV Mitra Oli",
    stok: 18,
    satuan: "Liter",
    minStok: 5,
    hargaBeli: 45000,
    hargaJual: 60000,
  },
  {
    id: "7",
    kode: "SPR-007",
    nama: "V-Belt Vario",
    kategori: "Transmisi",
    supplier: "PT Astra Honda Motor",
    stok: 12,
    satuan: "Pcs",
    minStok: 5,
    hargaBeli: 120000,
    hargaJual: 150000,
  },
];

const kategoriOptions = [
  { value: "", label: "Semua Kategori" },
  { value: "Oli", label: "Oli" },
  { value: "Rem", label: "Rem" },
  { value: "Kelistrikan", label: "Kelistrikan" },
  { value: "Filter", label: "Filter" },
  { value: "Transmisi", label: "Transmisi" },
];

const getStokStatus = (stok: number, minStok: number) => {
  if (stok === 0) return { label: "Habis", color: "error" as const };
  if (stok < minStok) return { label: "Kritis", color: "warning" as const };
  return { label: "Tersedia", color: "success" as const };
};

export default function SparepartList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKategori, setSelectedKategori] = useState("");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari sparepart..."
              className="w-full"
            />
          </div>
          <div className="w-48">
            <Select
              options={kategoriOptions}
              placeholder="Kategori"
              onChange={setSelectedKategori}
              defaultValue={selectedKategori}
            />
          </div>
        </div>
        <Button
          size="md"
          variant="primary"
          startIcon={<PlusIcon className="size-5" />}
        >
          Tambah Sparepart
        </Button>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
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
                  Kategori
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
                  Stok
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                >
                  Harga Beli
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                >
                  Harga Jual
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
              {sparepartData.map((item) => {
                const status = getStokStatus(item.stok, item.minStok);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                      {item.kode}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {item.nama}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge size="sm" color="light">
                        {item.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.supplier}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      <span className="text-gray-800 text-theme-sm font-medium dark:text-white/90">
                        {item.stok}
                      </span>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400 ml-1">
                        {item.satuan}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm dark:text-white/90">
                      Rp {item.hargaBeli.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">
                      Rp {item.hargaJual.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={status.color}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                          <PencilIcon className="size-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400">
                          <TrashBinIcon className="size-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan 1-7 dari 7 data
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

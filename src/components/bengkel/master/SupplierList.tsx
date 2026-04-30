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
import Pagination from "@/components/tables/Pagination";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";

interface Supplier {
  id: string;
  kode: string;
  nama: string;
  noHp: string;
  email: string;
  alamat: string;
  produk: string;
  totalTransaksi: number;
  status: "Aktif" | "Tidak Aktif";
}

const supplierData: Supplier[] = [
  {
    id: "1",
    kode: "SUP-001",
    nama: "PT Astra Honda Motor",
    noHp: "021-12345678",
    email: "sales@ahm.co.id",
    alamat: "Jl. Gaya Motor Raya, Sunter, Jakarta Utara",
    produk: "Sparepart Honda",
    totalTransaksi: 45,
    status: "Aktif",
  },
  {
    id: "2",
    kode: "SUP-002",
    nama: "PT Toyota Astra Motor",
    noHp: "021-23456789",
    email: "parts@toyota.co.id",
    alamat: "Jl. Yos Sudarso, Sunter, Jakarta Utara",
    produk: "Sparepart Toyota",
    totalTransaksi: 32,
    status: "Aktif",
  },
  {
    id: "3",
    kode: "SUP-003",
    nama: "CV Mitra Oli",
    noHp: "081234567890",
    email: "mitraoli@gmail.com",
    alamat: "Jl. Raya Industri No. 45, Tangerang",
    produk: "Oli & Pelumas",
    totalTransaksi: 78,
    status: "Aktif",
  },
  {
    id: "4",
    kode: "SUP-004",
    nama: "PT NGK Busi Indonesia",
    noHp: "021-34567890",
    email: "sales@ngk.co.id",
    alamat: "Jl. Industri Raya, Cikarang, Bekasi",
    produk: "Busi & Kelistrikan",
    totalTransaksi: 25,
    status: "Aktif",
  },
  {
    id: "5",
    kode: "SUP-005",
    nama: "CV Maju Jaya Aki",
    noHp: "082345678901",
    email: "mjaki@gmail.com",
    alamat: "Jl. Mangga Dua Raya No. 12, Jakarta Pusat",
    produk: "Aki & Baterai",
    totalTransaksi: 18,
    status: "Tidak Aktif",
  },
];

export default function SupplierList() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Cari supplier..."
            className="w-full"
          />
        </div>
        <Button
          size="md"
          variant="primary"
          startIcon={<PlusIcon className="size-5" />}
        >
          Tambah Supplier
        </Button>
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
                  Kode
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nama Supplier
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Kontak
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Produk
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Total Transaksi
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
              {supplierData.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {supplier.kode}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {supplier.nama}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400 max-w-[200px] truncate">
                      {supplier.alamat}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="text-gray-800 text-theme-sm dark:text-white/90">
                      {supplier.noHp}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {supplier.email}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {supplier.produk}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm font-medium dark:text-white/90">
                    {supplier.totalTransaksi}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge
                      size="sm"
                      color={supplier.status === "Aktif" ? "success" : "light"}
                    >
                      {supplier.status}
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

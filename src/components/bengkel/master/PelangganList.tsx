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
import { PlusIcon, PencilIcon, TrashBinIcon, EyeIcon } from "@/icons";
import Link from "next/link";

interface Pelanggan {
  id: string;
  kode: string;
  nama: string;
  noHp: string;
  email: string;
  alamat: string;
  totalKendaraan: number;
  totalServis: number;
  status: "Aktif" | "Tidak Aktif";
}

const pelangganData: Pelanggan[] = [
  {
    id: "1",
    kode: "PLG-001",
    nama: "Budi Santoso",
    noHp: "081234567890",
    email: "budi@email.com",
    alamat: "Jl. Merdeka No. 123, Jakarta Selatan",
    totalKendaraan: 2,
    totalServis: 8,
    status: "Aktif",
  },
  {
    id: "2",
    kode: "PLG-002",
    nama: "Andi Wijaya",
    noHp: "082345678901",
    email: "andi@email.com",
    alamat: "Jl. Sudirman No. 45, Bandung",
    totalKendaraan: 1,
    totalServis: 3,
    status: "Aktif",
  },
  {
    id: "3",
    kode: "PLG-003",
    nama: "Siti Rahma",
    noHp: "083456789012",
    email: "siti@email.com",
    alamat: "Jl. Gatot Subroto No. 67, Jakarta Pusat",
    totalKendaraan: 1,
    totalServis: 5,
    status: "Aktif",
  },
  {
    id: "4",
    kode: "PLG-004",
    nama: "Joko Prasetyo",
    noHp: "084567890123",
    email: "joko@email.com",
    alamat: "Jl. Asia Afrika No. 89, Bandung",
    totalKendaraan: 3,
    totalServis: 12,
    status: "Aktif",
  },
  {
    id: "5",
    kode: "PLG-005",
    nama: "Dewi Lestari",
    noHp: "085678901234",
    email: "dewi@email.com",
    alamat: "Jl. Pemuda No. 10, Semarang",
    totalKendaraan: 1,
    totalServis: 1,
    status: "Tidak Aktif",
  },
];

export default function PelangganList() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Cari pelanggan..."
            className="w-full"
          />
        </div>
        <Button
          size="md"
          variant="primary"
          startIcon={<PlusIcon className="size-5" />}
        >
          Tambah Pelanggan
        </Button>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {pelangganData.map((pelanggan) => (
            <div key={pelanggan.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {pelanggan.nama}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {pelanggan.kode}
                  </p>
                </div>
                <Badge
                  size="sm"
                  color={pelanggan.status === "Aktif" ? "success" : "light"}
                >
                  {pelanggan.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">No. HP</span>
                  <span className="text-gray-800 dark:text-white/90">{pelanggan.noHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Email</span>
                  <span className="text-gray-800 dark:text-white/90">{pelanggan.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Kendaraan</span>
                  <span className="text-gray-800 dark:text-white/90">{pelanggan.totalKendaraan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Servis</span>
                  <span className="text-gray-800 dark:text-white/90">{pelanggan.totalServis}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Alamat</span>
                  <p className="text-gray-800 dark:text-white/90 mt-1">{pelanggan.alamat}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.05]">
                <Link
                  href={`/master/pelanggan/${pelanggan.id}`}
                  className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400"
                >
                  <EyeIcon className="size-5" />
                </Link>
                <button className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
                  <PencilIcon className="size-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400">
                  <TrashBinIcon className="size-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Kode
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Nama
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  No. HP
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Alamat
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                  Kendaraan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                  Total Servis
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {pelangganData.map((pelanggan) => (
                <TableRow key={pelanggan.id}>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {pelanggan.kode}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {pelanggan.nama}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {pelanggan.email}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {pelanggan.noHp}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-[200px] truncate">
                    {pelanggan.alamat}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm dark:text-white/90">
                    {pelanggan.totalKendaraan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm dark:text-white/90">
                    {pelanggan.totalServis}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge
                      size="sm"
                      color={pelanggan.status === "Aktif" ? "success" : "light"}
                    >
                      {pelanggan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/master/pelanggan/${pelanggan.id}`}
                        className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                      >
                        <EyeIcon className="size-5" />
                      </Link>
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

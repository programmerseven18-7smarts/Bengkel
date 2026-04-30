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
import Image from "next/image";

interface Mekanik {
  id: string;
  kode: string;
  nama: string;
  noHp: string;
  spesialisasi: string;
  tanggalBergabung: string;
  totalServis: number;
  rating: number;
  status: "Aktif" | "Tidak Aktif" | "Cuti";
  foto: string;
}

const mekanikData: Mekanik[] = [
  {
    id: "1",
    kode: "MEK-001",
    nama: "Rudi Hartono",
    noHp: "081234567890",
    spesialisasi: "Motor Honda",
    tanggalBergabung: "15 Jan 2022",
    totalServis: 245,
    rating: 4.8,
    status: "Aktif",
    foto: "/images/user/user-17.jpg",
  },
  {
    id: "2",
    kode: "MEK-002",
    nama: "Dimas Prasetyo",
    noHp: "082345678901",
    spesialisasi: "Mobil Toyota",
    tanggalBergabung: "20 Mar 2022",
    totalServis: 198,
    rating: 4.6,
    status: "Aktif",
    foto: "/images/user/user-18.jpg",
  },
  {
    id: "3",
    kode: "MEK-003",
    nama: "Ahmad Hidayat",
    noHp: "083456789012",
    spesialisasi: "Motor Yamaha",
    tanggalBergabung: "05 Jun 2023",
    totalServis: 156,
    rating: 4.9,
    status: "Aktif",
    foto: "/images/user/user-20.jpg",
  },
  {
    id: "4",
    kode: "MEK-004",
    nama: "Bambang Suryanto",
    noHp: "084567890123",
    spesialisasi: "Kelistrikan",
    tanggalBergabung: "10 Sep 2021",
    totalServis: 312,
    rating: 4.7,
    status: "Cuti",
    foto: "/images/user/user-21.jpg",
  },
];

const StarIcon = () => (
  <svg className="size-4 fill-current text-warning-500" viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

export default function MekanikList() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:w-64">
          <Input type="text" placeholder="Cari mekanik..." className="w-full" />
        </div>
        <Button size="md" variant="primary" startIcon={<PlusIcon className="size-5" />}>
          Tambah Mekanik
        </Button>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {mekanikData.map((mekanik) => (
            <div key={mekanik.id} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 overflow-hidden rounded-full flex-shrink-0">
                  <Image width={48} height={48} src={mekanik.foto} alt={mekanik.nama} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90">{mekanik.nama}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{mekanik.kode}</p>
                    </div>
                    <Badge
                      size="sm"
                      color={mekanik.status === "Aktif" ? "success" : mekanik.status === "Cuti" ? "warning" : "light"}
                    >
                      {mekanik.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">No. HP</span>
                  <span className="text-gray-800 dark:text-white/90">{mekanik.noHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Spesialisasi</span>
                  <span className="text-gray-800 dark:text-white/90">{mekanik.spesialisasi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Bergabung</span>
                  <span className="text-gray-800 dark:text-white/90">{mekanik.tanggalBergabung}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Servis</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">{mekanik.totalServis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Rating</span>
                  <span className="inline-flex items-center gap-1">
                    <StarIcon />
                    <span className="font-medium text-gray-800 dark:text-white/90">{mekanik.rating}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.05]">
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Mekanik</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No. HP</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Spesialisasi</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Bergabung</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Total Servis</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Rating</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {mekanikData.map((mekanik) => (
                <TableRow key={mekanik.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image width={40} height={40} src={mekanik.foto} alt={mekanik.nama} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{mekanik.nama}</p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">{mekanik.kode}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">{mekanik.noHp}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{mekanik.spesialisasi}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{mekanik.tanggalBergabung}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm font-medium dark:text-white/90">{mekanik.totalServis}</TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1">
                      <StarIcon />
                      <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">{mekanik.rating}</span>
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={mekanik.status === "Aktif" ? "success" : mekanik.status === "Cuti" ? "warning" : "light"}>
                      {mekanik.status}
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
        <p className="text-sm text-gray-500 dark:text-gray-400">Menampilkan 1-4 dari 4 data</p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

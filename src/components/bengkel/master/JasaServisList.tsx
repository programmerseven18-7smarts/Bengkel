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

interface JasaServis {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  harga: number;
  estimasiWaktu: string;
  deskripsi: string;
  status: "Aktif" | "Tidak Aktif";
}

const jasaServisData: JasaServis[] = [
  {
    id: "1",
    kode: "JSV-001",
    nama: "Ganti Oli",
    kategori: "Perawatan Rutin",
    harga: 50000,
    estimasiWaktu: "30 menit",
    deskripsi: "Penggantian oli mesin",
    status: "Aktif",
  },
  {
    id: "2",
    kode: "JSV-002",
    nama: "Tune Up",
    kategori: "Perawatan Rutin",
    harga: 150000,
    estimasiWaktu: "1-2 jam",
    deskripsi: "Tune up mesin standar",
    status: "Aktif",
  },
  {
    id: "3",
    kode: "JSV-003",
    nama: "Servis Rem",
    kategori: "Rem",
    harga: 75000,
    estimasiWaktu: "1 jam",
    deskripsi: "Servis dan penyetelan rem",
    status: "Aktif",
  },
  {
    id: "4",
    kode: "JSV-004",
    nama: "Ganti Ban",
    kategori: "Ban",
    harga: 25000,
    estimasiWaktu: "30 menit",
    deskripsi: "Pemasangan ban baru",
    status: "Aktif",
  },
  {
    id: "5",
    kode: "JSV-005",
    nama: "Cek Kelistrikan",
    kategori: "Kelistrikan",
    harga: 75000,
    estimasiWaktu: "1 jam",
    deskripsi: "Pengecekan sistem kelistrikan",
    status: "Aktif",
  },
  {
    id: "6",
    kode: "JSV-006",
    nama: "Service AC",
    kategori: "AC",
    harga: 250000,
    estimasiWaktu: "2-3 jam",
    deskripsi: "Service AC mobil lengkap",
    status: "Aktif",
  },
  {
    id: "7",
    kode: "JSV-007",
    nama: "Spooring Balancing",
    kategori: "Ban",
    harga: 150000,
    estimasiWaktu: "1 jam",
    deskripsi: "Penyetelan spooring dan balancing",
    status: "Tidak Aktif",
  },
];

const kategoriOptions = [
  { value: "", label: "Semua Kategori" },
  { value: "Perawatan Rutin", label: "Perawatan Rutin" },
  { value: "Rem", label: "Rem" },
  { value: "Ban", label: "Ban" },
  { value: "Kelistrikan", label: "Kelistrikan" },
  { value: "AC", label: "AC" },
];

export default function JasaServisList() {
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
              placeholder="Cari jasa servis..."
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
          Tambah Jasa
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
                  Nama Jasa
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Kategori
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                >
                  Harga
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Est. Waktu
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
              {jasaServisData.map((jasa) => (
                <TableRow key={jasa.id}>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {jasa.kode}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {jasa.nama}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {jasa.deskripsi}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge size="sm" color="light">
                      {jasa.kategori}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">
                    Rp {jasa.harga.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {jasa.estimasiWaktu}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge
                      size="sm"
                      color={jasa.status === "Aktif" ? "success" : "light"}
                    >
                      {jasa.status}
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

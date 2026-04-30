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
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";
import { PlusIcon, PencilIcon, TrashBinIcon, EyeIcon } from "@/icons";
import Link from "next/link";

interface Kendaraan {
  id: string;
  platNomor: string;
  merk: string;
  tipe: string;
  tahun: string;
  warna: string;
  noRangka: string;
  noMesin: string;
  pemilik: string;
  totalServis: number;
}

const kendaraanData: Kendaraan[] = [
  {
    id: "1",
    platNomor: "B 1234 ABC",
    merk: "Honda",
    tipe: "Beat",
    tahun: "2022",
    warna: "Merah",
    noRangka: "MH1JFZ11XNK123456",
    noMesin: "JFZ1E-1234567",
    pemilik: "Budi Santoso",
    totalServis: 5,
  },
  {
    id: "2",
    platNomor: "D 7788 KA",
    merk: "Toyota",
    tipe: "Avanza",
    tahun: "2020",
    warna: "Putih",
    noRangka: "MHF1JE4G4LK654321",
    noMesin: "1NRF-K543210",
    pemilik: "Andi Wijaya",
    totalServis: 3,
  },
  {
    id: "3",
    platNomor: "F 9921 ZZ",
    merk: "Yamaha",
    tipe: "NMAX",
    tahun: "2023",
    warna: "Hitam",
    noRangka: "MH3SG5310PJ789012",
    noMesin: "G3X1E-0987654",
    pemilik: "Siti Rahma",
    totalServis: 2,
  },
  {
    id: "4",
    platNomor: "B 5678 DEF",
    merk: "Honda",
    tipe: "Vario",
    tahun: "2021",
    warna: "Biru",
    noRangka: "MH1JFZ22XMK345678",
    noMesin: "JFZ2E-7654321",
    pemilik: "Joko Prasetyo",
    totalServis: 8,
  },
  {
    id: "5",
    platNomor: "B 9012 GHI",
    merk: "Suzuki",
    tipe: "Ertiga",
    tahun: "2019",
    warna: "Silver",
    noRangka: "MHYESL41SKJ567890",
    noMesin: "K14B-1357924",
    pemilik: "Dewi Lestari",
    totalServis: 1,
  },
];

const merkOptions = [
  { value: "", label: "Semua Merk" },
  { value: "Honda", label: "Honda" },
  { value: "Toyota", label: "Toyota" },
  { value: "Yamaha", label: "Yamaha" },
  { value: "Suzuki", label: "Suzuki" },
];

export default function KendaraanList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMerk, setSelectedMerk] = useState("");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input type="text" placeholder="Cari kendaraan..." className="w-full" />
          </div>
          <div className="w-full sm:w-40">
            <Select options={merkOptions} placeholder="Merk" onChange={setSelectedMerk} defaultValue={selectedMerk} />
          </div>
        </div>
        <Button size="md" variant="primary" startIcon={<PlusIcon className="size-5" />}>
          Tambah Kendaraan
        </Button>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {kendaraanData.map((kendaraan) => (
            <div key={kendaraan.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">{kendaraan.platNomor}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{kendaraan.merk} {kendaraan.tipe}</p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{kendaraan.tahun}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Warna</span>
                  <span className="text-gray-800 dark:text-white/90">{kendaraan.warna}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Pemilik</span>
                  <span className="text-gray-800 dark:text-white/90">{kendaraan.pemilik}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Servis</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">{kendaraan.totalServis}x</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">No. Rangka</span>
                  <p className="font-mono text-xs text-gray-800 dark:text-white/90 mt-1">{kendaraan.noRangka}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.05]">
                <Link href={`/master/kendaraan/${kendaraan.id}`} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Plat Nomor</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Merk / Tipe</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tahun</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Warna</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No. Rangka</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Pemilik</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Total Servis</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {kendaraanData.map((kendaraan) => (
                <TableRow key={kendaraan.id}>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">{kendaraan.platNomor}</TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{kendaraan.merk} {kendaraan.tipe}</p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{kendaraan.tahun}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{kendaraan.warna}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-xs font-mono dark:text-gray-400">{kendaraan.noRangka}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">{kendaraan.pemilik}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm dark:text-white/90">{kendaraan.totalServis}</TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <Link href={`/master/kendaraan/${kendaraan.id}`} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
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
        <p className="text-sm text-gray-500 dark:text-gray-400">Menampilkan 1-5 dari 5 data</p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

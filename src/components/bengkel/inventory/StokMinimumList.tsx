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

interface StokMinimum {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  supplier: string;
  stok: number;
  satuan: string;
  minStok: number;
  selisih: number;
  hargaBeli: number;
}

const stokMinimumData: StokMinimum[] = [
  {
    id: "1",
    kode: "SPR-005",
    nama: "Aki GS 12V 5A",
    kategori: "Kelistrikan",
    supplier: "CV Maju Jaya Aki",
    stok: 0,
    satuan: "Pcs",
    minStok: 3,
    selisih: 3,
    hargaBeli: 280000,
  },
  {
    id: "2",
    kode: "SPR-004",
    nama: "Filter Udara Beat",
    kategori: "Filter",
    supplier: "PT Astra Honda Motor",
    stok: 1,
    satuan: "Pcs",
    minStok: 8,
    selisih: 7,
    hargaBeli: 35000,
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
    selisih: 10,
    hargaBeli: 18000,
  },
  {
    id: "4",
    kode: "SPR-002",
    nama: "Kampas Rem Depan Honda",
    kategori: "Rem",
    supplier: "PT Astra Honda Motor",
    stok: 8,
    satuan: "Set",
    minStok: 10,
    selisih: 2,
    hargaBeli: 45000,
  },
];

export default function StokMinimumList() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalNilai = stokMinimumData.reduce(
    (acc, item) => acc + item.selisih * item.hargaBeli,
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-error-200 bg-error-50 p-5 dark:border-error-500/30 dark:bg-error-500/10">
          <p className="text-sm text-error-600 dark:text-error-400">
            Barang Stok Habis
          </p>
          <p className="text-2xl font-bold text-error-700 dark:text-error-300 mt-1">
            {stokMinimumData.filter((item) => item.stok === 0).length} Item
          </p>
        </div>
        <div className="rounded-2xl border border-warning-200 bg-warning-50 p-5 dark:border-warning-500/30 dark:bg-warning-500/10">
          <p className="text-sm text-warning-600 dark:text-warning-400">
            Barang Stok Kritis
          </p>
          <p className="text-2xl font-bold text-warning-700 dark:text-warning-300 mt-1">
            {stokMinimumData.filter((item) => item.stok > 0).length} Item
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Estimasi Nilai Restock
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-1">
            Rp {totalNilai.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari barang..."
              className="w-full"
            />
          </div>
          <Button size="md" variant="primary">
            Buat Purchase Order
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
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                  >
                    Min. Stok
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                  >
                    Kekurangan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {stokMinimumData.map((item) => (
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
                      <span
                        className={`text-theme-sm font-bold ${
                          item.stok === 0
                            ? "text-error-600 dark:text-error-500"
                            : "text-warning-600 dark:text-warning-500"
                        }`}
                      >
                        {item.stok}
                      </span>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400 ml-1">
                        {item.satuan}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {item.minStok} {item.satuan}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-error-600 text-center text-theme-sm font-medium dark:text-error-500">
                      -{item.selisih} {item.satuan}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={item.stok === 0 ? "error" : "warning"}
                      >
                        {item.stok === 0 ? "Habis" : "Kritis"}
                      </Badge>
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
            Menampilkan 1-4 dari 4 data
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

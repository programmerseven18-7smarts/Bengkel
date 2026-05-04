"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

export interface StokKritisRow {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  stokSaatIni: number;
  stokMinimum: number;
  satuan: string;
}

interface StokKritisTableProps {
  stokKritis: StokKritisRow[];
}

export default function StokKritisTable({
  stokKritis,
}: StokKritisTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Stok Hampir Habis
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sparepart dengan stok di bawah minimum
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inventory/stok-minimum"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Lihat Semua
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              {["No", "Kode", "Nama Barang", "Kategori", "Stok", "Min. Stok", "Status"].map(
                (header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {stokKritis.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="py-3 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                  {item.kodeBarang}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  {item.namaBarang}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {item.kategori}
                </TableCell>
                <TableCell className="py-3 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                  {item.stokSaatIni} {item.satuan}
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {item.stokMinimum} {item.satuan}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={item.stokSaatIni === 0 ? "error" : "warning"}
                  >
                    {item.stokSaatIni === 0 ? "Habis" : "Kritis"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {stokKritis.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-theme-sm text-gray-500 dark:text-gray-400"
                >
                  Tidak ada stok kritis.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

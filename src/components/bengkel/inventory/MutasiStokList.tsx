"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Pagination from "@/components/tables/Pagination";

export type MutasiStokRow = {
  id: string;
  noMutasi: string;
  tanggal: string;
  lokasiAsal: string;
  lokasiTujuan: string;
  penanggungJawab: string;
  totalQty: number;
  totalItem: number;
  catatan: string;
};

type MutasiStokListProps = {
  mutasi: MutasiStokRow[];
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function MutasiStokList({ mutasi }: MutasiStokListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return mutasi;

    return mutasi.filter((item) =>
      `${item.noMutasi} ${item.lokasiAsal} ${item.lokasiTujuan} ${item.penanggungJawab} ${item.catatan}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [mutasi, query]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Cari mutasi..."
            className="w-full"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Link href="/inventory/mutasi/create">
          <Button size="md" variant="primary" className="w-full sm:w-auto">
            Buat Mutasi
          </Button>
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[920px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "No",
                  "No. Mutasi",
                  "Tanggal",
                  "Lokasi Asal",
                  "Lokasi Tujuan",
                  "Total Item",
                  "Total Qty",
                  "Penanggung Jawab",
                  "Catatan",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {item.noMutasi}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.tanggal)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.lokasiAsal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.lokasiTujuan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-800 dark:text-white/90">
                    {item.totalItem}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm font-medium text-brand-600 dark:text-brand-400">
                    {item.totalQty}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {item.penanggungJawab || "-"}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {item.catatan || "-"}
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Belum ada mutasi stok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {filteredData.length} dari {mutasi.length} data
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

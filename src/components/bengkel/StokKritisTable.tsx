"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";

interface StokItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  stokSaatIni: number;
  stokMinimum: number;
  satuan: string;
}

const stokKritis: StokItem[] = [
  {
    id: "1",
    kodeBarang: "SPR-001",
    namaBarang: "Oli Mesin MPX2",
    kategori: "Oli",
    stokSaatIni: 3,
    stokMinimum: 10,
    satuan: "Liter",
  },
  {
    id: "2",
    kodeBarang: "SPR-002",
    namaBarang: "Kampas Rem Depan",
    kategori: "Rem",
    stokSaatIni: 2,
    stokMinimum: 5,
    satuan: "Set",
  },
  {
    id: "3",
    kodeBarang: "SPR-003",
    namaBarang: "Busi NGK",
    kategori: "Kelistrikan",
    stokSaatIni: 5,
    stokMinimum: 15,
    satuan: "Pcs",
  },
  {
    id: "4",
    kodeBarang: "SPR-004",
    namaBarang: "Filter Udara",
    kategori: "Filter",
    stokSaatIni: 1,
    stokMinimum: 8,
    satuan: "Pcs",
  },
  {
    id: "5",
    kodeBarang: "SPR-005",
    namaBarang: "Aki GS 12V",
    kategori: "Kelistrikan",
    stokSaatIni: 0,
    stokMinimum: 3,
    satuan: "Pcs",
  },
];

export default function StokKritisTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Stok Hampir Habis
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Barang dengan stok di bawah minimum
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
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Kode
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nama Barang
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Kategori
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Stok
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Min. Stok
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {stokKritis.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {item.kodeBarang}
                </TableCell>
                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                  {item.namaBarang}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.kategori}
                </TableCell>
                <TableCell className="py-3 text-gray-800 font-medium text-theme-sm dark:text-white/90">
                  {item.stokSaatIni} {item.satuan}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

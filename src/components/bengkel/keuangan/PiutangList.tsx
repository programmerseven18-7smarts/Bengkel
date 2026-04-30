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
import Link from "next/link";

interface PiutangItem {
  id: string;
  noInvoice: string;
  tanggal: string;
  jatuhTempo: string;
  pelanggan: string;
  pelangganId: string;
  noHp: string;
  totalTagihan: number;
  terbayar: number;
  sisaPiutang: number;
  status: "Belum Lunas" | "Sebagian" | "Jatuh Tempo";
}

const piutangData: PiutangItem[] = [
  {
    id: "1",
    noInvoice: "INV-2024-032",
    tanggal: "2024-01-05",
    jatuhTempo: "2024-01-20",
    pelanggan: "Andi Wijaya",
    pelangganId: "2",
    noHp: "082345678901",
    totalTagihan: 450000,
    terbayar: 0,
    sisaPiutang: 450000,
    status: "Jatuh Tempo",
  },
  {
    id: "2",
    noInvoice: "INV-2024-025",
    tanggal: "2024-01-02",
    jatuhTempo: "2024-01-17",
    pelanggan: "Raka Pratama",
    pelangganId: "4",
    noHp: "084567890123",
    totalTagihan: 375000,
    terbayar: 200000,
    sisaPiutang: 175000,
    status: "Sebagian",
  },
  {
    id: "3",
    noInvoice: "INV-2024-048",
    tanggal: "2024-01-12",
    jatuhTempo: "2024-01-27",
    pelanggan: "Doni Saputra",
    pelangganId: "5",
    noHp: "085678901234",
    totalTagihan: 285000,
    terbayar: 0,
    sisaPiutang: 285000,
    status: "Belum Lunas",
  },
];

const getStatusColor = (status: PiutangItem["status"]) => {
  switch (status) {
    case "Jatuh Tempo":
      return "error";
    case "Sebagian":
      return "warning";
    case "Belum Lunas":
      return "light";
    default:
      return "light";
  }
};

export default function PiutangList() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPiutang = piutangData.reduce((acc, item) => acc + item.sisaPiutang, 0);
  const piutangJatuhTempo = piutangData
    .filter((item) => item.status === "Jatuh Tempo")
    .reduce((acc, item) => acc + item.sisaPiutang, 0);
  const jumlahPelanggan = new Set(piutangData.map((item) => item.pelangganId)).size;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Piutang</p>
          <p className="text-2xl font-bold text-error-500 mt-1">
            Rp {totalPiutang.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Piutang Jatuh Tempo</p>
          <p className="text-2xl font-bold text-warning-500 mt-1">
            Rp {piutangJatuhTempo.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Jumlah Pelanggan</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-1">
            {jumlahPelanggan} orang
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari pelanggan..."
              className="w-full"
            />
          </div>
          <Button size="md" variant="outline">
            Export
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    No. Invoice
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tanggal
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Jatuh Tempo
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Pelanggan
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Total Tagihan
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Terbayar
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Sisa Piutang
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
                {piutangData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <Link
                        href={`/keuangan/invoice/${item.id}`}
                        className="text-brand-500 hover:text-brand-600 font-medium text-theme-sm"
                      >
                        {item.noInvoice}
                      </Link>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <span className={item.status === "Jatuh Tempo" ? "text-error-500 font-medium" : "text-gray-500 dark:text-gray-400"}>
                        {new Date(item.jatuhTempo).toLocaleDateString("id-ID")}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Link
                        href={`/master/pelanggan/${item.pelangganId}`}
                        className="text-gray-800 hover:text-brand-500 text-theme-sm dark:text-white/90"
                      >
                        {item.pelanggan}
                      </Link>
                      <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {item.noHp}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm dark:text-white/90">
                      Rp {item.totalTagihan.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-success-500 text-end text-theme-sm">
                      Rp {item.terbayar.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-error-500 text-end text-theme-sm font-medium">
                      Rp {item.sisaPiutang.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Button size="sm" variant="primary">
                        Bayar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-white/[0.05] sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan 1-3 dari 3 data
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

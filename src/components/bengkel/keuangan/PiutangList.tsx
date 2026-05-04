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
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Pagination from "@/components/tables/Pagination";

type PiutangStatus = "BELUM_LUNAS" | "SEBAGIAN" | "JATUH_TEMPO" | "LUNAS";

export interface PiutangRow {
  id: string;
  invoiceId: string;
  noInvoice: string;
  tanggal: string;
  jatuhTempo: string | null;
  pelanggan: string;
  pelangganId: string;
  noHp: string;
  totalTagihan: number;
  terbayar: number;
  sisaPiutang: number;
  status: PiutangStatus;
}

interface PiutangListProps {
  piutang: PiutangRow[];
}

const statusLabel = (status: PiutangStatus) => {
  switch (status) {
    case "BELUM_LUNAS":
      return "Belum Lunas";
    case "SEBAGIAN":
      return "Sebagian";
    case "JATUH_TEMPO":
      return "Jatuh Tempo";
    case "LUNAS":
      return "Lunas";
  }
};

const getStatusColor = (status: PiutangStatus) => {
  switch (status) {
    case "JATUH_TEMPO":
      return "error";
    case "SEBAGIAN":
      return "warning";
    case "LUNAS":
      return "success";
    case "BELUM_LUNAS":
      return "light";
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function PiutangList({ piutang }: PiutangListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return piutang.filter((item) => {
      const text =
        `${item.noInvoice} ${item.pelanggan} ${item.noHp}`.toLowerCase();
      return !keyword || text.includes(keyword);
    });
  }, [piutang, query]);
  const totalPiutang = filteredData.reduce(
    (acc, item) => acc + item.sisaPiutang,
    0
  );
  const piutangJatuhTempo = filteredData
    .filter((item) => item.status === "JATUH_TEMPO")
    .reduce((acc, item) => acc + item.sisaPiutang, 0);
  const jumlahPelanggan = new Set(
    filteredData.map((item) => item.pelangganId)
  ).size;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Piutang" value={formatCurrency(totalPiutang)} tone="error" />
        <SummaryCard
          label="Piutang Jatuh Tempo"
          value={formatCurrency(piutangJatuhTempo)}
          tone="warning"
        />
        <SummaryCard label="Jumlah Pelanggan" value={`${jumlahPelanggan} orang`} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari pelanggan..."
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
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
                  {[
                    "No",
                    "No. Invoice",
                    "Tanggal",
                    "Jatuh Tempo",
                    "Pelanggan",
                    "Total Tagihan",
                    "Terbayar",
                    "Sisa Piutang",
                    "Status",
                    "Aksi",
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
                    <TableCell className="px-5 py-4">
                      <Link
                        href={`/keuangan/invoice/${item.invoiceId}`}
                        className="font-medium text-brand-500 hover:text-brand-600 text-theme-sm"
                      >
                        {item.noInvoice}
                      </Link>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.tanggal)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                      <span
                        className={
                          item.status === "JATUH_TEMPO"
                            ? "font-medium text-error-500"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      >
                        {formatDate(item.jatuhTempo)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Link
                        href={`/master/pelanggan/${item.pelangganId}`}
                        className="text-gray-800 hover:text-brand-500 text-theme-sm dark:text-white/90"
                      >
                        {item.pelanggan}
                      </Link>
                      <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {item.noHp || "-"}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-end text-theme-sm text-gray-800 dark:text-white/90">
                      {formatCurrency(item.totalTagihan)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-end text-theme-sm text-success-500">
                      {formatCurrency(item.terbayar)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-end text-theme-sm font-medium text-error-500">
                      {formatCurrency(item.sisaPiutang)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge size="sm" color={getStatusColor(item.status)}>
                        {statusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Link href="/keuangan/invoice">
                        <Button size="sm" variant="primary" disabled={item.sisaPiutang <= 0}>
                          Bayar
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-white/[0.05] sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {filteredData.length} dari {piutang.length} data
          </p>
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "error" | "warning";
}) {
  const colorClass =
    tone === "error"
      ? "text-error-500"
      : tone === "warning"
      ? "text-warning-500"
      : "text-gray-800 dark:text-white/90";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

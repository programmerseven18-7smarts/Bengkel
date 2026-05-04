"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { createKasBankManualAction } from "@/lib/keuangan/actions";

export interface AkunKasBankSummary {
  id: string;
  kode: string;
  nama: string;
  tipe: string;
  saldo: number;
}

export interface KasBankTransactionRow {
  id: string;
  noTransaksi: string;
  tanggal: string;
  jenis: "MASUK" | "KELUAR";
  kategori: string;
  deskripsi: string;
  jumlah: number;
  akun: string;
  akunId: string;
  saldoAkhir: number;
}

interface KasBankListProps {
  akunSummary: AkunKasBankSummary[];
  transactions: KasBankTransactionRow[];
}

const getJenisBadge = (jenis: KasBankTransactionRow["jenis"]) => (
  <Badge color={jenis === "MASUK" ? "success" : "error"}>
    {jenis === "MASUK" ? "Masuk" : "Keluar"}
  </Badge>
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getInitial = (value: string) => value.trim().slice(0, 2).toUpperCase();

export default function KasBankList({
  akunSummary,
  transactions,
}: KasBankListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [akunFilter, setAkunFilter] = useState("Semua");
  const [manualModal, setManualModal] = useState<"MASUK" | "KELUAR" | null>(null);

  const filteredData = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return transactions.filter((item) => {
      const matchSearch =
        !keyword ||
        `${item.noTransaksi} ${item.deskripsi} ${item.kategori} ${item.akun}`
          .toLowerCase()
          .includes(keyword);
      const matchJenis = jenisFilter === "Semua" || item.jenis === jenisFilter;
      const matchAkun = akunFilter === "Semua" || item.akunId === akunFilter;

      return matchSearch && matchJenis && matchAkun;
    });
  }, [akunFilter, jenisFilter, searchTerm, transactions]);

  const totalSaldo = akunSummary.reduce((total, item) => total + item.saldo, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Saldo
          </p>
          <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
            {formatCurrency(totalSaldo)}
          </p>
        </div>
        {akunSummary.map((akun) => (
          <div
            key={akun.id}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {akun.nama}
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
                  {formatCurrency(akun.saldo)}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {akun.kode} | {akun.tipe}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                {getInitial(akun.nama)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Transaksi Kas & Bank
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Riwayat transaksi dari pembayaran dan arus kas bengkel
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setManualModal("MASUK")}>
              Kas Masuk
            </Button>
            <Button size="sm" variant="outline" onClick={() => setManualModal("KELUAR")}>
              Kas Keluar
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800 lg:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              className="rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
            >
              <option value="Semua">Semua Jenis</option>
              <option value="MASUK">Kas Masuk</option>
              <option value="KELUAR">Kas Keluar</option>
            </select>
            <select
              className="rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
              value={akunFilter}
              onChange={(e) => setAkunFilter(e.target.value)}
            >
              <option value="Semua">Semua Akun</option>
              {akunSummary.map((akun) => (
                <option key={akun.id} value={akun.id}>
                  {akun.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-800">
              <TableRow>
                {[
                  "No",
                  "No. Transaksi",
                  "Tanggal",
                  "Jenis",
                  "Kategori",
                  "Deskripsi",
                  "Jumlah",
                  "Akun",
                  "Saldo Akhir",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {item.noTransaksi}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(item.tanggal)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getJenisBadge(item.jenis)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                    {item.kategori}
                  </TableCell>
                  <TableCell className="max-w-[280px] px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="line-clamp-2">{item.deskripsi || "-"}</span>
                  </TableCell>
                  <TableCell
                    className={`px-6 py-4 text-right text-sm font-semibold ${
                      item.jenis === "MASUK"
                        ? "text-success-600 dark:text-success-400"
                        : "text-error-600 dark:text-error-400"
                    }`}
                  >
                    {item.jenis === "MASUK" ? "+" : "-"}
                    {formatCurrency(item.jumlah)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.akun}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(item.saldoAkhir)}
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Belum ada transaksi kas & bank.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {filteredData.length} dari {transactions.length}{" "}
            transaksi
          </p>
        </div>
      </div>

      {manualModal && (
        <KasManualModal
          jenis={manualModal}
          akunSummary={akunSummary}
          onClose={() => setManualModal(null)}
        />
      )}
    </div>
  );
}

function KasManualModal({
  jenis,
  akunSummary,
  onClose,
}: {
  jenis: "MASUK" | "KELUAR";
  akunSummary: AkunKasBankSummary[];
  onClose: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const kategoriOptions =
    jenis === "MASUK"
      ? ["Modal Awal", "Pendapatan Lainnya", "Setoran Pemilik", "Penyesuaian Kas"]
      : ["Operasional", "Gaji Karyawan", "Utilitas", "Pembelian Non PO", "Penyesuaian Kas"];

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {jenis === "MASUK" ? "Kas Masuk" : "Kas Keluar"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Catat transaksi kas bank manual.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
          >
            Tutup
          </button>
        </div>
        <form action={createKasBankManualAction} className="space-y-4 p-5">
          <input type="hidden" name="jenis" value={jenis} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tanggal
              </label>
              <input
                name="tanggal"
                type="date"
                defaultValue={today}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Akun Kas/Bank
              </label>
              <select
                name="akunKasBankId"
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
              >
                <option value="">Pilih akun</option>
                {akunSummary.map((akun) => (
                  <option key={akun.id} value={akun.id}>
                    {akun.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Kategori
              </label>
              <select
                name="kategori"
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
              >
                {kategoriOptions.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Jumlah
              </label>
              <input
                name="jumlah"
                type="number"
                min="1"
                required
                placeholder="0"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                rows={3}
                placeholder="Catatan transaksi"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Transaksi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

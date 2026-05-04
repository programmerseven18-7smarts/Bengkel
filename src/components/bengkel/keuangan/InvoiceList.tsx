"use client";

import type { ReactNode } from "react";
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
import { createPembayaranAction } from "@/lib/keuangan/actions";

type InvoiceStatus = "DRAFT" | "BELUM_LUNAS" | "SEBAGIAN" | "LUNAS" | "BATAL";

export interface InvoiceRow {
  id: string;
  noInvoice: string;
  noWorkOrder: string;
  tanggal: string;
  pelanggan: string;
  kendaraan: string;
  totalJasa: number;
  totalSparepart: number;
  grandTotal: number;
  sisaTagihan: number;
  status: InvoiceStatus;
}

interface InvoiceListProps {
  invoices: InvoiceRow[];
  metodePembayaranOptions: {
    value: string;
    label: string;
  }[];
  akunKasBankOptions: {
    value: string;
    label: string;
  }[];
}

const statusLabel = (status: InvoiceStatus) => {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "BELUM_LUNAS":
      return "Belum Lunas";
    case "SEBAGIAN":
      return "Sebagian";
    case "LUNAS":
      return "Lunas";
    case "BATAL":
      return "Batal";
  }
};

const getStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case "LUNAS":
      return "success";
    case "BELUM_LUNAS":
    case "SEBAGIAN":
      return "warning";
    case "BATAL":
      return "error";
    case "DRAFT":
      return "light";
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const toDateInput = (date = new Date()) => date.toISOString().slice(0, 10);

export default function InvoiceList({
  invoices,
  metodePembayaranOptions,
  akunKasBankOptions,
}: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceRow | null>(null);

  const filteredData = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return invoices.filter((item) => {
      const text =
        `${item.noInvoice} ${item.noWorkOrder} ${item.pelanggan} ${item.kendaraan}`.toLowerCase();
      const matchSearch = !keyword || text.includes(keyword);
      const matchStatus = statusFilter === "Semua" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Invoice
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kelola invoice servis pelanggan
          </p>
        </div>
        <Link href="/servis/work-order">
          <Button size="md" variant="primary" className="w-full sm:w-auto">
            Buat dari Work Order
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 dark:border-gray-800 sm:flex-row sm:px-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari invoice, WO, pelanggan, atau kendaraan..."
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <select
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90 sm:w-auto"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="Semua">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="BELUM_LUNAS">Belum Lunas</option>
          <option value="SEBAGIAN">Sebagian</option>
          <option value="LUNAS">Lunas</option>
          <option value="BATAL">Batal</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[980px]">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-800">
              <TableRow>
                {[
                  "No",
                  "No. Invoice",
                  "WO",
                  "Tanggal",
                  "Pelanggan",
                  "Kendaraan",
                  "Grand Total",
                  "Sisa Tagihan",
                  "Status",
                  "Aksi",
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
                  <TableCell className="px-6 py-4 font-medium text-brand-500">
                    <Link href={`/keuangan/invoice/${item.id}`}>
                      {item.noInvoice}
                    </Link>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.noWorkOrder || "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(item.tanggal)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                    {item.pelanggan}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.kendaraan}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                    {formatCurrency(item.grandTotal)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                    {formatCurrency(item.sisaTagihan)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge color={getStatusColor(item.status)}>
                      {statusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/keuangan/invoice/${item.id}`}>
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      </Link>
                      {item.sisaTagihan > 0 && item.status !== "BATAL" && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => setPaymentInvoice(item)}
                        >
                          Bayar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {filteredData.length} dari {invoices.length} invoice
          </p>
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Total Tagihan:{" "}
              </span>
              <span className="font-semibold text-gray-800 dark:text-white/90">
                {formatCurrency(
                  filteredData.reduce((sum, item) => sum + item.grandTotal, 0)
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Sisa Tagihan:{" "}
              </span>
              <span className="font-semibold text-warning-600">
                {formatCurrency(
                  filteredData.reduce((sum, item) => sum + item.sisaTagihan, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      {paymentInvoice && (
        <PaymentModal
          invoice={paymentInvoice}
          metodePembayaranOptions={metodePembayaranOptions}
          akunKasBankOptions={akunKasBankOptions}
          onClose={() => setPaymentInvoice(null)}
        />
      )}
    </div>
  );
}

function PaymentModal({
  invoice,
  metodePembayaranOptions,
  akunKasBankOptions,
  onClose,
}: {
  invoice: InvoiceRow;
  metodePembayaranOptions: {
    value: string;
    label: string;
  }[];
  akunKasBankOptions: {
    value: string;
    label: string;
  }[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/50 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-gray-900">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Pembayaran Invoice
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {invoice.noInvoice} | Sisa {formatCurrency(invoice.sisaTagihan)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.06]"
            >
              Tutup
            </button>
          </div>
        </div>
        <form action={createPembayaranAction} className="space-y-4 p-5">
          <input type="hidden" name="invoiceId" value={invoice.id} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Tanggal">
              <input
                name="tanggal"
                type="date"
                defaultValue={toDateInput()}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </Field>
            <Field label="Jumlah Bayar">
              <input
                name="jumlahBayar"
                type="number"
                min="1"
                max={invoice.sisaTagihan}
                defaultValue={invoice.sisaTagihan}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </Field>
            <Field label="Metode Pembayaran">
              <select
                name="metodePembayaranId"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="">Pilih metode</option>
                {metodePembayaranOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Akun Kas/Bank">
              <select
                name="akunKasBankId"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="">Tidak masuk kas/bank</option>
                {akunKasBankOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="No. Referensi">
              <input
                name="nomorReferensi"
                placeholder="No transfer / QRIS / struk"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </Field>
            <Field label="Catatan">
              <input
                name="catatan"
                placeholder="Catatan pembayaran"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </Field>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Pembayaran
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </span>
      {children}
    </label>
  );
}

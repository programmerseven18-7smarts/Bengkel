"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import PrintButton from "@/components/common/PrintButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createInvoiceFromWorkOrderAction,
  createStokKeluarFromWorkOrderAction,
  updateWorkOrderStatusAction,
} from "@/lib/work-orders/actions";

type WorkOrderStatus =
  | "DRAFT"
  | "ANTRI"
  | "DIKERJAKAN"
  | "MENUNGGU_PART"
  | "SELESAI"
  | "BATAL";

export interface WorkOrderDetailData {
  id: string;
  noWorkOrder: string;
  tanggalMasuk: string;
  estimasiSelesai: string | null;
  status: WorkOrderStatus;
  pelanggan: {
    nama: string;
    noHp: string;
    alamat: string;
  };
  kendaraan: {
    merk: string;
    tipe: string;
    tahun: string;
    platNomor: string;
    warna: string;
  };
  mekanik: string;
  keluhan: string;
  catatan: string;
  totalJasa: number;
  totalSparepart: number;
  grandTotal: number;
  jasaItems: {
    id: string;
    namaJasa: string;
    kategori: string;
    estimasiMenit: number;
    harga: number;
    catatan: string;
  }[];
  sparepartItems: {
    id: string;
    namaSparepart: string;
    stokSaatItu: number;
    qty: number;
    satuan: string;
    hargaJual: number;
    subtotal: number;
    catatan: string;
  }[];
  stokKeluar: {
    id: string;
    noTransaksi: string;
  }[];
  invoice: {
    id: string;
    noInvoice: string;
  } | null;
}

interface WorkOrderDetailProps {
  workOrder: WorkOrderDetailData;
}

const statusOptions: { value: WorkOrderStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "ANTRI", label: "Antri" },
  { value: "DIKERJAKAN", label: "Dikerjakan" },
  { value: "MENUNGGU_PART", label: "Menunggu Part" },
  { value: "SELESAI", label: "Selesai" },
  { value: "BATAL", label: "Batal" },
];

const statusLabel = (status: WorkOrderStatus) =>
  statusOptions.find((item) => item.value === status)?.label ?? status;

const getStatusColor = (status: WorkOrderStatus) => {
  switch (status) {
    case "DRAFT":
      return "light";
    case "ANTRI":
      return "info";
    case "DIKERJAKAN":
      return "primary";
    case "MENUNGGU_PART":
      return "warning";
    case "SELESAI":
      return "success";
    case "BATAL":
      return "error";
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

export default function WorkOrderDetail({ workOrder }: WorkOrderDetailProps) {
  const hasSparepart = workOrder.sparepartItems.length > 0;
  const hasStokKeluar = workOrder.stokKeluar.length > 0;
  const hasInvoice = Boolean(workOrder.invoice);

  return (
    <div className="grid min-w-0 grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                  {workOrder.noWorkOrder}
                </h2>
                <Badge color={getStatusColor(workOrder.status)}>
                  {statusLabel(workOrder.status)}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Masuk: {formatDate(workOrder.tanggalMasuk)} | Estimasi selesai:{" "}
                {formatDate(workOrder.estimasiSelesai)} | Mekanik:{" "}
                {workOrder.mekanik || "-"}
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <form
                action={updateWorkOrderStatusAction}
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <input type="hidden" name="id" value={workOrder.id} />
                <select
                  name="status"
                  defaultValue={workOrder.status}
                  className="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <Button type="submit" variant="outline" className="w-full sm:w-auto">
                  Update Status
                </Button>
              </form>

              <div className="flex flex-col gap-2 sm:flex-row">
                <PrintButton />
                {workOrder.status === "DRAFT" && (
                  <Link href={`/servis/work-order/${workOrder.id}/edit`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Edit Draft
                    </Button>
                  </Link>
                )}
                <form action={createStokKeluarFromWorkOrderAction}>
                  <input type="hidden" name="id" value={workOrder.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={!hasSparepart || hasStokKeluar || workOrder.status === "DRAFT"}
                    className="w-full sm:w-auto"
                  >
                    {hasStokKeluar ? "Stok Sudah Keluar" : "Buat Stok Keluar"}
                  </Button>
                </form>
                <form action={createInvoiceFromWorkOrderAction}>
                  <input type="hidden" name="id" value={workOrder.id} />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={hasInvoice || workOrder.status === "DRAFT"}
                    className="w-full sm:w-auto"
                  >
                    {hasInvoice ? "Invoice Sudah Ada" : "Buat Invoice"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {(hasStokKeluar || hasInvoice) && (
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {workOrder.stokKeluar.map((item) => (
                <Link
                  key={item.id}
                  href="/inventory/stok-keluar"
                  className="rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                >
                  Stok Keluar: {item.noTransaksi}
                </Link>
              ))}
              {workOrder.invoice && (
                <Link
                  href="/keuangan/invoice"
                  className="rounded-full bg-success-50 px-3 py-1 font-medium text-success-600 dark:bg-success-500/15 dark:text-success-400"
                >
                  Invoice: {workOrder.invoice.noInvoice}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <InfoCard title="Informasi Pelanggan">
        <InfoRow label="Nama" value={workOrder.pelanggan.nama} />
        <InfoRow label="No. HP" value={workOrder.pelanggan.noHp || "-"} />
        <InfoRow label="Alamat" value={workOrder.pelanggan.alamat || "-"} />
      </InfoCard>

      <InfoCard title="Informasi Kendaraan">
        <InfoRow
          label="Merk/Tipe"
          value={`${workOrder.kendaraan.merk} ${workOrder.kendaraan.tipe}`.trim()}
        />
        <InfoRow label="Plat Nomor" value={workOrder.kendaraan.platNomor} />
        <InfoRow label="Tahun" value={workOrder.kendaraan.tahun || "-"} />
        <InfoRow label="Warna" value={workOrder.kendaraan.warna || "-"} />
      </InfoCard>

      <div className="col-span-12">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Keluhan dan Catatan
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {workOrder.keluhan || "-"}
          </p>
          {workOrder.catatan && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Catatan: {workOrder.catatan}
            </p>
          )}
        </div>
      </div>

      <DetailSection title="Jasa Servis" totalLabel="Subtotal Jasa" total={workOrder.totalJasa}>
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              {["No", "Nama Jasa", "Kategori", "Estimasi", "Harga"].map(
                (header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {workOrder.jasaItems.map((jasa, index) => (
              <TableRow key={jasa.id}>
                <TableCell className="px-5 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                  {jasa.namaJasa}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {jasa.kategori || "-"}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {jasa.estimasiMenit ? `${jasa.estimasiMenit} menit` : "-"}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                  {formatCurrency(jasa.harga)}
                </TableCell>
              </TableRow>
            ))}
            {workOrder.jasaItems.length === 0 && (
              <EmptyRow colSpan={5} text="Belum ada jasa servis." />
            )}
          </TableBody>
        </Table>
      </DetailSection>

      <DetailSection
        title="Sparepart Dipakai"
        totalLabel="Subtotal Sparepart"
        total={workOrder.totalSparepart}
      >
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              {["No", "Nama Sparepart", "Stok Saat Itu", "Qty", "Harga", "Subtotal"].map(
                (header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {workOrder.sparepartItems.map((part, index) => (
              <TableRow key={part.id}>
                <TableCell className="px-5 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                  {part.namaSparepart}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {part.stokSaatItu}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {part.qty} {part.satuan}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(part.hargaJual)}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                  {formatCurrency(part.subtotal)}
                </TableCell>
              </TableRow>
            ))}
            {workOrder.sparepartItems.length === 0 && (
              <EmptyRow colSpan={6} text="Belum ada sparepart." />
            )}
          </TableBody>
        </Table>
      </DetailSection>

      <div className="col-span-12">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <SummaryItem label="Total Jasa" value={workOrder.totalJasa} />
              <SummaryItem label="Total Sparepart" value={workOrder.totalSparepart} />
            </div>
            <div className="text-left sm:text-right">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Grand Total
              </span>
              <p className="text-2xl font-bold text-brand-500 dark:text-brand-400">
                {formatCurrency(workOrder.grandTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="col-span-12 lg:col-span-6">
      <div className="h-full rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="max-w-[280px] text-right font-medium text-gray-800 dark:text-white/90">
        {value}
      </span>
    </div>
  );
}

function DetailSection({
  title,
  totalLabel,
  total,
  children,
}: {
  title: string;
  totalLabel: string;
  total: number;
  children: ReactNode;
}) {
  return (
    <div className="col-span-12">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 p-5 dark:border-gray-800 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
        </div>
        <div className="overflow-x-auto">{children}</div>
        <div className="border-t border-gray-100 bg-gray-50 p-5 text-right dark:border-gray-800 dark:bg-gray-900 md:p-6">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalLabel}:{" "}
          </span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <p className="font-semibold text-gray-800 dark:text-white/90">
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        {text}
      </TableCell>
    </TableRow>
  );
}

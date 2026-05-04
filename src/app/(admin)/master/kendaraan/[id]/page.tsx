import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: Date) =>
  date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default async function KendaraanDetailPage({ params }: Props) {
  await requirePageAccess("kendaraan");

  const { id } = await params;
  const kendaraan = await prisma.kendaraan.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      platNomor: true,
      tipe: true,
      tahun: true,
      warna: true,
      noRangka: true,
      noMesin: true,
      createdAt: true,
      pelanggan: {
        select: {
          id: true,
          nama: true,
          noHp: true,
        },
      },
      merk: {
        select: {
          nama: true,
          jenisKendaraan: true,
        },
      },
      reminders: {
        orderBy: {
          jatuhTempo: "asc",
        },
        take: 3,
        select: {
          id: true,
          jenisReminder: true,
          jatuhTempo: true,
          kanal: true,
          status: true,
        },
      },
      workOrders: {
        orderBy: {
          tanggalMasuk: "desc",
        },
        select: {
          id: true,
          noWorkOrder: true,
          tanggalMasuk: true,
          odometer: true,
          status: true,
          keluhan: true,
          catatan: true,
          grandTotal: true,
          mekanik: {
            select: {
              nama: true,
            },
          },
          jasaItems: {
            select: {
              namaJasa: true,
            },
          },
          sparepartItems: {
            select: {
              id: true,
              namaSparepart: true,
              qty: true,
              hargaJual: true,
            },
          },
        },
      },
    },
  });

  if (!kendaraan) {
    notFound();
  }

  const latestWorkOrder = kendaraan.workOrders[0];
  const latestOdometer = kendaraan.workOrders.find((item) => item.odometer !== null);
  const sparepartRows = kendaraan.workOrders.flatMap((workOrder) =>
    workOrder.sparepartItems.map((item) => ({
      ...item,
      tanggal: workOrder.tanggalMasuk,
      noWorkOrder: workOrder.noWorkOrder,
      workOrderId: workOrder.id,
    }))
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Detail Kendaraan" />
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                {`${kendaraan.merk?.nama ?? ""} ${kendaraan.tipe}`.trim()}
              </h2>
              <p className="mt-1 text-lg font-semibold text-brand-500">
                {kendaraan.platNomor}
              </p>
            </div>
            <Link
              href="/master/kendaraan"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Kembali
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
            <InfoItem label="Tahun" value={kendaraan.tahun ? String(kendaraan.tahun) : "-"} />
            <InfoItem label="Warna" value={kendaraan.warna ?? "-"} />
            <InfoItem label="Jenis" value={kendaraan.merk?.jenisKendaraan ?? "-"} />
            <InfoItem label="Terdaftar" value={formatDate(kendaraan.createdAt)} />
            <InfoItem label="No. Rangka" value={kendaraan.noRangka ?? "-"} />
            <InfoItem label="No. Mesin" value={kendaraan.noMesin ?? "-"} />
            <InfoItem
              label="Odometer Terakhir"
              value={latestOdometer?.odometer ? `${latestOdometer.odometer.toLocaleString("id-ID")} km` : "-"}
            />
            <InfoItem
              label="Servis Terakhir"
              value={latestWorkOrder ? formatDate(latestWorkOrder.tanggalMasuk) : "-"}
            />
          </div>

          <div className="border-t border-gray-100 p-6 dark:border-gray-800">
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Pemilik</p>
            <Link
              href={`/master/pelanggan/${kendaraan.pelanggan.id}`}
              className="font-medium text-brand-500 hover:text-brand-600"
            >
              {kendaraan.pelanggan.nama}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {kendaraan.pelanggan.noHp ?? "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard label="Total Servis" value={`${kendaraan.workOrders.length} kali`} />
          <SummaryCard
            label="Total Transaksi"
            value={formatCurrency(
              kendaraan.workOrders.reduce(
                (total, item) => total + Number(item.grandTotal),
                0
              )
            )}
            tone="success"
          />
          <SummaryCard label="Reminder Aktif" value={`${kendaraan.reminders.length} reminder`} />
        </div>

        {kendaraan.reminders.length > 0 && (
          <div className="rounded-xl border border-warning-200 bg-warning-50 p-5 dark:border-warning-500/30 dark:bg-warning-500/10">
            <h3 className="font-semibold text-warning-800 dark:text-warning-300">
              Reminder Servis Berikutnya
            </h3>
            <div className="mt-3 space-y-2">
              {kendaraan.reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-warning-800 dark:text-warning-300">
                      {reminder.jenisReminder}
                    </p>
                    <p className="text-sm text-warning-700 dark:text-warning-400">
                      {formatDate(reminder.jatuhTempo)} | {reminder.kanal}
                    </p>
                  </div>
                  <Badge size="sm" color={reminder.status === "LEWAT" ? "error" : "warning"}>
                    {reminder.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <Section title="Riwayat Servis Lengkap">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["No. WO", "Tanggal", "Odometer", "Jenis Servis", "Mekanik", "Total", "Catatan"].map(
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
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {kendaraan.workOrders.map((workOrder) => (
                <TableRow key={workOrder.id}>
                  <TableCell className="px-5 py-4">
                    <Link
                      href={`/servis/work-order/${workOrder.id}`}
                      className="text-theme-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                      {workOrder.noWorkOrder}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {formatDate(workOrder.tanggalMasuk)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {workOrder.odometer ? `${workOrder.odometer.toLocaleString("id-ID")} km` : "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {workOrder.jasaItems.map((item) => item.namaJasa).join(", ") || "Servis umum"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {workOrder.mekanik?.nama ?? "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(Number(workOrder.grandTotal))}
                  </TableCell>
                  <TableCell className="max-w-[240px] px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {workOrder.catatan ?? workOrder.keluhan ?? "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        <Section title="Sparepart yang Pernah Diganti">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Tanggal", "No. WO", "Sparepart", "Qty", "Harga"].map((header) => (
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
              {sparepartRows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.tanggal)}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Link
                      href={`/servis/work-order/${item.workOrderId}`}
                      className="text-theme-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                      {item.noWorkOrder}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.namaSparepart}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {Number(item.qty).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {formatCurrency(Number(item.hargaJual))}
                  </TableCell>
                </TableRow>
              ))}
              {sparepartRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Belum ada sparepart yang tercatat dari work order kendaraan ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Section>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 dark:text-white/90">{value}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success";
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          tone === "success" ? "text-success-500" : "text-gray-800 dark:text-white/90"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 p-6 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
      </div>
      <div className="max-w-full overflow-x-auto">{children}</div>
    </div>
  );
}

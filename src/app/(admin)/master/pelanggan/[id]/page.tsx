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

const invoiceStatusLabel = (status?: string | null) => {
  switch (status) {
    case "LUNAS":
      return "Lunas";
    case "SEBAGIAN":
      return "Sebagian";
    case "BATAL":
      return "Batal";
    case "DRAFT":
      return "Draft";
    default:
      return "Belum Lunas";
  }
};

export default async function PelangganDetailPage({ params }: Props) {
  await requirePageAccess("pelanggan");

  const { id } = await params;
  const pelanggan = await prisma.pelanggan.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      noHp: true,
      email: true,
      alamat: true,
      status: true,
      createdAt: true,
      kendaraan: {
        orderBy: {
          platNomor: "asc",
        },
        select: {
          id: true,
          platNomor: true,
          tipe: true,
          tahun: true,
          warna: true,
          merk: {
            select: {
              nama: true,
            },
          },
          _count: {
            select: {
              workOrders: true,
            },
          },
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
          status: true,
          grandTotal: true,
          kendaraan: {
            select: {
              platNomor: true,
              tipe: true,
              merk: {
                select: {
                  nama: true,
                },
              },
            },
          },
          invoice: {
            select: {
              status: true,
            },
          },
        },
      },
      piutang: {
        where: {
          status: {
            not: "LUNAS",
          },
        },
        select: {
          sisaPiutang: true,
        },
      },
    },
  });

  if (!pelanggan) {
    notFound();
  }

  const totalTransaksi = pelanggan.workOrders.reduce(
    (total, item) => total + Number(item.grandTotal),
    0
  );
  const totalPiutang = pelanggan.piutang.reduce(
    (total, item) => total + Number(item.sisaPiutang),
    0
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Detail Pelanggan" />
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20">
                <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {pelanggan.nama.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    {pelanggan.nama}
                  </h2>
                  <Badge size="sm" color={pelanggan.status === "AKTIF" ? "success" : "light"}>
                    {pelanggan.status === "AKTIF" ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pelanggan.kode} | Terdaftar {formatDate(pelanggan.createdAt)}
                </p>
              </div>
            </div>
            <Link
              href="/master/pelanggan"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Kembali
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
            <InfoItem label="No. HP" value={pelanggan.noHp ?? "-"} />
            <InfoItem label="Email" value={pelanggan.email ?? "-"} />
            <InfoItem label="Alamat" value={pelanggan.alamat ?? "-"} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard label="Kendaraan" value={`${pelanggan.kendaraan.length} unit`} />
          <SummaryCard label="Total Servis" value={`${pelanggan.workOrders.length} kali`} />
          <SummaryCard
            label="Total Transaksi"
            value={formatCurrency(totalTransaksi)}
            tone="success"
          />
          <SummaryCard
            label="Piutang Aktif"
            value={formatCurrency(totalPiutang)}
            tone={totalPiutang > 0 ? "error" : "default"}
          />
        </div>

        <Section title={`Daftar Kendaraan (${pelanggan.kendaraan.length})`}>
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Plat Nomor", "Merk / Tipe", "Tahun", "Warna", "Total Servis", "Aksi"].map(
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
              {pelanggan.kendaraan.map((kendaraan) => (
                <TableRow key={kendaraan.id}>
                  <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {kendaraan.platNomor}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {`${kendaraan.merk?.nama ?? ""} ${kendaraan.tipe}`.trim()}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {kendaraan.tahun ?? "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {kendaraan.warna ?? "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {kendaraan._count.workOrders}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Link
                      href={`/master/kendaraan/${kendaraan.id}`}
                      className="text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                      Lihat Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        <Section title="Riwayat Servis Terbaru">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["No. WO", "Tanggal", "Kendaraan", "Status", "Total", "Status Bayar"].map(
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
              {pelanggan.workOrders.slice(0, 8).map((workOrder) => (
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
                    {`${workOrder.kendaraan.merk?.nama ?? ""} ${workOrder.kendaraan.tipe}`.trim()}
                    <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                      {workOrder.kendaraan.platNomor}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {workOrder.status}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(Number(workOrder.grandTotal))}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {invoiceStatusLabel(workOrder.invoice?.status)}
                  </TableCell>
                </TableRow>
              ))}
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
  tone?: "default" | "success" | "error";
}) {
  const toneClass =
    tone === "success"
      ? "text-success-500"
      : tone === "error"
      ? "text-error-500"
      : "text-gray-800 dark:text-white/90";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
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

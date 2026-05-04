import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PrintButton from "@/components/common/PrintButton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { requirePageAccess } from "@/lib/auth/permissions";
import { cancelInvoiceAction } from "@/lib/keuangan/actions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Detail Invoice | Auto7",
  description: "Detail invoice bengkel",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

const statusLabel = (status: string) => {
  switch (status) {
    case "BELUM_LUNAS":
      return "Belum Lunas";
    case "SEBAGIAN":
      return "Sebagian";
    case "LUNAS":
      return "Lunas";
    case "BATAL":
      return "Batal";
    default:
      return "Draft";
  }
};

const statusColor = (status: string): BadgeColor => {
  switch (status) {
    case "LUNAS":
      return "success";
    case "BELUM_LUNAS":
    case "SEBAGIAN":
      return "warning";
    case "BATAL":
      return "error";
    default:
      return "light";
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default async function InvoiceDetailPage({ params }: PageProps) {
  await requirePageAccess("invoice");

  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: {
      id,
    },
    include: {
      workOrder: {
        select: {
          noWorkOrder: true,
        },
      },
      pelanggan: true,
      kendaraan: {
        include: {
          merk: true,
        },
      },
      items: {
        orderBy: {
          id: "asc",
        },
      },
      pembayaran: {
        include: {
          metodePembayaran: true,
          kasir: true,
        },
        orderBy: {
          tanggal: "desc",
        },
      },
    },
  });

  if (!invoice) notFound();
  const hasActivePayment = invoice.pembayaran.some(
    (item) => item.status === "SELESAI"
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Detail Invoice" />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {invoice.noInvoice}
              </h2>
              <Badge color={statusColor(invoice.status)}>
                {statusLabel(invoice.status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Work Order: {invoice.workOrder?.noWorkOrder ?? "-"} | Tanggal:{" "}
              {formatDate(invoice.tanggalInvoice)}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="mb-3 flex justify-start sm:justify-end">
              <PrintButton />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sisa Tagihan
            </p>
            <p className="text-2xl font-bold text-warning-600">
              {formatCurrency(Number(invoice.sisaTagihan))}
            </p>
            {!hasActivePayment && invoice.status !== "BATAL" && (
              <form action={cancelInvoiceAction} className="mt-3">
                <input type="hidden" name="id" value={invoice.id} />
                <Button type="submit" variant="outline">
                  Batalkan Invoice
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfoCard title="Pelanggan">
          <InfoRow label="Nama" value={invoice.pelanggan.nama} />
          <InfoRow label="No. HP" value={invoice.pelanggan.noHp ?? "-"} />
          <InfoRow label="Alamat" value={invoice.pelanggan.alamat ?? "-"} />
        </InfoCard>
        <InfoCard title="Kendaraan">
          <InfoRow
            label="Kendaraan"
            value={
              invoice.kendaraan
                ? `${invoice.kendaraan.merk?.nama ?? ""} ${invoice.kendaraan.tipe}`.trim()
                : "-"
            }
          />
          <InfoRow label="Plat" value={invoice.kendaraan?.platNomor ?? "-"} />
          <InfoRow label="Jatuh Tempo" value={formatDate(invoice.jatuhTempo)} />
        </InfoCard>
      </div>

      <DetailTable
        title="Detail Tagihan"
        headers={["No", "Tipe", "Deskripsi", "Qty", "Harga", "Subtotal"]}
      >
        {invoice.items.map((item, index) => (
          <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
            <Td>{index + 1}</Td>
            <Td>{item.tipe}</Td>
            <Td strong>{item.deskripsi}</Td>
            <Td>{Number(item.qty)}</Td>
            <Td>{formatCurrency(Number(item.harga))}</Td>
            <Td>{formatCurrency(Number(item.subtotal))}</Td>
          </tr>
        ))}
      </DetailTable>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Ringkasan
          </h3>
          <InfoRow label="Total Jasa" value={formatCurrency(Number(invoice.totalJasa))} />
          <InfoRow
            label="Total Sparepart"
            value={formatCurrency(Number(invoice.totalSparepart))}
          />
          <InfoRow label="Grand Total" value={formatCurrency(Number(invoice.grandTotal))} />
          <InfoRow label="Terbayar" value={formatCurrency(Number(invoice.terbayar))} />
        </div>
        <DetailTable
          title="Riwayat Pembayaran"
          headers={["Tanggal", "No. Bayar", "Metode", "Jumlah", "Kasir"]}
        >
          {invoice.pembayaran.map((item) => (
            <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
              <Td>{formatDate(item.tanggal)}</Td>
              <Td strong>{item.noPembayaran}</Td>
              <Td>{item.metodePembayaran?.nama ?? "-"}</Td>
              <Td>{formatCurrency(Number(item.jumlahBayar))}</Td>
              <Td>{item.kasir?.nama ?? "-"}</Td>
            </tr>
          ))}
          {invoice.pembayaran.length === 0 && (
            <tr>
              <Td colSpan={5}>Belum ada pembayaran.</Td>
            </tr>
          )}
        </DetailTable>
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
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-right font-medium text-gray-800 dark:text-white/90">
        {value}
      </span>
    </div>
  );
}

function DetailTable({
  title,
  headers,
  children,
}: {
  title: string;
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/[0.03]">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function Td({
  children,
  strong,
  colSpan,
}: {
  children: ReactNode;
  strong?: boolean;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={`px-5 py-3 text-gray-600 dark:text-gray-400 ${
        strong ? "font-medium text-gray-800 dark:text-white/90" : ""
      }`}
    >
      {children}
    </td>
  );
}

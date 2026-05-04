import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PrintButton from "@/components/common/PrintButton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { requirePageAccess } from "@/lib/auth/permissions";
import {
  cancelReturPembelianAction,
  cancelPostedReturPembelianAction,
  completeReturPembelianAction,
  postReturPembelianAction,
} from "@/lib/pembelian/actions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Detail Retur Pembelian | Auto7",
  description: "Detail retur pembelian ke supplier",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

const statusLabel = (status: string) => {
  switch (status) {
    case "DIKIRIM":
      return "Dikirim";
    case "SELESAI":
      return "Selesai";
    case "DIBATALKAN":
      return "Dibatalkan";
    default:
      return "Draft";
  }
};

const statusColor = (status: string): BadgeColor => {
  switch (status) {
    case "DIKIRIM":
      return "warning";
    case "SELESAI":
      return "success";
    case "DIBATALKAN":
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

export default async function ReturPembelianDetailPage({ params }: PageProps) {
  await requirePageAccess("retur_pembelian");

  const { id } = await params;
  const retur = await prisma.returPembelian.findUnique({
    where: {
      id,
    },
    include: {
      supplier: true,
      penerimaanBarang: {
        select: {
          id: true,
          noPenerimaan: true,
          tanggalTerima: true,
        },
      },
      alasanRetur: true,
      items: {
        include: {
          alasanRetur: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!retur) notFound();

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Detail Retur Pembelian" />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {retur.noRetur}
              </h2>
              <Badge color={statusColor(retur.status)}>
                {statusLabel(retur.status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supplier: {retur.supplier.nama} | Tanggal:{" "}
              {formatDate(retur.tanggalRetur)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            {retur.status === "DRAFT" && (
              <>
                <Link href={`/pembelian/retur-pembelian/${retur.id}/edit`}>
                  <Button variant="outline">Edit Draft</Button>
                </Link>
                <form action={postReturPembelianAction}>
                  <input type="hidden" name="id" value={retur.id} />
                  <Button type="submit" variant="primary">Post Retur</Button>
                </form>
                <form action={cancelReturPembelianAction}>
                  <input type="hidden" name="id" value={retur.id} />
                  <Button type="submit" variant="outline">Batalkan</Button>
                </form>
              </>
            )}
            {retur.status === "DIKIRIM" && (
              <form action={completeReturPembelianAction}>
                <input type="hidden" name="id" value={retur.id} />
                <Button type="submit" variant="primary">Selesaikan</Button>
              </form>
            )}
            {(retur.status === "DIKIRIM" || retur.status === "SELESAI") && (
              <form action={cancelPostedReturPembelianAction}>
                <input type="hidden" name="id" value={retur.id} />
                <Button type="submit" variant="outline">Batalkan Posting</Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfoCard title="Referensi">
          <InfoRow
            label="Penerimaan"
            value={
              retur.penerimaanBarang
                ? retur.penerimaanBarang.noPenerimaan
                : "-"
            }
            href={
              retur.penerimaanBarang
                ? `/pembelian/penerimaan-barang/${retur.penerimaanBarang.id}`
                : undefined
            }
          />
          <InfoRow
            label="Tanggal Terima"
            value={formatDate(retur.penerimaanBarang?.tanggalTerima ?? null)}
          />
          <InfoRow label="Alasan" value={retur.alasanRetur?.nama ?? "-"} />
        </InfoCard>
        <InfoCard title="Ringkasan">
          <InfoRow label="Supplier" value={retur.supplier.nama} />
          <InfoRow label="Total Item" value={`${retur.totalItem}`} />
          <InfoRow label="Total Nilai" value={formatCurrency(Number(retur.totalNilai))} />
          <InfoRow label="Catatan" value={retur.catatan ?? "-"} />
        </InfoCard>
      </div>

      <DetailTable
        title="Detail Sparepart Diretur"
        headers={["No", "Sparepart", "Qty Diterima", "Qty Retur", "Satuan", "Alasan", "Harga", "Subtotal"]}
      >
        {retur.items.map((item, index) => (
          <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
            <Td>{index + 1}</Td>
            <Td strong>{item.namaSparepart}</Td>
            <Td>{Number(item.qtyDiterima)}</Td>
            <Td>{Number(item.qtyRetur)}</Td>
            <Td>{item.satuan ?? "-"}</Td>
            <Td>{item.alasanRetur?.nama ?? retur.alasanRetur?.nama ?? "-"}</Td>
            <Td>{formatCurrency(Number(item.hargaBeli))}</Td>
            <Td>{formatCurrency(Number(item.subtotal))}</Td>
          </tr>
        ))}
      </DetailTable>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      {href ? (
        <Link href={href} className="text-right font-medium text-brand-500">
          {value}
        </Link>
      ) : (
        <span className="text-right font-medium text-gray-800 dark:text-white/90">
          {value}
        </span>
      )}
    </div>
  );
}

function DetailTable({ title, headers, children }: { title: string; headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/[0.03]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
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

function Td({ children, strong }: { children: ReactNode; strong?: boolean }) {
  return (
    <td
      className={`px-5 py-3 text-gray-600 dark:text-gray-400 ${
        strong ? "font-medium text-gray-800 dark:text-white/90" : ""
      }`}
    >
      {children}
    </td>
  );
}

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
  cancelPenerimaanBarangAction,
  cancelPostedPenerimaanBarangAction,
  postPenerimaanBarangAction,
} from "@/lib/pembelian/actions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Detail Penerimaan Barang | Auto7",
  description: "Detail penerimaan barang bengkel",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

const statusLabel = (status: string) => {
  switch (status) {
    case "PARSIAL":
      return "Parsial";
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
    case "PARSIAL":
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

export default async function PenerimaanBarangDetailPage({ params }: PageProps) {
  await requirePageAccess("penerimaan_barang");

  const { id } = await params;
  const penerimaan = await prisma.penerimaanBarang.findUnique({
    where: {
      id,
    },
    include: {
      purchaseOrder: true,
      supplier: true,
      diterimaOleh: true,
      items: {
        include: {
          kondisiBarang: true,
        },
        orderBy: {
          id: "asc",
        },
      },
      retur: {
        select: {
          id: true,
          noRetur: true,
          tanggalRetur: true,
          status: true,
        },
        orderBy: {
          tanggalRetur: "desc",
        },
      },
    },
  });

  if (!penerimaan) notFound();

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Detail Penerimaan Barang" />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {penerimaan.noPenerimaan}
              </h2>
              <Badge color={statusColor(penerimaan.status)}>
                {statusLabel(penerimaan.status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PO: {penerimaan.purchaseOrder?.noPurchaseOrder ?? "-"} | Tanggal:{" "}
              {formatDate(penerimaan.tanggalTerima)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            {penerimaan.status === "DRAFT" && (
              <>
                <Link href={`/pembelian/penerimaan-barang/${penerimaan.id}/edit`}>
                  <Button variant="outline">Edit Draft</Button>
                </Link>
                <form action={postPenerimaanBarangAction}>
                  <input type="hidden" name="id" value={penerimaan.id} />
                  <Button type="submit" variant="primary">Post Penerimaan</Button>
                </form>
                <form action={cancelPenerimaanBarangAction}>
                  <input type="hidden" name="id" value={penerimaan.id} />
                  <Button type="submit" variant="outline">Batalkan</Button>
                </form>
              </>
            )}
            {penerimaan.status !== "DRAFT" && penerimaan.status !== "DIBATALKAN" && (
              <form action={cancelPostedPenerimaanBarangAction}>
                <input type="hidden" name="id" value={penerimaan.id} />
                <Button type="submit" variant="outline">Batalkan Posting</Button>
              </form>
            )}
            {penerimaan.status !== "DRAFT" && penerimaan.status !== "DIBATALKAN" && (
              <Link href={`/pembelian/retur-pembelian/create?penerimaan=${penerimaan.id}`}>
                <Button variant="outline">Buat Retur</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfoCard title="Supplier">
          <InfoRow label="Nama" value={penerimaan.supplier.nama} />
          <InfoRow label="No. HP" value={penerimaan.supplier.noHp ?? "-"} />
          <InfoRow label="Penerima" value={penerimaan.diterimaOleh?.nama ?? "-"} />
        </InfoCard>
        <InfoCard title="Ringkasan">
          <InfoRow label="Total Item" value={`${penerimaan.totalItem}`} />
          <InfoRow label="Total Nilai" value={formatCurrency(Number(penerimaan.totalNilai))} />
          <InfoRow label="Catatan" value={penerimaan.catatan ?? "-"} />
        </InfoCard>
      </div>

      <DetailTable
        title="Detail Barang Diterima"
        headers={["No", "Sparepart", "Qty PO", "Qty Terima", "Satuan", "Harga", "Kondisi", "Subtotal"]}
      >
        {penerimaan.items.map((item, index) => (
          <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
            <Td>{index + 1}</Td>
            <Td strong>{item.namaSparepart}</Td>
            <Td>{Number(item.qtyPo)}</Td>
            <Td>{Number(item.qtyTerima)}</Td>
            <Td>{item.satuan ?? "-"}</Td>
            <Td>{formatCurrency(Number(item.hargaBeli))}</Td>
            <Td>{item.kondisiBarang?.nama ?? "-"}</Td>
            <Td>{formatCurrency(Number(item.subtotal))}</Td>
          </tr>
        ))}
      </DetailTable>

      <DetailTable title="Riwayat Retur" headers={["Tanggal", "No. Retur", "Status"]}>
        {penerimaan.retur.map((item) => (
          <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
            <Td>{formatDate(item.tanggalRetur)}</Td>
            <Td strong>
              <Link href={`/pembelian/retur-pembelian/${item.id}`}>
                {item.noRetur}
              </Link>
            </Td>
            <Td>{item.status}</Td>
          </tr>
        ))}
        {penerimaan.retur.length === 0 && (
          <tr>
            <Td colSpan={3}>Belum ada retur.</Td>
          </tr>
        )}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-right font-medium text-gray-800 dark:text-white/90">{value}</span>
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

function Td({ children, strong, colSpan }: { children: ReactNode; strong?: boolean; colSpan?: number }) {
  return (
    <td
      colSpan={colSpan}
      className={`px-5 py-3 text-gray-600 dark:text-gray-400 ${
        strong ? "font-medium text-brand-500" : ""
      }`}
    >
      {children}
    </td>
  );
}

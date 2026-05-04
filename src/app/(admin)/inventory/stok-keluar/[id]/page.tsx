import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PrintButton from "@/components/common/PrintButton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { requirePageAccess } from "@/lib/auth/permissions";
import { cancelStokKeluarAction } from "@/lib/inventory/actions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Detail Stok Keluar | Auto7",
  description: "Detail stok keluar inventory bengkel",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

const tipeLabel = (tipe: string) => {
  switch (tipe) {
    case "SERVIS":
      return "Servis";
    case "PENJUALAN":
      return "Penjualan";
    case "RETUR":
      return "Retur";
    default:
      return "Lainnya";
  }
};

const tipeColor = (tipe: string): BadgeColor => {
  switch (tipe) {
    case "SERVIS":
      return "primary";
    case "PENJUALAN":
      return "success";
    case "RETUR":
      return "warning";
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

export default async function StokKeluarDetailPage({ params }: PageProps) {
  await requirePageAccess("stok_keluar");

  const { id } = await params;
  const [stokKeluar, existingReverse] = await Promise.all([
    prisma.stokKeluar.findUnique({
      where: {
        id,
      },
      include: {
        workOrder: {
          select: {
            id: true,
            noWorkOrder: true,
          },
        },
        items: {
          orderBy: {
            id: "asc",
          },
        },
      },
    }),
    prisma.stokLedger.findFirst({
      where: {
        refTipe: "BATAL_STOK_KELUAR",
        refId: id,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!stokKeluar) notFound();

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Detail Stok Keluar" />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {stokKeluar.noTransaksi}
              </h2>
              <Badge color={tipeColor(stokKeluar.tipe)}>
                {tipeLabel(stokKeluar.tipe)}
              </Badge>
              {existingReverse && <Badge color="error">Dibatalkan</Badge>}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tanggal: {formatDate(stokKeluar.tanggal)} | Referensi:{" "}
              {stokKeluar.workOrder ? (
                <Link
                  href={`/servis/work-order/${stokKeluar.workOrder.id}`}
                  className="text-brand-500"
                >
                  {stokKeluar.workOrder.noWorkOrder}
                </Link>
              ) : (
                stokKeluar.referensi ?? "-"
              )}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="mb-3 flex justify-start sm:justify-end">
              <PrintButton />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Nilai</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {formatCurrency(Number(stokKeluar.totalNilai))}
            </p>
            {!existingReverse && (
              <form action={cancelStokKeluarAction} className="mt-3">
                <input type="hidden" name="id" value={stokKeluar.id} />
                <Button type="submit" variant="outline">
                  Batalkan Posting
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfoCard title="Informasi Transaksi">
          <InfoRow label="Diminta Oleh" value={stokKeluar.dimintaOleh ?? "-"} />
          <InfoRow label="Total Item" value={`${stokKeluar.totalItem}`} />
          <InfoRow label="Catatan" value={stokKeluar.catatan ?? "-"} />
        </InfoCard>
      </div>

      <DetailTable
        title="Detail Sparepart Keluar"
        headers={["No", "Sparepart", "Stok Saat Itu", "Qty Keluar", "Satuan", "Harga Modal", "Subtotal"]}
      >
        {stokKeluar.items.map((item, index) => (
          <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
            <Td>{index + 1}</Td>
            <Td strong>{item.namaSparepart}</Td>
            <Td>{item.stokSaatItu ?? "-"}</Td>
            <Td>{Number(item.qtyKeluar)}</Td>
            <Td>{item.satuan ?? "-"}</Td>
            <Td>{formatCurrency(Number(item.hargaModal))}</Td>
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

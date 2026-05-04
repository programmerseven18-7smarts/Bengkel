import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PrintButton from "@/components/common/PrintButton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { requirePageAccess } from "@/lib/auth/permissions";
import { updatePurchaseOrderStatusAction } from "@/lib/pembelian/actions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Detail Purchase Order | Auto7",
  description: "Detail purchase order pembelian sparepart",
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
    case "DITERIMA":
      return "Diterima";
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
    case "DITERIMA":
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

export default async function PurchaseOrderDetailPage({ params }: PageProps) {
  await requirePageAccess("purchase_order");

  const { id } = await params;
  const purchaseOrder = await prisma.purchaseOrder.findUnique({
    where: {
      id,
    },
    include: {
      supplier: true,
      items: {
        include: {
          sparepart: true,
        },
        orderBy: {
          id: "asc",
        },
      },
      penerimaanBarang: {
        orderBy: {
          tanggalTerima: "desc",
        },
        select: {
          id: true,
          noPenerimaan: true,
          tanggalTerima: true,
          status: true,
        },
      },
    },
  });

  if (!purchaseOrder) notFound();

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Detail Purchase Order" />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {purchaseOrder.noPurchaseOrder}
              </h2>
              <Badge color={statusColor(purchaseOrder.status)}>
                {statusLabel(purchaseOrder.status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supplier: {purchaseOrder.supplier.nama} | Tanggal:{" "}
              {formatDate(purchaseOrder.tanggal)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PrintButton />
            {purchaseOrder.status === "DRAFT" && (
              <>
                <Link href={`/pembelian/purchase-order/${purchaseOrder.id}/edit`}>
                  <Button variant="outline">Edit Draft</Button>
                </Link>
                <form action={updatePurchaseOrderStatusAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={purchaseOrder.id} />
                  <Button type="submit" name="status" value="DIKIRIM" variant="primary">
                    Post PO
                  </Button>
                  <Button type="submit" name="status" value="DIBATALKAN" variant="outline">
                    Batalkan
                  </Button>
                </form>
              </>
            )}
            {purchaseOrder.status === "DIKIRIM" && (
              <Link href={`/pembelian/penerimaan-barang/create?po=${purchaseOrder.id}`}>
                <Button variant="primary">Terima Barang</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfoCard title="Supplier">
          <InfoRow label="Nama" value={purchaseOrder.supplier.nama} />
          <InfoRow label="No. HP" value={purchaseOrder.supplier.noHp ?? "-"} />
          <InfoRow label="Email" value={purchaseOrder.supplier.email ?? "-"} />
        </InfoCard>
        <InfoCard title="Ringkasan">
          <InfoRow label="Estimasi Datang" value={formatDate(purchaseOrder.estimasiDatang)} />
          <InfoRow label="Total Item" value={`${purchaseOrder.totalItem}`} />
          <InfoRow label="Total Nilai" value={formatCurrency(Number(purchaseOrder.totalNilai))} />
        </InfoCard>
      </div>

      <DetailTable
        title="Detail Sparepart Dipesan"
        headers={["No", "Sparepart", "Stok", "Qty Pesan", "Qty Diterima", "Harga", "Subtotal"]}
      >
        {purchaseOrder.items.map((item, index) => (
          <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
            <Td>{index + 1}</Td>
            <Td strong>{item.namaSparepart}</Td>
            <Td>{item.stokSaatIni ?? "-"}</Td>
            <Td>{Number(item.qtyPesan)} {item.satuan ?? ""}</Td>
            <Td>{Number(item.qtyDiterima)} {item.satuan ?? ""}</Td>
            <Td>{formatCurrency(Number(item.hargaBeli))}</Td>
            <Td>{formatCurrency(Number(item.subtotal))}</Td>
          </tr>
        ))}
      </DetailTable>

      <DetailTable title="Riwayat Penerimaan" headers={["Tanggal", "No. Penerimaan", "Status"]}>
        {purchaseOrder.penerimaanBarang.map((item) => (
          <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
            <Td>{formatDate(item.tanggalTerima)}</Td>
            <Td strong>
              <Link href={`/pembelian/penerimaan-barang/${item.id}`}>
                {item.noPenerimaan}
              </Link>
            </Td>
            <Td>{statusLabel(item.status)}</Td>
          </tr>
        ))}
        {purchaseOrder.penerimaanBarang.length === 0 && (
          <tr>
            <Td colSpan={3}>Belum ada penerimaan.</Td>
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
        strong ? "font-medium text-brand-500" : ""
      }`}
    >
      {children}
    </td>
  );
}

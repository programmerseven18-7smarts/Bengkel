import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseOrderList from "@/components/bengkel/pembelian/PurchaseOrderList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Purchase Order | Auto7",
  description: "Daftar purchase order pembelian sparepart",
};

export const dynamic = "force-dynamic";

export default async function PurchaseOrderPage() {
  await requirePageAccess("purchase_order");

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    include: {
      supplier: {
        select: {
          nama: true,
        },
      },
    },
    orderBy: {
      tanggal: "desc",
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Purchase Order" />
      <PurchaseOrderList
        purchaseOrders={purchaseOrders.map((item) => ({
          id: item.id,
          noPurchaseOrder: item.noPurchaseOrder,
          tanggal: item.tanggal.toISOString(),
          supplier: item.supplier.nama,
          totalItem: item.totalItem,
          estimasiDatang: item.estimasiDatang?.toISOString() ?? null,
          totalNilai: Number(item.totalNilai),
          status: item.status,
        }))}
      />
    </div>
  );
}

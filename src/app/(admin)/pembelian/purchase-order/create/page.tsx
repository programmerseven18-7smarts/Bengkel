import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseOrderCreateForm from "@/components/bengkel/pembelian/PurchaseOrderCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Buat Purchase Order | Auto7",
  description: "Buat purchase order sparepart",
};

export const dynamic = "force-dynamic";

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export default async function CreatePurchaseOrderPage() {
  await requirePageAccess("purchase_order", "create");

  const [purchaseOrders, suppliers, spareparts] = await Promise.all([
    prisma.purchaseOrder.findMany({
      select: {
        noPurchaseOrder: true,
      },
    }),
    prisma.supplier.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
      },
    }),
    prisma.sparepart.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      include: {
        satuan: {
          select: {
            nama: true,
          },
        },
      },
    }),
  ]);
  const today = new Date();

  return (
    <div>
      <PageBreadcrumb pageTitle="Buat Purchase Order" />
      <PurchaseOrderCreateForm
        nextNumber={getNextTransactionNumber(
          purchaseOrders.map((item) => item.noPurchaseOrder),
          "PO",
          today
        )}
        tanggal={toDateInput(today)}
        estimasiDatang={toDateInput(addDays(today, 3))}
        supplierOptions={suppliers.map((item) => ({
          value: item.id,
          label: item.nama,
        }))}
        sparepartOptions={spareparts.map((item) => ({
          value: item.id,
          label: item.nama,
          nama: item.nama,
          stok: item.stok,
          satuan: item.satuan?.nama ?? "",
          hargaBeli: Number(item.hargaBeli),
        }))}
      />
    </div>
  );
}

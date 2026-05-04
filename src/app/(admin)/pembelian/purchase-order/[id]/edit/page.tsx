import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseOrderCreateForm from "@/components/bengkel/pembelian/PurchaseOrderCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit Purchase Order | Auto7",
  description: "Edit draft purchase order sparepart",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const toDateInput = (date: Date | null) => date?.toISOString().slice(0, 10) ?? "";

export default async function EditPurchaseOrderPage({ params }: PageProps) {
  await requirePageAccess("purchase_order", "edit");

  const { id } = await params;
  const [purchaseOrder, suppliers, spareparts] = await Promise.all([
    prisma.purchaseOrder.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            sparepart: {
              include: {
                satuan: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        },
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

  if (!purchaseOrder || purchaseOrder.status !== "DRAFT") notFound();

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Purchase Order" />
      <PurchaseOrderCreateForm
        mode="edit"
        initialData={{
          id: purchaseOrder.id,
          supplierId: purchaseOrder.supplierId,
          catatan: purchaseOrder.catatan ?? "",
          rows: purchaseOrder.items.map((item, index) => ({
            id: index + 1,
            sparepartId: item.sparepartId ?? "",
            namaSparepart: item.namaSparepart,
            stokSaatIni: item.stokSaatIni ?? item.sparepart?.stok ?? 0,
            qtyPesan: Number(item.qtyPesan),
            satuan: item.satuan ?? item.sparepart?.satuan?.nama ?? "",
            hargaBeli: Number(item.hargaBeli),
            catatan: item.catatan ?? "",
          })),
        }}
        nextNumber={purchaseOrder.noPurchaseOrder}
        tanggal={toDateInput(purchaseOrder.tanggal)}
        estimasiDatang={toDateInput(purchaseOrder.estimasiDatang)}
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

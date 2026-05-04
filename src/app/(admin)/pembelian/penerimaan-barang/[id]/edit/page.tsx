import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PenerimaanBarangCreateForm from "@/components/bengkel/pembelian/PenerimaanBarangCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit Penerimaan Barang | Auto7",
  description: "Edit draft penerimaan barang bengkel",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

export default async function EditPenerimaanBarangPage({ params }: PageProps) {
  await requirePageAccess("penerimaan_barang", "edit");

  const { id } = await params;
  const [
    penerimaan,
    purchaseOrders,
    spareparts,
    kondisiBarang,
    currentUser,
  ] = await Promise.all([
    prisma.penerimaanBarang.findUnique({
      where: {
        id,
      },
      include: {
        supplier: {
          select: {
            nama: true,
          },
        },
        items: {
          orderBy: {
            id: "asc",
          },
        },
      },
    }),
    prisma.purchaseOrder.findMany({
      where: {
        status: "DIKIRIM",
      },
      include: {
        supplier: {
          select: {
            id: true,
            nama: true,
          },
        },
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
      orderBy: {
        tanggal: "desc",
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
    prisma.kondisiBarang.findMany({
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
    getCurrentUser(),
  ]);

  if (!penerimaan || penerimaan.status !== "DRAFT") notFound();

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Penerimaan Barang" />
      <PenerimaanBarangCreateForm
        mode="edit"
        initialData={{
          id: penerimaan.id,
          purchaseOrderId: penerimaan.purchaseOrderId ?? "",
          supplier: penerimaan.supplier.nama,
          catatan: penerimaan.catatan ?? "",
          rows: penerimaan.items.map((item, index) => ({
            id: index + 1,
            purchaseOrderItemId: item.purchaseOrderItemId ?? "",
            sparepartId: item.sparepartId ?? "",
            kondisiBarangId: item.kondisiBarangId ?? "",
            namaSparepart: item.namaSparepart,
            qtyPo: Number(item.qtyPo),
            qtyTerima: Number(item.qtyTerima),
            satuan: item.satuan ?? "",
            hargaBeli: Number(item.hargaBeli),
            catatan: item.catatan ?? "",
          })),
        }}
        nextNumber={penerimaan.noPenerimaan}
        tanggalTerima={toDateInput(penerimaan.tanggalTerima)}
        currentUserName={currentUser?.nama ?? ""}
        purchaseOrders={purchaseOrders.map((item) => ({
          value: item.id,
          label: `${item.noPurchaseOrder} - ${item.supplier.nama}`,
          supplier: item.supplier.nama,
          supplierId: item.supplier.id,
          items: item.items.map((poItem) => ({
            purchaseOrderItemId: poItem.id,
            sparepartId: poItem.sparepartId ?? "",
            namaSparepart: poItem.namaSparepart,
            qtyPesan: Number(poItem.qtyPesan),
            qtyDiterima: Number(poItem.qtyDiterima),
            satuan: poItem.satuan ?? poItem.sparepart?.satuan?.nama ?? "",
            hargaBeli: Number(poItem.hargaBeli),
          })),
        }))}
        sparepartOptions={spareparts.map((item) => ({
          value: item.id,
          label: item.nama,
          nama: item.nama,
          stok: item.stok,
          satuan: item.satuan?.nama ?? "",
          hargaBeli: Number(item.hargaBeli),
        }))}
        kondisiOptions={kondisiBarang.map((item) => ({
          value: item.id,
          label: item.nama,
        }))}
      />
    </div>
  );
}

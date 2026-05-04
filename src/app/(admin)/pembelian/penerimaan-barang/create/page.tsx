import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PenerimaanBarangCreateForm from "@/components/bengkel/pembelian/PenerimaanBarangCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Terima Barang | Auto7",
  description: "Input penerimaan barang dari supplier",
};

export const dynamic = "force-dynamic";

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

export default async function CreatePenerimaanBarangPage({
  searchParams,
}: {
  searchParams?: Promise<{ po?: string }>;
}) {
  await requirePageAccess("penerimaan_barang", "create");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [penerimaanBarang, purchaseOrders, spareparts, kondisiBarang, currentUser] =
    await Promise.all([
      prisma.penerimaanBarang.findMany({
        select: {
          noPenerimaan: true,
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
  const today = new Date();

  return (
    <div>
      <PageBreadcrumb pageTitle="Terima Barang" />
      <PenerimaanBarangCreateForm
        nextNumber={getNextTransactionNumber(
          penerimaanBarang.map((item) => item.noPenerimaan),
          "PB",
          today
        )}
        tanggalTerima={toDateInput(today)}
        currentUserName={currentUser?.nama ?? ""}
        initialPurchaseOrderId={resolvedSearchParams.po}
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

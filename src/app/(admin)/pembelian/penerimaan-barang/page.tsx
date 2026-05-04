import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PenerimaanBarangList from "@/components/bengkel/pembelian/PenerimaanBarangList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Penerimaan Barang | Auto7",
  description: "Daftar penerimaan barang dari supplier",
};

export const dynamic = "force-dynamic";

export default async function PenerimaanBarangPage() {
  await requirePageAccess("penerimaan_barang");

  const penerimaanBarang = await prisma.penerimaanBarang.findMany({
    include: {
      purchaseOrder: {
        select: {
          noPurchaseOrder: true,
        },
      },
      supplier: {
        select: {
          nama: true,
        },
      },
      diterimaOleh: {
        select: {
          nama: true,
        },
      },
    },
    orderBy: {
      tanggalTerima: "desc",
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Penerimaan Barang" />
      <PenerimaanBarangList
        penerimaanBarang={penerimaanBarang.map((item) => ({
          id: item.id,
          noPenerimaan: item.noPenerimaan,
          noPurchaseOrder: item.purchaseOrder?.noPurchaseOrder ?? "",
          tanggal: item.tanggalTerima.toISOString(),
          supplier: item.supplier.nama,
          diterimaOleh: item.diterimaOleh?.nama ?? "",
          totalItem: item.totalItem,
          totalNilai: Number(item.totalNilai),
          status: item.status,
        }))}
      />
    </div>
  );
}

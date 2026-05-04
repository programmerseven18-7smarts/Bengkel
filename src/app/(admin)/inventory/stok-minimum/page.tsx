import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StokMinimumList from "@/components/bengkel/inventory/StokMinimumList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Stok Minimum | Auto7",
  description: "Daftar barang dengan stok di bawah minimum",
};

export const dynamic = "force-dynamic";

export default async function StokMinimumPage() {
  await requirePageAccess("stok_minimum");

  const spareparts = await prisma.sparepart.findMany({
    where: {
      status: "AKTIF",
    },
    orderBy: {
      nama: "asc",
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      stok: true,
      minStok: true,
      hargaBeli: true,
      kategori: {
        select: {
          nama: true,
        },
      },
      supplier: {
        select: {
          nama: true,
        },
      },
      satuan: {
        select: {
          nama: true,
        },
      },
    },
  });

  const lowStockItems = spareparts
    .filter((item) => item.minStok > 0 && item.stok < item.minStok)
    .map((item) => ({
      id: item.id,
      kode: item.kode,
      nama: item.nama,
      kategori: item.kategori?.nama ?? "-",
      supplier: item.supplier?.nama ?? "-",
      stok: item.stok,
      satuan: item.satuan?.nama ?? "",
      minStok: item.minStok,
      selisih: item.minStok - item.stok,
      hargaBeli: Number(item.hargaBeli),
    }))
    .sort((a, b) => b.selisih - a.selisih);

  return (
    <div>
      <PageBreadcrumb pageTitle="Alert Stok Minimum" />
      <StokMinimumList items={lowStockItems} />
    </div>
  );
}

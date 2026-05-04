import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StokMasukList from "@/components/bengkel/inventory/StokMasukList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Stok Masuk | Auto7",
  description: "Daftar stok masuk inventory bengkel",
};

export const dynamic = "force-dynamic";

export default async function StokMasukPage() {
  await requirePageAccess("stok_masuk");

  const stokMasuk = await prisma.stokMasuk.findMany({
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
      <PageBreadcrumb pageTitle="Stok Masuk" />
      <StokMasukList
        stokMasuk={stokMasuk.map((item) => ({
          id: item.id,
          noTransaksi: item.noTransaksi,
          tanggal: item.tanggal.toISOString(),
          supplier: item.supplier?.nama ?? "",
          sumber: item.sumber,
          totalItem: item.totalItem,
          totalNilai: Number(item.totalNilai),
          keterangan: item.catatan ?? item.referensi ?? "",
        }))}
      />
    </div>
  );
}

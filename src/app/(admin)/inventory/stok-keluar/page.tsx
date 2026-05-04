import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StokKeluarList from "@/components/bengkel/inventory/StokKeluarList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Stok Keluar | Auto7",
  description: "Daftar stok keluar inventory bengkel",
};

export const dynamic = "force-dynamic";

export default async function StokKeluarPage() {
  await requirePageAccess("stok_keluar");

  const stokKeluar = await prisma.stokKeluar.findMany({
    orderBy: {
      tanggal: "desc",
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Stok Keluar" />
      <StokKeluarList
        stokKeluar={stokKeluar.map((item) => ({
          id: item.id,
          noTransaksi: item.noTransaksi,
          tanggal: item.tanggal.toISOString(),
          referensi: item.referensi ?? "",
          tipe: item.tipe,
          totalItem: item.totalItem,
          totalNilai: Number(item.totalNilai),
        }))}
      />
    </div>
  );
}

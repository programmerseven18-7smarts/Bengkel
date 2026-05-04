import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MutasiStokList from "@/components/bengkel/inventory/MutasiStokList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Mutasi Stok | Auto7",
  description: "Riwayat mutasi stok inventory bengkel",
};

export const dynamic = "force-dynamic";

export default async function MutasiStokPage() {
  await requirePageAccess("mutasi_stok");

  const mutasi = await prisma.mutasiStok.findMany({
    include: {
      lokasiAsal: {
        select: {
          nama: true,
        },
      },
      lokasiTujuan: {
        select: {
          nama: true,
        },
      },
      penanggungJawab: {
        select: {
          nama: true,
        },
      },
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy: {
      tanggal: "desc",
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Mutasi Stok" />
      <MutasiStokList
        mutasi={mutasi.map((item) => ({
          id: item.id,
          noMutasi: item.noMutasi,
          tanggal: item.tanggal.toISOString(),
          lokasiAsal: item.lokasiAsal.nama,
          lokasiTujuan: item.lokasiTujuan.nama,
          penanggungJawab: item.penanggungJawab?.nama ?? "",
          totalQty: Number(item.totalQty),
          totalItem: item._count.items,
          catatan: item.catatan ?? "",
        }))}
      />
    </div>
  );
}

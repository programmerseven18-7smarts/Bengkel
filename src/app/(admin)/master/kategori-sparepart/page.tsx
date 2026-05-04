import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KategoriSparepartList from "@/components/bengkel/master/KategoriSparepartList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Kategori Sparepart | Auto7",
  description: "Master kategori sparepart",
};

export const dynamic = "force-dynamic";

export default async function KategoriSparepartPage() {
  await requirePageAccess("kategori_sparepart");

  const data = await prisma.kategoriSparepart.findMany({
    orderBy: {
      kode: "asc",
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      deskripsi: true,
      status: true,
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Kategori Sparepart" />
      <KategoriSparepartList
        nextCode={getNextSystemCode(data.map((item) => item.kode), "KSP")}
        data={data.map((item) => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          deskripsi: item.deskripsi ?? "",
          status: item.status,
        }))}
      />
    </div>
  );
}

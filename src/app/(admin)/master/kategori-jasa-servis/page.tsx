import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KategoriJasaServisList from "@/components/bengkel/master/KategoriJasaServisList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Kategori Jasa Servis | Auto7",
  description: "Master kategori jasa servis",
};

export const dynamic = "force-dynamic";

export default async function KategoriJasaServisPage() {
  await requirePageAccess("kategori_jasa_servis");

  const data = await prisma.kategoriJasaServis.findMany({
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
      <PageBreadcrumb pageTitle="Kategori Jasa Servis" />
      <KategoriJasaServisList
        nextCode={getNextSystemCode(data.map((item) => item.kode), "KJS")}
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

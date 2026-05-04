import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SatuanList from "@/components/bengkel/master/SatuanList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Satuan | Auto7",
  description: "Master satuan",
};

export const dynamic = "force-dynamic";

export default async function SatuanPage() {
  await requirePageAccess("satuan");

  const data = await prisma.satuan.findMany({
    orderBy: {
      kode: "asc",
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      jenis: true,
      deskripsi: true,
      status: true,
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Satuan" />
      <SatuanList
        nextCode={getNextSystemCode(data.map((item) => item.kode), "SAT")}
        data={data.map((item) => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          kategori: item.jenis ?? "",
          deskripsi: item.deskripsi ?? "",
          status: item.status,
        }))}
      />
    </div>
  );
}

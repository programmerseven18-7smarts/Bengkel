import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AlasanReturList from "@/components/bengkel/master/AlasanReturList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Alasan Retur | Auto7",
  description: "Master alasan retur",
};

export const dynamic = "force-dynamic";

export default async function AlasanReturPage() {
  await requirePageAccess("alasan_retur");

  const data = await prisma.alasanRetur.findMany({
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
      <PageBreadcrumb pageTitle="Alasan Retur" />
      <AlasanReturList
        nextCode={getNextSystemCode(data.map((item) => item.kode), "RTR")}
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

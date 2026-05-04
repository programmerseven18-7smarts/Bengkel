import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KondisiBarangList from "@/components/bengkel/master/KondisiBarangList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Kondisi Barang | Auto7",
  description: "Master kondisi barang",
};

export const dynamic = "force-dynamic";

export default async function KondisiBarangPage() {
  await requirePageAccess("kondisi_barang");

  const data = await prisma.kondisiBarang.findMany({
    orderBy: {
      kode: "asc",
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      kelompok: true,
      deskripsi: true,
      status: true,
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Kondisi Barang" />
      <KondisiBarangList
        nextCode={getNextSystemCode(data.map((item) => item.kode), "KON")}
        data={data.map((item) => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          kategori: item.kelompok ?? "",
          deskripsi: item.deskripsi ?? "",
          status: item.status,
        }))}
      />
    </div>
  );
}

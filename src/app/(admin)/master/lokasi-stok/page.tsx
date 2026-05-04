import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LokasiStokList from "@/components/bengkel/master/LokasiStokList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Lokasi Stok | Auto7",
  description: "Master lokasi stok",
};

export const dynamic = "force-dynamic";

export default async function LokasiStokPage() {
  await requirePageAccess("lokasi_stok");

  const data = await prisma.lokasiStok.findMany({
    orderBy: {
      kode: "asc",
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      tipe: true,
      deskripsi: true,
      status: true,
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Lokasi Stok" />
      <LokasiStokList
        nextCode={getNextSystemCode(data.map((item) => item.kode), "LOK")}
        data={data.map((item) => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          kategori: item.tipe ?? "",
          deskripsi: item.deskripsi ?? "",
          status: item.status,
        }))}
      />
    </div>
  );
}

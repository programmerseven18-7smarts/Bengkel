import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MerkKendaraanList from "@/components/bengkel/master/MerkKendaraanList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Merk Kendaraan | Auto7",
  description: "Master merk kendaraan",
};

export const dynamic = "force-dynamic";

export default async function MerkKendaraanPage() {
  await requirePageAccess("merk_kendaraan");

  const data = await prisma.merkKendaraan.findMany({
    orderBy: {
      kode: "asc",
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      jenisKendaraan: true,
      deskripsi: true,
      status: true,
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Merk Kendaraan" />
      <MerkKendaraanList
        nextCode={getNextSystemCode(data.map((item) => item.kode), "MRK")}
        data={data.map((item) => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          kategori: item.jenisKendaraan ?? "",
          deskripsi: item.deskripsi ?? "",
          status: item.status,
        }))}
      />
    </div>
  );
}

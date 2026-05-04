import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MetodePembayaranList from "@/components/bengkel/master/MetodePembayaranList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Metode Pembayaran | Auto7",
  description: "Master metode pembayaran",
};

export const dynamic = "force-dynamic";

export default async function MetodePembayaranPage() {
  await requirePageAccess("metode_pembayaran");

  const data = await prisma.metodePembayaran.findMany({
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
      <PageBreadcrumb pageTitle="Metode Pembayaran" />
      <MetodePembayaranList
        nextCode={getNextSystemCode(data.map((item) => item.kode), "PAY")}
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

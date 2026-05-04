import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MekanikList from "@/components/bengkel/master/MekanikList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Data Mekanik | Auto7",
  description: "Daftar mekanik bengkel",
};

export const dynamic = "force-dynamic";

export default async function MekanikPage() {
  await requirePageAccess("mekanik");

  const mekanik = await prisma.mekanik.findMany({
    orderBy: {
      kode: "asc",
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      noHp: true,
      spesialisasi: true,
      tanggalBergabung: true,
      rating: true,
      status: true,
      _count: {
        select: {
          workOrders: true,
        },
      },
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Mekanik" />
      <MekanikList
        nextCode={getNextSystemCode(
          mekanik.map((item) => item.kode),
          "MEK"
        )}
        mekanik={mekanik.map((item) => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          noHp: item.noHp ?? "",
          spesialisasi: item.spesialisasi ?? "",
          tanggalBergabung: item.tanggalBergabung?.toISOString().slice(0, 10) ?? "",
          totalServis: item._count.workOrders,
          rating: Number(item.rating),
          status: item.status,
        }))}
      />
    </div>
  );
}

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PelangganList from "@/components/bengkel/master/PelangganList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Data Pelanggan | Auto7",
  description: "Daftar pelanggan bengkel",
};

export const dynamic = "force-dynamic";

export default async function PelangganPage() {
  await requirePageAccess("pelanggan");

  const pelanggan = await prisma.pelanggan.findMany({
    orderBy: {
      kode: "asc",
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      noHp: true,
      email: true,
      alamat: true,
      status: true,
      _count: {
        select: {
          kendaraan: true,
          workOrders: true,
        },
      },
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Pelanggan" />
      <PelangganList
        nextCode={getNextSystemCode(
          pelanggan.map((item) => item.kode),
          "PLG"
        )}
        pelanggan={pelanggan.map((item) => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          noHp: item.noHp ?? "",
          email: item.email ?? "",
          alamat: item.alamat ?? "",
          totalKendaraan: item._count.kendaraan,
          totalServis: item._count.workOrders,
          status: item.status,
        }))}
      />
    </div>
  );
}

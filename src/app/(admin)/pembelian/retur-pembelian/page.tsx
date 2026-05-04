import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReturPembelianList from "@/components/bengkel/pembelian/ReturPembelianList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Retur Pembelian | Auto7",
  description: "Daftar retur pembelian ke supplier",
};

export const dynamic = "force-dynamic";

export default async function ReturPembelianPage() {
  await requirePageAccess("retur_pembelian");

  const returPembelian = await prisma.returPembelian.findMany({
    include: {
      supplier: {
        select: {
          nama: true,
        },
      },
      penerimaanBarang: {
        select: {
          noPenerimaan: true,
        },
      },
      alasanRetur: {
        select: {
          nama: true,
        },
      },
    },
    orderBy: {
      tanggalRetur: "desc",
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Retur Pembelian" />
      <ReturPembelianList
        returPembelian={returPembelian.map((item) => ({
          id: item.id,
          noRetur: item.noRetur,
          tanggal: item.tanggalRetur.toISOString(),
          supplier: item.supplier.nama,
          referensi: item.penerimaanBarang?.noPenerimaan ?? "",
          alasan: item.alasanRetur?.nama ?? "",
          totalItem: item.totalItem,
          totalNilai: Number(item.totalNilai),
          status: item.status,
        }))}
      />
    </div>
  );
}

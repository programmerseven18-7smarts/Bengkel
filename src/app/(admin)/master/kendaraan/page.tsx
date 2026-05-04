import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KendaraanList from "@/components/bengkel/master/KendaraanList";
import { prisma } from "@/lib/prisma";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Data Kendaraan | Auto7",
  description: "Daftar kendaraan pelanggan bengkel",
};

export const dynamic = "force-dynamic";

export default async function KendaraanPage() {
  await requirePageAccess("kendaraan");

  const [kendaraan, pelanggan, merk] = await Promise.all([
    prisma.kendaraan.findMany({
      orderBy: {
        platNomor: "asc",
      },
      select: {
        id: true,
        platNomor: true,
        merkId: true,
        tipe: true,
        tahun: true,
        warna: true,
        noRangka: true,
        noMesin: true,
        pelangganId: true,
        pelanggan: {
          select: {
            nama: true,
          },
        },
        merk: {
          select: {
            nama: true,
          },
        },
        _count: {
          select: {
            workOrders: true,
          },
        },
      },
    }),
    prisma.pelanggan.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
        noHp: true,
      },
    }),
    prisma.merkKendaraan.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
      },
    }),
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Kendaraan" />
      <KendaraanList
        pelangganOptions={pelanggan.map((item) => ({
          value: item.id,
          label: `${item.nama}${item.noHp ? ` - ${item.noHp}` : ""}`,
        }))}
        merkOptions={merk.map((item) => ({
          value: item.id,
          label: item.nama,
        }))}
        kendaraan={kendaraan.map((item) => ({
          id: item.id,
          platNomor: item.platNomor,
          merkId: item.merkId ?? "",
          merk: item.merk?.nama ?? "",
          tipe: item.tipe,
          tahun: item.tahun ? String(item.tahun) : "",
          warna: item.warna ?? "",
          noRangka: item.noRangka ?? "",
          noMesin: item.noMesin ?? "",
          pelangganId: item.pelangganId,
          pemilik: item.pelanggan.nama,
          totalServis: item._count.workOrders,
        }))}
      />
    </div>
  );
}

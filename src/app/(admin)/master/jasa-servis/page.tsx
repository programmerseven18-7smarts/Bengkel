import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import JasaServisList from "@/components/bengkel/master/JasaServisList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Data Jasa Servis | Auto7",
  description: "Daftar jasa servis bengkel",
};

export const dynamic = "force-dynamic";

export default async function JasaServisPage() {
  await requirePageAccess("jasa_servis");

  const [jasaServis, kategoriJasa] = await Promise.all([
    prisma.jasaServis.findMany({
      orderBy: {
        kode: "asc",
      },
      select: {
        id: true,
        kode: true,
        nama: true,
        kategoriId: true,
        harga: true,
        estimasiMenit: true,
        deskripsi: true,
        status: true,
        kategori: {
          select: {
            nama: true,
          },
        },
      },
    }),
    prisma.kategoriJasaServis.findMany({
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
      <PageBreadcrumb pageTitle="Data Jasa Servis" />
      <JasaServisList
        nextCode={getNextSystemCode(
          jasaServis.map((item) => item.kode),
          "JSV"
        )}
        kategoriOptions={kategoriJasa.map((kategori) => ({
          value: kategori.id,
          label: kategori.nama,
        }))}
        jasaServis={jasaServis.map((item) => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          kategoriId: item.kategoriId ?? "",
          kategori: item.kategori?.nama ?? "",
          harga: Number(item.harga),
          estimasiMenit: item.estimasiMenit ?? 0,
          deskripsi: item.deskripsi ?? "",
          status: item.status,
        }))}
      />
    </div>
  );
}

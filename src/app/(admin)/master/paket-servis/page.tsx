import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaketServisList from "@/components/bengkel/master/PaketServisList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Paket Servis | Auto7",
  description: "Daftar paket servis bengkel",
};

export const dynamic = "force-dynamic";

export default async function PaketServisPage() {
  await requirePageAccess("paket_servis");

  const paketServis = await prisma.paketServis.findMany({
    include: {
      jasaItems: {
        include: {
          jasaServis: {
            select: {
              nama: true,
            },
          },
        },
      },
      sparepartItems: {
        include: {
          sparepart: {
            select: {
              nama: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Paket Servis" />
      <PaketServisList
        paketServis={paketServis.map((item) => {
          const jasaTotal = item.jasaItems.reduce(
            (sum, jasa) => sum + Number(jasa.hargaNormal),
            0
          );
          const sparepartTotal = item.sparepartItems.reduce(
            (sum, sparepart) =>
              sum + Number(sparepart.qty) * Number(sparepart.hargaNormal),
            0
          );
          const isiPaket = [
            ...item.jasaItems.map((jasa) => jasa.jasaServis.nama),
            ...item.sparepartItems.map((sparepart) => sparepart.sparepart.nama),
          ].join(", ");

          return {
            id: item.id,
            kode: item.kode,
            nama: item.nama,
            kategori: item.jenisKendaraan ?? "-",
            isiPaket,
            hargaNormal: jasaTotal + sparepartTotal,
            hargaPaket: Number(item.hargaPaket),
            estimasiWaktu: item.estimasiMenit
              ? `${item.estimasiMenit} menit`
              : "-",
            status: item.status,
          };
        })}
      />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaketServisCreateForm from "@/components/bengkel/master/PaketServisCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getNextSystemCode } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Paket Servis | Auto7",
  description: "Edit paket servis bengkel",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPaketServisPage({ params }: PageProps) {
  await requirePageAccess("paket_servis", "edit");

  const { id } = await params;
  const [paket, existingCodes, jasaServis, spareparts] = await Promise.all([
    prisma.paketServis.findUnique({
      where: {
        id,
      },
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
              include: {
                satuan: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.paketServis.findMany({
      select: {
        kode: true,
      },
    }),
    prisma.jasaServis.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        kode: true,
        nama: true,
        estimasiMenit: true,
        harga: true,
      },
    }),
    prisma.sparepart.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        kode: true,
        nama: true,
        hargaJual: true,
        satuan: {
          select: {
            nama: true,
          },
        },
      },
    }),
  ]);

  if (!paket) {
    notFound();
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Paket Servis" />
      <PaketServisCreateForm
        mode="edit"
        nextCode={getNextSystemCode(
          existingCodes.map((item) => item.kode),
          "PKT"
        )}
        initialData={{
          id: paket.id,
          kode: paket.kode,
          nama: paket.nama,
          jenisKendaraan: paket.jenisKendaraan ?? "",
          estimasiMenit: paket.estimasiMenit ?? 0,
          hargaPaket: Number(paket.hargaPaket),
          catatan: paket.catatan ?? "",
          status: paket.status,
          jasaItems: paket.jasaItems.map((item) => ({
            jasaServisId: item.jasaServisId,
            nama: item.jasaServis.nama,
            estimasiMenit: item.estimasiMenit ?? 0,
            hargaNormal: Number(item.hargaNormal),
          })),
          sparepartItems: paket.sparepartItems.map((item) => ({
            sparepartId: item.sparepartId,
            nama: item.sparepart.nama,
            qty: Number(item.qty),
            satuan: item.sparepart.satuan?.nama ?? "",
            hargaNormal: Number(item.hargaNormal),
          })),
        }}
        jasaOptions={jasaServis.map((item) => ({
          value: item.id,
          label: `${item.kode} - ${item.nama}`,
          nama: item.nama,
          estimasiMenit: item.estimasiMenit ?? 0,
          harga: Number(item.harga),
        }))}
        sparepartOptions={spareparts.map((item) => ({
          value: item.id,
          label: `${item.kode} - ${item.nama}`,
          nama: item.nama,
          satuan: item.satuan?.nama ?? "",
          harga: Number(item.hargaJual),
        }))}
      />
    </div>
  );
}

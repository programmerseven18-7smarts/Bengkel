import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaketServisCreateForm from "@/components/bengkel/master/PaketServisCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getNextSystemCode } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tambah Paket Servis | Auto7",
  description: "Buat paket servis dengan detail jasa dan sparepart",
};

export const dynamic = "force-dynamic";

export default async function CreatePaketServisPage() {
  await requirePageAccess("paket_servis", "create");

  const [existingCodes, jasaServis, spareparts] = await Promise.all([
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Paket Servis" />
      <PaketServisCreateForm
        nextCode={getNextSystemCode(
          existingCodes.map((item) => item.kode),
          "PKT"
        )}
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

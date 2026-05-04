import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MutasiStokCreateForm from "@/components/bengkel/inventory/MutasiStokCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Buat Mutasi Stok | Auto7",
  description: "Input mutasi stok antar lokasi",
};

export const dynamic = "force-dynamic";

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

export default async function CreateMutasiStokPage() {
  const currentUser = await requirePageAccess("mutasi_stok", "create");

  const today = new Date();
  const [existingNumbers, lokasi, spareparts] = await Promise.all([
    prisma.mutasiStok.findMany({
      select: {
        noMutasi: true,
      },
    }),
    prisma.lokasiStok.findMany({
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
        stok: true,
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
      <PageBreadcrumb pageTitle="Buat Mutasi Stok" />
      <MutasiStokCreateForm
        nextNumber={getNextTransactionNumber(
          existingNumbers.map((item) => item.noMutasi),
          "MT",
          today
        )}
        today={toDateInput(today)}
        currentUserName={currentUser.nama}
        lokasiOptions={lokasi.map((item) => ({
          value: item.id,
          label: item.nama,
        }))}
        spareparts={spareparts.map((item) => ({
          value: item.id,
          label: `${item.kode} - ${item.nama}`,
          nama: item.nama,
          stok: item.stok,
          satuan: item.satuan?.nama ?? "",
        }))}
      />
    </div>
  );
}

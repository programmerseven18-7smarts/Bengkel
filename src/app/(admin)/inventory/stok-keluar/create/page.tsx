import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StokKeluarCreateForm from "@/components/bengkel/inventory/StokKeluarCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tambah Stok Keluar | Auto7",
  description: "Input transaksi stok keluar",
};

export const dynamic = "force-dynamic";

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

export default async function CreateStokKeluarPage() {
  await requirePageAccess("stok_keluar", "create");

  const today = new Date();
  const [existingNumbers, spareparts] = await Promise.all([
    prisma.stokKeluar.findMany({
      select: {
        noTransaksi: true,
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
        hargaBeli: true,
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
      <PageBreadcrumb pageTitle="Tambah Stok Keluar" />
      <StokKeluarCreateForm
        nextNumber={getNextTransactionNumber(
          existingNumbers.map((item) => item.noTransaksi),
          "SK",
          today
        )}
        today={toDateInput(today)}
        spareparts={spareparts.map((item) => ({
          value: item.id,
          label: `${item.kode} - ${item.nama}`,
          nama: item.nama,
          stok: item.stok,
          satuan: item.satuan?.nama ?? "",
          hargaModal: Number(item.hargaBeli),
        }))}
      />
    </div>
  );
}

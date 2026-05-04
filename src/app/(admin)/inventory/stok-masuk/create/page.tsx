import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StokMasukCreateForm from "@/components/bengkel/inventory/StokMasukCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tambah Stok Masuk | Auto7",
  description: "Input transaksi stok masuk",
};

export const dynamic = "force-dynamic";

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

export default async function CreateStokMasukPage() {
  await requirePageAccess("stok_masuk", "create");

  const today = new Date();
  const [existingNumbers, suppliers, spareparts] = await Promise.all([
    prisma.stokMasuk.findMany({
      select: {
        noTransaksi: true,
      },
    }),
    prisma.supplier.findMany({
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
      <PageBreadcrumb pageTitle="Tambah Stok Masuk" />
      <StokMasukCreateForm
        nextNumber={getNextTransactionNumber(
          existingNumbers.map((item) => item.noTransaksi),
          "SM",
          today
        )}
        today={toDateInput(today)}
        suppliers={suppliers.map((item) => ({
          value: item.id,
          label: item.nama,
        }))}
        spareparts={spareparts.map((item) => ({
          value: item.id,
          label: `${item.kode} - ${item.nama}`,
          nama: item.nama,
          satuan: item.satuan?.nama ?? "",
          hargaModal: Number(item.hargaBeli),
        }))}
      />
    </div>
  );
}

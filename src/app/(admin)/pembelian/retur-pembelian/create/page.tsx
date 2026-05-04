import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReturPembelianCreateForm from "@/components/bengkel/pembelian/ReturPembelianCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Buat Retur Pembelian | Auto7",
  description: "Input retur pembelian sparepart",
};

export const dynamic = "force-dynamic";

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

export default async function CreateReturPembelianPage({
  searchParams,
}: {
  searchParams?: Promise<{ penerimaan?: string }>;
}) {
  await requirePageAccess("retur_pembelian", "create");

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [returPembelian, penerimaanBarang, alasanRetur] = await Promise.all([
    prisma.returPembelian.findMany({
      select: {
        noRetur: true,
      },
    }),
    prisma.penerimaanBarang.findMany({
      where: {
        status: {
          in: ["PARSIAL", "SELESAI"],
        },
      },
      include: {
        supplier: {
          select: {
            nama: true,
          },
        },
        items: {
          orderBy: {
            id: "asc",
          },
          select: {
            id: true,
            sparepartId: true,
            namaSparepart: true,
            qtyTerima: true,
            satuan: true,
            hargaBeli: true,
          },
        },
      },
      orderBy: {
        tanggalTerima: "desc",
      },
    }),
    prisma.alasanRetur.findMany({
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
  const today = new Date();

  return (
    <div>
      <PageBreadcrumb pageTitle="Buat Retur Pembelian" />
      <ReturPembelianCreateForm
        nextNumber={getNextTransactionNumber(
          returPembelian.map((item) => item.noRetur),
          "RB",
          today
        )}
        tanggalRetur={toDateInput(today)}
        initialPenerimaanId={resolvedSearchParams.penerimaan}
        penerimaanOptions={penerimaanBarang.map((item) => ({
          value: item.id,
          label: `${item.noPenerimaan} - ${item.supplier.nama}`,
          supplier: item.supplier.nama,
          items: item.items.map((detail) => ({
            penerimaanBarangItemId: detail.id,
            sparepartId: detail.sparepartId ?? "",
            namaSparepart: detail.namaSparepart,
            qtyDiterima: Number(detail.qtyTerima),
            satuan: detail.satuan ?? "",
            hargaBeli: Number(detail.hargaBeli),
          })),
        }))}
        alasanOptions={alasanRetur.map((item) => ({
          value: item.id,
          label: item.nama,
        }))}
      />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReturPembelianCreateForm from "@/components/bengkel/pembelian/ReturPembelianCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit Retur Pembelian | Auto7",
  description: "Edit draft retur pembelian sparepart",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

export default async function EditReturPembelianPage({ params }: PageProps) {
  await requirePageAccess("retur_pembelian", "edit");

  const { id } = await params;
  const [retur, penerimaanBarang, alasanRetur] = await Promise.all([
    prisma.returPembelian.findUnique({
      where: {
        id,
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
        },
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

  if (!retur || retur.status !== "DRAFT") notFound();

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Retur Pembelian" />
      <ReturPembelianCreateForm
        mode="edit"
        initialData={{
          id: retur.id,
          penerimaanBarangId: retur.penerimaanBarangId ?? "",
          supplier: retur.supplier.nama,
          alasanReturId: retur.alasanReturId ?? "",
          catatan: retur.catatan ?? "",
          rows: retur.items.map((item, index) => ({
            id: index + 1,
            penerimaanBarangItemId: item.penerimaanBarangItemId ?? "",
            sparepartId: item.sparepartId ?? "",
            alasanReturId: item.alasanReturId ?? "",
            namaSparepart: item.namaSparepart,
            qtyDiterima: Number(item.qtyDiterima),
            qtyRetur: Number(item.qtyRetur),
            satuan: item.satuan ?? "",
            hargaBeli: Number(item.hargaBeli),
          })),
        }}
        nextNumber={retur.noRetur}
        tanggalRetur={toDateInput(retur.tanggalRetur)}
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

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InvoiceCreateForm from "@/components/bengkel/keuangan/InvoiceCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Buat Invoice | Auto7",
  description: "Buat invoice dari work order",
};

export const dynamic = "force-dynamic";

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

export default async function CreateInvoicePage() {
  await requirePageAccess("invoice", "create");

  const today = new Date();
  const [existingNumbers, workOrders, jasaServis, spareparts] = await Promise.all([
    prisma.invoice.findMany({
      select: {
        noInvoice: true,
      },
    }),
    prisma.workOrder.findMany({
      where: {
        status: "SELESAI",
        invoice: null,
      },
      include: {
        pelanggan: {
          select: {
            id: true,
            nama: true,
          },
        },
        kendaraan: {
          include: {
            merk: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
      orderBy: {
        tanggalMasuk: "desc",
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
        nama: true,
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
        nama: true,
        hargaJual: true,
      },
    }),
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Buat Invoice" />
      <InvoiceCreateForm
        nextNumber={getNextTransactionNumber(
          existingNumbers.map((item) => item.noInvoice),
          "INV",
          today
        )}
        today={toDateInput(today)}
        workOrders={workOrders.map((item) => ({
          value: item.id,
          label: `${item.noWorkOrder} - ${item.pelanggan.nama}`,
          pelangganId: item.pelanggan.id,
          pelangganNama: item.pelanggan.nama,
          kendaraanId: item.kendaraanId,
          kendaraanNama: `${item.kendaraan.merk?.nama ?? ""} ${item.kendaraan.tipe} - ${item.kendaraan.platNomor}`.trim(),
        }))}
        itemOptions={[
          ...jasaServis.map((item) => ({
            value: `JASA:${item.id}`,
            label: `Jasa - ${item.nama}`,
            sourceType: "JASA" as const,
            sourceId: item.id,
            deskripsi: item.nama,
            tipe: "JASA" as const,
            harga: Number(item.harga),
          })),
          ...spareparts.map((item) => ({
            value: `SPAREPART:${item.id}`,
            label: `Sparepart - ${item.nama}`,
            sourceType: "SPAREPART" as const,
            sourceId: item.id,
            deskripsi: item.nama,
            tipe: "SPAREPART" as const,
            harga: Number(item.hargaJual),
          })),
        ]}
      />
    </div>
  );
}

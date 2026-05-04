import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InvoiceList from "@/components/bengkel/keuangan/InvoiceList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InvoicePage() {
  await requirePageAccess("invoice");

  const [invoices, metodePembayaran, akunKasBank] = await Promise.all([
    prisma.invoice.findMany({
      include: {
        workOrder: {
          select: {
            noWorkOrder: true,
          },
        },
        pelanggan: {
          select: {
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
        tanggalInvoice: "desc",
      },
    }),
    prisma.metodePembayaran.findMany({
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
    prisma.akunKasBank.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
        tipe: true,
      },
    }),
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Invoice" />
      <div className="space-y-6">
        <InvoiceList
          invoices={invoices.map((item) => ({
            id: item.id,
            noInvoice: item.noInvoice,
            noWorkOrder: item.workOrder?.noWorkOrder ?? "",
            tanggal: item.tanggalInvoice.toISOString(),
            pelanggan: item.pelanggan.nama,
            kendaraan: item.kendaraan
              ? `${item.kendaraan.merk?.nama ?? ""} ${item.kendaraan.tipe} - ${item.kendaraan.platNomor}`.trim()
              : "-",
            totalJasa: Number(item.totalJasa),
            totalSparepart: Number(item.totalSparepart),
            grandTotal: Number(item.grandTotal),
            sisaTagihan: Number(item.sisaTagihan),
            status: item.status,
          }))}
          metodePembayaranOptions={metodePembayaran.map((item) => ({
            value: item.id,
            label: item.nama,
          }))}
          akunKasBankOptions={akunKasBank.map((item) => ({
            value: item.id,
            label: `${item.nama} (${item.tipe})`,
          }))}
        />
      </div>
    </div>
  );
}

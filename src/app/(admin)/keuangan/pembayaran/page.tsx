import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PembayaranList from "@/components/bengkel/keuangan/PembayaranList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PembayaranPage() {
  await requirePageAccess("pembayaran");

  const pembayaran = await prisma.pembayaran.findMany({
    include: {
      invoice: {
        select: {
          id: true,
          noInvoice: true,
        },
      },
      pelanggan: {
        select: {
          nama: true,
        },
      },
      metodePembayaran: {
        select: {
          nama: true,
        },
      },
      kasir: {
        select: {
          nama: true,
        },
      },
    },
    orderBy: {
      tanggal: "desc",
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Pembayaran" />
      <div className="space-y-6">
        <PembayaranList
          pembayaran={pembayaran.map((item) => ({
            id: item.id,
            noPembayaran: item.noPembayaran,
            noInvoice: item.invoice.noInvoice,
            invoiceId: item.invoice.id,
            tanggal: item.tanggal.toISOString(),
            pelanggan: item.pelanggan?.nama ?? "",
            jumlahBayar: Number(item.jumlahBayar),
            metodePembayaran: item.metodePembayaran?.nama ?? "",
            nomorReferensi: item.nomorReferensi ?? "",
            kasir: item.kasir?.nama ?? "",
            status: item.status,
          }))}
        />
      </div>
    </div>
  );
}

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PiutangList from "@/components/bengkel/keuangan/PiutangList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PiutangPage() {
  await requirePageAccess("piutang");

  const piutang = await prisma.piutang.findMany({
    include: {
      invoice: {
        select: {
          id: true,
          noInvoice: true,
        },
      },
      pelanggan: {
        select: {
          id: true,
          nama: true,
          noHp: true,
        },
      },
    },
    orderBy: {
      tanggal: "desc",
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Piutang" />
      <PiutangList
        piutang={piutang.map((item) => ({
          id: item.id,
          invoiceId: item.invoice.id,
          noInvoice: item.invoice.noInvoice,
          tanggal: item.tanggal.toISOString(),
          jatuhTempo: item.jatuhTempo?.toISOString() ?? null,
          pelanggan: item.pelanggan.nama,
          pelangganId: item.pelanggan.id,
          noHp: item.pelanggan.noHp ?? "",
          totalTagihan: Number(item.totalTagihan),
          terbayar: Number(item.terbayar),
          sisaPiutang: Number(item.sisaPiutang),
          status: item.status,
        }))}
      />
    </div>
  );
}

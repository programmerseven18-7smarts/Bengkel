import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KasBankList from "@/components/bengkel/keuangan/KasBankList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function KasBankPage() {
  await requirePageAccess("kas_bank");

  const [akunKasBank, transactions] = await Promise.all([
    prisma.akunKasBank.findMany({
      include: {
        kasBankTransaksi: {
          orderBy: [
            {
              tanggal: "desc",
            },
            {
              createdAt: "desc",
            },
          ],
          take: 1,
        },
      },
      orderBy: {
        nama: "asc",
      },
    }),
    prisma.kasBankTransaksi.findMany({
      include: {
        akunKasBank: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      orderBy: [
        {
          tanggal: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 200,
    }),
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Kas & Bank" />
      <div className="space-y-6">
        <KasBankList
          akunSummary={akunKasBank.map((akun) => ({
            id: akun.id,
            kode: akun.kode,
            nama: akun.nama,
            tipe: akun.tipe,
            saldo: Number(akun.kasBankTransaksi[0]?.saldoAkhir ?? akun.saldoAwal),
          }))}
          transactions={transactions.map((item) => ({
            id: item.id,
            noTransaksi: item.noTransaksi,
            tanggal: item.tanggal.toISOString(),
            jenis: item.jenis,
            kategori: item.kategori,
            deskripsi: item.deskripsi ?? "",
            jumlah: Number(item.jumlah),
            akun: item.akunKasBank.nama,
            akunId: item.akunKasBank.id,
            saldoAkhir: Number(item.saldoAkhir),
          }))}
        />
      </div>
    </div>
  );
}

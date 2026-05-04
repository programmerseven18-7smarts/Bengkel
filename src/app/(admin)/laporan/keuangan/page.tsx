import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LaporanKeuangan from "@/components/bengkel/laporan/LaporanKeuangan";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const monthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
});

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default async function LaporanKeuanganPage() {
  await requirePageAccess("laporan_keuangan");

  const [invoices, kasBank] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        status: {
          notIn: ["DRAFT", "BATAL"],
        },
      },
      select: {
        tanggalInvoice: true,
        totalJasa: true,
        totalSparepart: true,
        totalLainnya: true,
      },
    }),
    prisma.kasBankTransaksi.findMany({
      select: {
        tanggal: true,
        jenis: true,
        kategori: true,
        jumlah: true,
      },
      orderBy: {
        tanggal: "desc",
      },
    }),
  ]);

  const pendapatanMap = new Map<string, { kategori: string; jumlah: number; tahun: string }>();
  const addPendapatan = (tahun: string, kategori: string, jumlah: number) => {
    if (jumlah <= 0) return;
    const key = `${tahun}-${kategori}`;
    const existing =
      pendapatanMap.get(key) ??
      {
        kategori,
        jumlah: 0,
        tahun,
      };
    existing.jumlah += jumlah;
    pendapatanMap.set(key, existing);
  };

  for (const invoice of invoices) {
    const tahun = String(invoice.tanggalInvoice.getFullYear());
    addPendapatan(tahun, "Jasa Servis", Number(invoice.totalJasa));
    addPendapatan(tahun, "Penjualan Sparepart", Number(invoice.totalSparepart));
    addPendapatan(tahun, "Pendapatan Lainnya", Number(invoice.totalLainnya));
  }

  const pengeluaranMap = new Map<string, { kategori: string; jumlah: number; tahun: string }>();
  const arusKasMap = new Map<
    string,
    {
      bulan: string;
      tahun: string;
      pendapatan: number;
      pengeluaran: number;
      netCashFlow: number;
    }
  >();

  for (const item of kasBank) {
    const tahun = String(item.tanggal.getFullYear());
    const amount = Number(item.jumlah);
    const monthKey = getMonthKey(item.tanggal);
    const cashRow =
      arusKasMap.get(monthKey) ??
      {
        bulan: monthFormatter.format(item.tanggal),
        tahun,
        pendapatan: 0,
        pengeluaran: 0,
        netCashFlow: 0,
      };

    if (item.jenis === "MASUK") {
      cashRow.pendapatan += amount;
    } else {
      cashRow.pengeluaran += amount;
      const key = `${tahun}-${item.kategori}`;
      const existing =
        pengeluaranMap.get(key) ??
        {
          kategori: item.kategori,
          jumlah: 0,
          tahun,
        };
      existing.jumlah += amount;
      pengeluaranMap.set(key, existing);
    }

    cashRow.netCashFlow = cashRow.pendapatan - cashRow.pengeluaran;
    arusKasMap.set(monthKey, cashRow);
  }

  const today = new Date();
  const years = Array.from(
    new Set(
      [
        String(today.getFullYear()),
        ...invoices.map((item) => String(item.tanggalInvoice.getFullYear())),
        ...kasBank.map((item) => String(item.tanggal.getFullYear())),
      ]
    )
  ).sort((a, b) => Number(b) - Number(a));

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Keuangan" />
      <div className="space-y-6">
        <LaporanKeuangan
          pendapatanData={Array.from(pendapatanMap.values()).sort((a, b) =>
            a.kategori.localeCompare(b.kategori)
          )}
          pengeluaranData={Array.from(pengeluaranMap.values()).sort((a, b) =>
            a.kategori.localeCompare(b.kategori)
          )}
          arusKasBulanan={Array.from(arusKasMap.entries())
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([, value]) => value)}
          years={years}
          defaultYear={String(today.getFullYear())}
        />
      </div>
    </div>
  );
}

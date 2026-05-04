import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LaporanServis from "@/components/bengkel/laporan/LaporanServis";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const monthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
});

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default async function LaporanServisPage() {
  await requirePageAccess("laporan_servis");

  const [workOrders, workOrderJasa] = await Promise.all([
    prisma.workOrder.findMany({
      select: {
        tanggalMasuk: true,
        status: true,
        totalJasa: true,
        totalSparepart: true,
        grandTotal: true,
      },
      orderBy: {
        tanggalMasuk: "desc",
      },
    }),
    prisma.workOrderJasa.findMany({
      select: {
        namaJasa: true,
        harga: true,
      },
    }),
  ]);

  const today = new Date();
  const currentMonthKey = getMonthKey(today);
  const currentMonthWorkOrders = workOrders.filter(
    (item) => getMonthKey(item.tanggalMasuk) === currentMonthKey
  );
  const currentMonthSelesai = currentMonthWorkOrders.filter(
    (item) => item.status === "SELESAI"
  ).length;

  const monthlyMap = new Map<
    string,
    {
      periode: string;
      tahun: string;
      totalWO: number;
      selesai: number;
      pending: number;
      pendapatanJasa: number;
      pendapatanSparepart: number;
      totalPendapatan: number;
    }
  >();

  for (const item of workOrders) {
    const key = getMonthKey(item.tanggalMasuk);
    const existing =
      monthlyMap.get(key) ??
      {
        periode: monthFormatter.format(item.tanggalMasuk),
        tahun: String(item.tanggalMasuk.getFullYear()),
        totalWO: 0,
        selesai: 0,
        pending: 0,
        pendapatanJasa: 0,
        pendapatanSparepart: 0,
        totalPendapatan: 0,
      };

    existing.totalWO += 1;
    if (item.status === "SELESAI") {
      existing.selesai += 1;
    } else if (item.status !== "BATAL") {
      existing.pending += 1;
    }
    existing.pendapatanJasa += Number(item.totalJasa);
    existing.pendapatanSparepart += Number(item.totalSparepart);
    existing.totalPendapatan += Number(item.grandTotal);
    monthlyMap.set(key, existing);
  }

  const laporanData = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, value]) => value);

  const jasaMap = new Map<string, { nama: string; jumlah: number; pendapatan: number }>();
  for (const item of workOrderJasa) {
    const existing =
      jasaMap.get(item.namaJasa) ??
      {
        nama: item.namaJasa,
        jumlah: 0,
        pendapatan: 0,
      };
    existing.jumlah += 1;
    existing.pendapatan += Number(item.harga);
    jasaMap.set(item.namaJasa, existing);
  }

  const years = Array.from(
    new Set(laporanData.map((item) => item.tahun).concat(String(today.getFullYear())))
  ).sort((a, b) => Number(b) - Number(a));

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Servis" />
      <div className="space-y-6">
        <LaporanServis
          summary={{
            totalWO: currentMonthWorkOrders.length,
            rataRataWoHarian: currentMonthWorkOrders.length / today.getDate(),
            pendapatanJasa: currentMonthWorkOrders.reduce(
              (total, item) => total + Number(item.totalJasa),
              0
            ),
            tingkatPenyelesaian:
              currentMonthWorkOrders.length > 0
                ? (currentMonthSelesai / currentMonthWorkOrders.length) * 100
                : 0,
          }}
          laporanData={laporanData}
          jasaPopuler={Array.from(jasaMap.values())
            .sort((a, b) => b.jumlah - a.jumlah)
            .slice(0, 5)}
          years={years}
          defaultYear={String(today.getFullYear())}
        />
      </div>
    </div>
  );
}

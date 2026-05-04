import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LaporanStok from "@/components/bengkel/laporan/LaporanStok";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LaporanStokPage() {
  await requirePageAccess("laporan_stok");

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [spareparts, ledger] = await Promise.all([
    prisma.sparepart.findMany({
      where: {
        status: "AKTIF",
      },
      include: {
        kategori: {
          select: {
            nama: true,
          },
        },
      },
      orderBy: {
        nama: "asc",
      },
    }),
    prisma.stokLedger.findMany({
      where: {
        tanggal: {
          gte: startOfMonth,
        },
      },
      select: {
        sparepartId: true,
        qtyMasuk: true,
        qtyKeluar: true,
      },
    }),
  ]);

  const movementMap = new Map<string, { masuk: number; keluar: number }>();
  for (const item of ledger) {
    const existing =
      movementMap.get(item.sparepartId) ??
      {
        masuk: 0,
        keluar: 0,
      };
    existing.masuk += Number(item.qtyMasuk);
    existing.keluar += Number(item.qtyKeluar);
    movementMap.set(item.sparepartId, existing);
  }

  const stokData = spareparts.map((item) => {
    const movement = movementMap.get(item.id) ?? { masuk: 0, keluar: 0 };
    const stokAkhir = item.stok;
    const stokAwal = stokAkhir - movement.masuk + movement.keluar;
    const nilaiStok = stokAkhir * Number(item.hargaBeli);

    return {
      kode: item.kode,
      nama: item.nama,
      kategori: item.kategori?.nama ?? "Tanpa Kategori",
      stokAwal,
      masuk: movement.masuk,
      keluar: movement.keluar,
      stokAkhir,
      minStok: item.minStok,
      nilaiStok,
    };
  });

  const kategoriMap = new Map<string, { nama: string; totalItem: number; nilaiStok: number }>();
  for (const item of stokData) {
    const existing =
      kategoriMap.get(item.kategori) ??
      {
        nama: item.kategori,
        totalItem: 0,
        nilaiStok: 0,
      };
    existing.totalItem += 1;
    existing.nilaiStok += item.nilaiStok;
    kategoriMap.set(item.kategori, existing);
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Stok" />
      <div className="space-y-6">
        <LaporanStok
          summary={{
            totalSku: spareparts.length,
            totalUnit: stokData.reduce((total, item) => total + item.stokAkhir, 0),
            totalNilaiStok: stokData.reduce((total, item) => total + item.nilaiStok, 0),
            stokMinimum: stokData.filter(
              (item) => item.stokAkhir <= item.minStok
            ).length,
          }}
          stokData={stokData}
          kategoriSummary={Array.from(kategoriMap.values()).sort((a, b) =>
            a.nama.localeCompare(b.nama)
          )}
        />
      </div>
    </div>
  );
}

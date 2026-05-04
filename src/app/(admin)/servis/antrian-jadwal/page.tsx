import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AntrianJadwalServis from "@/components/bengkel/servis/AntrianJadwalServis";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AntrianJadwalPage() {
  await requirePageAccess("antrian_jadwal");

  const [jadwal, pelanggan, kendaraan, jasaServis, mekanik] = await Promise.all([
    prisma.jadwalServis.findMany({
      orderBy: [
        {
          tanggal: "asc",
        },
        {
          jam: "asc",
        },
      ],
      select: {
        id: true,
        noJadwal: true,
        tanggal: true,
        jam: true,
        keluhan: true,
        status: true,
        pelangganId: true,
        kendaraanId: true,
        jasaServisId: true,
        mekanikId: true,
        pelanggan: {
          select: {
            nama: true,
          },
        },
        kendaraan: {
          select: {
            platNomor: true,
            tipe: true,
            merk: {
              select: {
                nama: true,
              },
            },
          },
        },
        jasaServis: {
          select: {
            nama: true,
            estimasiMenit: true,
          },
        },
        mekanik: {
          select: {
            nama: true,
          },
        },
      },
    }),
    prisma.pelanggan.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
        noHp: true,
      },
    }),
    prisma.kendaraan.findMany({
      orderBy: {
        platNomor: "asc",
      },
      select: {
        id: true,
        platNomor: true,
        tipe: true,
        pelanggan: {
          select: {
            nama: true,
          },
        },
        merk: {
          select: {
            nama: true,
          },
        },
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
        estimasiMenit: true,
      },
    }),
    prisma.mekanik.findMany({
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Antrian & Jadwal Servis" />
      <AntrianJadwalServis
        pelangganOptions={pelanggan.map((item) => ({
          value: item.id,
          label: `${item.nama}${item.noHp ? ` - ${item.noHp}` : ""}`,
        }))}
        kendaraanOptions={kendaraan.map((item) => ({
          value: item.id,
          label: `${item.platNomor} - ${`${item.merk?.nama ?? ""} ${item.tipe}`.trim()} - ${item.pelanggan.nama}`,
        }))}
        jasaOptions={jasaServis.map((item) => ({
          value: item.id,
          label: `${item.nama}${item.estimasiMenit ? ` - ${item.estimasiMenit} menit` : ""}`,
        }))}
        mekanikOptions={mekanik.map((item) => ({
          value: item.id,
          label: item.nama,
        }))}
        jadwal={jadwal.map((item) => ({
          id: item.id,
          noJadwal: item.noJadwal,
          tanggal: item.tanggal.toISOString(),
          jam: item.jam ?? "",
          pelanggan: item.pelanggan.nama,
          pelangganId: item.pelangganId,
          kendaraan: `${item.kendaraan.merk?.nama ?? ""} ${item.kendaraan.tipe}`.trim(),
          kendaraanId: item.kendaraanId,
          platNomor: item.kendaraan.platNomor,
          jasaServis: item.jasaServis?.nama ?? "",
          jasaServisId: item.jasaServisId ?? "",
          mekanik: item.mekanik?.nama ?? "",
          mekanikId: item.mekanikId ?? "",
          estimasiDurasi: item.jasaServis?.estimasiMenit
            ? `${item.jasaServis.estimasiMenit} menit`
            : "",
          keluhan: item.keluhan ?? "",
          status: item.status,
        }))}
      />
    </div>
  );
}

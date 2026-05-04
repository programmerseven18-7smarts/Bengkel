import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReminderServisList from "@/components/bengkel/servis/ReminderServisList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Reminder Servis | Auto7",
  description: "Daftar reminder servis pelanggan",
};

export const dynamic = "force-dynamic";

export default async function ReminderServisPage() {
  await requirePageAccess("reminder_servis");

  const [reminders, pelanggan, kendaraan] = await Promise.all([
    prisma.reminderServis.findMany({
      orderBy: {
        jatuhTempo: "asc",
      },
      select: {
        id: true,
        jenisReminder: true,
        jatuhTempo: true,
        kanal: true,
        status: true,
        catatan: true,
        pelangganId: true,
        kendaraanId: true,
        pelanggan: {
          select: {
            nama: true,
            noHp: true,
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
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Reminder Servis" />
      <ReminderServisList
        pelangganOptions={pelanggan.map((item) => ({
          value: item.id,
          label: `${item.nama}${item.noHp ? ` - ${item.noHp}` : ""}`,
        }))}
        kendaraanOptions={kendaraan.map((item) => ({
          value: item.id,
          label: `${item.platNomor} - ${`${item.merk?.nama ?? ""} ${item.tipe}`.trim()} - ${item.pelanggan.nama}`,
        }))}
        reminders={reminders.map((item) => ({
          id: item.id,
          pelangganId: item.pelangganId,
          pelanggan: item.pelanggan.nama,
          noHp: item.pelanggan.noHp ?? "",
          kendaraanId: item.kendaraanId,
          kendaraan: `${item.kendaraan.merk?.nama ?? ""} ${item.kendaraan.tipe}`.trim(),
          platNomor: item.kendaraan.platNomor,
          jenisReminder: item.jenisReminder,
          jatuhTempo: item.jatuhTempo.toISOString(),
          kanal: item.kanal,
          status: item.status,
          catatan: item.catatan ?? "",
        }))}
      />
    </div>
  );
}

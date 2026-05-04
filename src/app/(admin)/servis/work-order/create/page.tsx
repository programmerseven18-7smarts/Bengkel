import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderCreateForm from "@/components/bengkel/servis/WorkOrderCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Buat Work Order | Auto7",
  description: "Buat work order servis bengkel",
};

export const dynamic = "force-dynamic";

const toDateInputValue = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

export default async function CreateWorkOrderPage() {
  await requirePageAccess("work_order", "create");

  const today = new Date();
  const [workOrders, pelanggan, kendaraan, mekanik, jasaServis, spareparts] =
    await Promise.all([
      prisma.workOrder.findMany({
        select: {
          noWorkOrder: true,
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
          pelangganId: true,
          platNomor: true,
          tipe: true,
          merk: {
            select: {
              nama: true,
            },
          },
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
      prisma.jasaServis.findMany({
        where: {
          status: "AKTIF",
        },
        orderBy: {
          kode: "asc",
        },
        select: {
          id: true,
          kode: true,
          nama: true,
          harga: true,
          estimasiMenit: true,
          kategori: {
            select: {
              nama: true,
            },
          },
        },
      }),
      prisma.sparepart.findMany({
        where: {
          status: "AKTIF",
        },
        orderBy: {
          kode: "asc",
        },
        select: {
          id: true,
          kode: true,
          nama: true,
          stok: true,
          hargaJual: true,
          satuan: {
            select: {
              nama: true,
            },
          },
        },
      }),
    ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Buat Work Order" />
      <WorkOrderCreateForm
        nextNumber={getNextTransactionNumber(
          workOrders.map((item) => item.noWorkOrder),
          "WO",
          today
        )}
        tanggalMasuk={toDateInputValue(today)}
        pelangganOptions={pelanggan.map((item) => ({
          value: item.id,
          label: `${item.nama}${item.noHp ? ` - ${item.noHp}` : ""}`,
        }))}
        kendaraanOptions={kendaraan.map((item) => ({
          value: item.id,
          label: `${item.merk?.nama ?? ""} ${item.tipe} - ${item.platNomor}`.trim(),
          pelangganId: item.pelangganId,
        }))}
        mekanikOptions={mekanik.map((item) => ({
          value: item.id,
          label: item.nama,
        }))}
        serviceOptions={jasaServis.map((item) => ({
          value: item.id,
          label: `${item.kode} - ${item.nama}`,
          kode: item.kode,
          nama: item.nama,
          kategori: item.kategori?.nama ?? "",
          estimasiMenit: item.estimasiMenit ?? 0,
          harga: Number(item.harga),
        }))}
        sparepartOptions={spareparts.map((item) => ({
          value: item.id,
          label: `${item.kode} - ${item.nama}`,
          kode: item.kode,
          nama: item.nama,
          stokTersedia: item.stok,
          satuan: item.satuan?.nama ?? "",
          hargaJual: Number(item.hargaJual),
        }))}
      />
    </div>
  );
}

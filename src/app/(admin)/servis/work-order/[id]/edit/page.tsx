import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderCreateForm from "@/components/bengkel/servis/WorkOrderCreateForm";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit Work Order | Auto7",
  description: "Edit draft work order servis bengkel",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const toDateInputValue = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const toTimeInputValue = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date)
    : "";

export default async function EditWorkOrderPage({ params }: PageProps) {
  await requirePageAccess("work_order", "edit");

  const { id } = await params;
  const [
    workOrder,
    pelanggan,
    kendaraan,
    mekanik,
    jasaServis,
    spareparts,
  ] = await Promise.all([
    prisma.workOrder.findUnique({
      where: {
        id,
      },
      include: {
        jasaItems: {
          include: {
            jasaServis: {
              select: {
                kode: true,
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        },
        sparepartItems: {
          include: {
            sparepart: {
              select: {
                kode: true,
                stok: true,
              },
            },
          },
          orderBy: {
            id: "asc",
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

  if (!workOrder || workOrder.status !== "DRAFT") notFound();

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Work Order" />
      <WorkOrderCreateForm
        mode="edit"
        initialData={{
          id: workOrder.id,
          pelangganId: workOrder.pelangganId,
          kendaraanId: workOrder.kendaraanId,
          mekanikId: workOrder.mekanikId ?? "",
          estimasiSelesaiTime: toTimeInputValue(workOrder.estimasiSelesai),
          keluhan: workOrder.keluhan ?? "",
          catatan: workOrder.catatan ?? "",
          services: workOrder.jasaItems.map((item, index) => ({
            id: index + 1,
            jasaServisId: item.jasaServisId ?? "",
            kodeJasa: item.jasaServis?.kode ?? "",
            namaJasa: item.namaJasa,
            kategori: item.kategori ?? "",
            estimasiMenit: item.estimasiMenit ?? 0,
            harga: Number(item.harga),
            catatan: item.catatanMekanik ?? "",
          })),
          spareparts: workOrder.sparepartItems.map((item, index) => ({
            id: index + 1,
            sparepartId: item.sparepartId ?? "",
            kode: item.sparepart?.kode ?? "",
            nama: item.namaSparepart,
            stokTersedia: item.sparepart?.stok ?? item.stokSaatItu ?? 0,
            satuan: item.satuan ?? "",
            qty: Number(item.qty),
            hargaJual: Number(item.hargaJual),
            catatan: item.catatan ?? "",
          })),
        }}
        nextNumber={workOrder.noWorkOrder}
        tanggalMasuk={toDateInputValue(workOrder.tanggalMasuk)}
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

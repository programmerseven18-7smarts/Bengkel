import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderDetail from "@/components/bengkel/servis/WorkOrderDetail";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Detail Work Order | Auto7",
  description: "Detail work order servis bengkel",
};

export const dynamic = "force-dynamic";

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePageAccess("work_order");

  const { id } = await params;
  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id,
    },
    include: {
      pelanggan: true,
      kendaraan: {
        include: {
          merk: true,
        },
      },
      mekanik: true,
      jasaItems: {
        orderBy: {
          id: "asc",
        },
      },
      sparepartItems: {
        orderBy: {
          id: "asc",
        },
      },
      stokKeluar: {
        select: {
          id: true,
          noTransaksi: true,
        },
        orderBy: {
          tanggal: "desc",
        },
      },
      invoice: {
        select: {
          id: true,
          noInvoice: true,
        },
      },
    },
  });

  if (!workOrder) {
    notFound();
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Detail Work Order" />
      <WorkOrderDetail
        workOrder={{
          id: workOrder.id,
          noWorkOrder: workOrder.noWorkOrder,
          tanggalMasuk: workOrder.tanggalMasuk.toISOString(),
          estimasiSelesai: workOrder.estimasiSelesai?.toISOString() ?? null,
          status: workOrder.status,
          pelanggan: {
            nama: workOrder.pelanggan.nama,
            noHp: workOrder.pelanggan.noHp ?? "",
            alamat: workOrder.pelanggan.alamat ?? "",
          },
          kendaraan: {
            merk: workOrder.kendaraan.merk?.nama ?? "",
            tipe: workOrder.kendaraan.tipe,
            tahun: workOrder.kendaraan.tahun?.toString() ?? "",
            platNomor: workOrder.kendaraan.platNomor,
            warna: workOrder.kendaraan.warna ?? "",
          },
          mekanik: workOrder.mekanik?.nama ?? "",
          keluhan: workOrder.keluhan ?? "",
          catatan: workOrder.catatan ?? "",
          totalJasa: Number(workOrder.totalJasa),
          totalSparepart: Number(workOrder.totalSparepart),
          grandTotal: Number(workOrder.grandTotal),
          jasaItems: workOrder.jasaItems.map((item) => ({
            id: item.id,
            namaJasa: item.namaJasa,
            kategori: item.kategori ?? "",
            estimasiMenit: item.estimasiMenit ?? 0,
            harga: Number(item.harga),
            catatan: item.catatanMekanik ?? "",
          })),
          sparepartItems: workOrder.sparepartItems.map((item) => ({
            id: item.id,
            namaSparepart: item.namaSparepart,
            stokSaatItu: item.stokSaatItu ?? 0,
            qty: Number(item.qty),
            satuan: item.satuan ?? "",
            hargaJual: Number(item.hargaJual),
            subtotal: Number(item.subtotal),
            catatan: item.catatan ?? "",
          })),
          stokKeluar: workOrder.stokKeluar,
          invoice: workOrder.invoice,
        }}
      />
    </div>
  );
}

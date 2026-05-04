import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RiwayatServis, {
  type RiwayatItem,
} from "@/components/bengkel/servis/RiwayatServis";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Riwayat Servis | Auto7",
  description: "Riwayat servis bengkel",
};

export const dynamic = "force-dynamic";

const invoiceStatusLabel = (
  status?: string | null
): RiwayatItem["statusBayar"] => {
  switch (status) {
    case "LUNAS":
      return "Lunas";
    case "SEBAGIAN":
      return "Sebagian";
    default:
      return "Belum Lunas";
  }
};

export default async function RiwayatServisPage() {
  await requirePageAccess("riwayat_servis");

  const workOrders = await prisma.workOrder.findMany({
    where: {
      status: {
        in: ["SELESAI", "BATAL"],
      },
    },
    orderBy: {
      tanggalMasuk: "desc",
    },
    select: {
      id: true,
      noWorkOrder: true,
      tanggalMasuk: true,
      keluhan: true,
      catatan: true,
      status: true,
      totalJasa: true,
      totalSparepart: true,
      grandTotal: true,
      pelanggan: {
        select: {
          id: true,
          nama: true,
        },
      },
      kendaraan: {
        select: {
          id: true,
          platNomor: true,
          tipe: true,
          merk: {
            select: {
              nama: true,
            },
          },
        },
      },
      mekanik: {
        select: {
          nama: true,
        },
      },
      paketServis: {
        select: {
          nama: true,
        },
      },
      jasaItems: {
        select: {
          namaJasa: true,
          harga: true,
          catatanMekanik: true,
        },
      },
      sparepartItems: {
        select: {
          namaSparepart: true,
          qty: true,
          hargaJual: true,
        },
      },
      invoice: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  const items: RiwayatItem[] = workOrders.map((order) => {
    const jasaNames = order.jasaItems.map((item) => item.namaJasa);
    const sparepartNames = order.sparepartItems.map((item) => item.namaSparepart);
    const tindakan = [...jasaNames, ...sparepartNames].join(", ");

    return {
      id: order.id,
      noWorkOrder: order.noWorkOrder,
      tanggal: order.tanggalMasuk.toISOString(),
      pelanggan: order.pelanggan.nama,
      pelangganId: order.pelanggan.id,
      kendaraan: `${order.kendaraan.merk?.nama ?? ""} ${order.kendaraan.tipe}`.trim(),
      kendaraanId: order.kendaraan.id,
      platNomor: order.kendaraan.platNomor,
      jenisServis: order.paketServis?.nama ?? jasaNames[0] ?? "Servis umum",
      keluhan: order.keluhan ?? "-",
      diagnosa: order.catatan ?? "-",
      tindakan: tindakan || "-",
      mekanik: order.mekanik?.nama ?? "-",
      totalJasa: Number(order.totalJasa),
      totalSparepart: Number(order.totalSparepart),
      totalBiaya: Number(order.grandTotal),
      status: order.status === "SELESAI" ? "Selesai" : "Batal",
      statusBayar: invoiceStatusLabel(order.invoice?.status),
      invoiceId: order.invoice?.id ?? null,
      jasaList: order.jasaItems.map((item) => ({
        nama: item.namaJasa,
        harga: Number(item.harga),
      })),
      sparepartList: order.sparepartItems.map((item) => ({
        nama: item.namaSparepart,
        qty: Number(item.qty),
        harga: Number(item.hargaJual),
      })),
    };
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Riwayat Servis" />
      <RiwayatServis items={items} />
    </div>
  );
}

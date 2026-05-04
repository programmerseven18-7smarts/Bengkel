import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderList from "@/components/bengkel/servis/WorkOrderList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Work Order | Auto7",
  description: "Daftar work order servis bengkel",
};

export const dynamic = "force-dynamic";

export default async function WorkOrderPage() {
  await requirePageAccess("work_order");

  const [workOrders, mekanik] = await Promise.all([
    prisma.workOrder.findMany({
      orderBy: {
        tanggalMasuk: "desc",
      },
      select: {
        id: true,
        noWorkOrder: true,
        tanggalMasuk: true,
        keluhan: true,
        status: true,
        grandTotal: true,
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
        mekanikId: true,
        mekanik: {
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
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Work Order" />
      <WorkOrderList
        mekanikOptions={mekanik.map((item) => ({
          value: item.id,
          label: item.nama,
        }))}
        workOrders={workOrders.map((order) => ({
          id: order.id,
          noWorkOrder: order.noWorkOrder,
          pelanggan: order.pelanggan.nama,
          noHp: order.pelanggan.noHp ?? "",
          kendaraan: `${order.kendaraan.merk?.nama ?? ""} ${order.kendaraan.tipe}`.trim(),
          platNomor: order.kendaraan.platNomor,
          keluhan: order.keluhan ?? "",
          mekanikId: order.mekanikId ?? "",
          mekanik: order.mekanik?.nama ?? "",
          status: order.status,
          tanggal: order.tanggalMasuk.toISOString(),
          estimasi: Number(order.grandTotal),
        }))}
      />
    </div>
  );
}

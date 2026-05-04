import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { BengkelMetrics } from "@/components/bengkel/BengkelMetrics";
import RingkasanServis from "@/components/bengkel/RingkasanServis";
import PendapatanChart from "@/components/bengkel/PendapatanChart";
import WorkOrderTable from "@/components/bengkel/WorkOrderTable";
import StokKritisTable from "@/components/bengkel/StokKritisTable";
import Badge from "@/components/ui/badge/Badge";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard | Auto7 - Sistem Manajemen Bengkel",
  description: "Dashboard utama Auto7 untuk monitoring operasional bengkel",
};

// Quick action data
const quickActions = [
  {
    title: "Work Order Baru",
    description: "Buat work order servis",
    href: "/servis/work-order/create",
    color: "bg-brand-500",
  },
  {
    title: "Lihat Antrian",
    description: "Pantau antrian servis",
    href: "/servis/antrian-jadwal",
    color: "bg-success-500",
  },
  {
    title: "Tambah Stok",
    description: "Input stok masuk",
    href: "/inventory/stok-masuk/create",
    color: "bg-warning-500",
  },
  {
    title: "Terima Pembayaran",
    description: "Proses pembayaran",
    href: "/keuangan/invoice",
    color: "bg-error-500",
  },
];

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const statusPiutangLabel = (status: string, jatuhTempo: Date | null) => {
  if (jatuhTempo && jatuhTempo < new Date() && status !== "LUNAS") {
    return "Jatuh Tempo";
  }
  switch (status) {
    case "SEBAGIAN":
      return "Sebagian";
    case "LUNAS":
      return "Lunas";
    default:
      return "Belum Lunas";
  }
};

export default async function Dashboard() {
  await requirePageAccess("dashboard");

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const startOfNextYear = new Date(today.getFullYear() + 1, 0, 1);

  const [
    workOrdersToday,
    activeWorkOrderCount,
    invoicesMonth,
    invoicesYear,
    latestWorkOrders,
    spareparts,
    piutangRows,
  ] = await Promise.all([
    prisma.workOrder.findMany({
      where: {
        tanggalMasuk: {
          gte: startOfDay,
          lt: startOfTomorrow,
        },
      },
      select: {
        status: true,
      },
    }),
    prisma.workOrder.count({
      where: {
        status: {
          in: ["DRAFT", "ANTRI", "DIKERJAKAN", "MENUNGGU_PART"],
        },
      },
    }),
    prisma.invoice.findMany({
      where: {
        tanggalInvoice: {
          gte: startOfMonth,
        },
        status: {
          notIn: ["DRAFT", "BATAL"],
        },
      },
      select: {
        totalSparepart: true,
        grandTotal: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        tanggalInvoice: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
        status: {
          notIn: ["DRAFT", "BATAL"],
        },
      },
      select: {
        tanggalInvoice: true,
        totalJasa: true,
        totalSparepart: true,
      },
    }),
    prisma.workOrder.findMany({
      include: {
        pelanggan: {
          select: {
            nama: true,
          },
        },
        kendaraan: {
          include: {
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
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
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
        satuan: {
          select: {
            nama: true,
          },
        },
      },
    }),
    prisma.piutang.findMany({
      where: {
        status: {
          not: "LUNAS",
        },
      },
      include: {
        pelanggan: {
          select: {
            nama: true,
          },
        },
      },
      orderBy: [
        {
          jatuhTempo: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    }),
  ]);

  const pendapatanBulanIni = invoicesMonth.reduce(
    (total, item) => total + Number(item.grandTotal),
    0
  );
  const penjualanSparepart = invoicesMonth.reduce(
    (total, item) => total + Number(item.totalSparepart),
    0
  );

  const serviceStatus = {
    selesai: workOrdersToday.filter((item) => item.status === "SELESAI").length,
    dikerjakan: workOrdersToday.filter((item) => item.status === "DIKERJAKAN").length,
    antri: workOrdersToday.filter((item) => item.status === "ANTRI").length,
    menungguPart: workOrdersToday.filter((item) => item.status === "MENUNGGU_PART").length,
  };

  const monthlyJasa = Array.from({ length: 12 }, () => 0);
  const monthlySparepart = Array.from({ length: 12 }, () => 0);
  for (const item of invoicesYear) {
    const monthIndex = item.tanggalInvoice.getMonth();
    monthlyJasa[monthIndex] += Number(item.totalJasa);
    monthlySparepart[monthIndex] += Number(item.totalSparepart);
  }

  const piutangSummary = {
    total: piutangRows.reduce((total, item) => total + Number(item.sisaPiutang), 0),
    jatuhTempo: piutangRows
      .filter((item) => item.jatuhTempo && item.jatuhTempo < today)
      .reduce((total, item) => total + Number(item.sisaPiutang), 0),
    items: piutangRows.slice(0, 3).map((item) => ({
      pelanggan: item.pelanggan.nama,
      jumlah: Number(item.sisaPiutang),
      status: statusPiutangLabel(item.status, item.jatuhTempo),
    })),
  };

  const stokSummary = {
    aman: spareparts.filter((item) => item.stok > item.minStok).length,
    menipis: spareparts.filter((item) => item.stok > 0 && item.stok <= item.minStok).length,
    habis: spareparts.filter((item) => item.stok === 0).length,
    nilai: spareparts.reduce(
      (total, item) => total + item.stok * Number(item.hargaBeli),
      0
    ),
  };
  const criticalStock = spareparts
    .filter((item) => item.stok <= item.minStok)
    .sort((a, b) => a.stok - b.stok)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <BengkelMetrics
        metrics={[
          {
            title: "Total Servis Hari Ini",
            value: `${workOrdersToday.length}`,
            icon: "servis",
          },
          {
            title: "Work Order Aktif",
            value: `${activeWorkOrderCount}`,
            icon: "work-order",
          },
          {
            title: "Penjualan Sparepart",
            value: formatCurrency(penjualanSparepart),
            icon: "sparepart",
          },
          {
            title: "Pendapatan Bulan Ini",
            value: formatCurrency(pendapatanBulanIni),
            icon: "pendapatan",
          },
        ]}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
          >
            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-white/90 group-hover:text-brand-500">
              {action.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {action.description}
            </p>
          </Link>
        ))}
      </div>

      {/* 3 Pillars Section */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* PILLAR 1: SERVIS */}
        <div className="col-span-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-brand-500"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Servis & Work Order
            </h2>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-7">
          <WorkOrderTable
            workOrders={latestWorkOrders.map((order) => ({
              id: order.id,
              noWorkOrder: order.noWorkOrder,
              pelanggan: order.pelanggan.nama,
              kendaraan: `${order.kendaraan.merk?.nama ?? ""} ${order.kendaraan.tipe}`.trim(),
              platNomor: order.kendaraan.platNomor,
              mekanik: order.mekanik?.nama ?? "-",
              status: order.status,
              tanggal: order.tanggalMasuk.toISOString(),
            }))}
          />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <RingkasanServis {...serviceStatus} />
        </div>

        {/* PILLAR 2: INVENTORY */}
        <div className="col-span-12">
          <div className="flex items-center gap-2 mb-4 mt-2">
            <div className="w-1 h-6 rounded-full bg-warning-500"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Inventory & Stok
            </h2>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <StokKritisTable
            stokKritis={criticalStock.map((item) => ({
              id: item.id,
              kodeBarang: item.kode,
              namaBarang: item.nama,
              kategori: item.kategori?.nama ?? "-",
              stokSaatIni: item.stok,
              stokMinimum: item.minStok,
              satuan: item.satuan?.nama ?? "",
            }))}
          />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Ringkasan Stok
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-success-50 dark:bg-success-500/10">
                  <p className="text-2xl font-bold text-success-600 dark:text-success-400">{stokSummary.aman}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stok Aman</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-warning-50 dark:bg-warning-500/10">
                  <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">{stokSummary.menipis}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stok Menipis</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-error-50 dark:bg-error-500/10">
                  <p className="text-2xl font-bold text-error-600 dark:text-error-400">{stokSummary.habis}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stok Habis</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Nilai Stok</span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">{formatCurrency(stokSummary.nilai)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PILLAR 3: KEUANGAN */}
        <div className="col-span-12">
          <div className="flex items-center gap-2 mb-4 mt-2">
            <div className="w-1 h-6 rounded-full bg-success-500"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Keuangan
            </h2>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-7">
          <PendapatanChart
            categories={["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]}
            jasaData={monthlyJasa}
            sparepartData={monthlySparepart}
          />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Piutang Pelanggan
              </h3>
              <Link
                href="/keuangan/piutang"
                className="text-sm text-brand-500 hover:text-brand-600"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="p-6">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-error-50 dark:bg-error-500/10">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Piutang</p>
                  <p className="text-lg font-bold text-error-600 dark:text-error-400">
                    {formatCurrency(piutangSummary.total)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-500/10">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jatuh Tempo</p>
                  <p className="text-lg font-bold text-warning-600 dark:text-warning-400">
                    {formatCurrency(piutangSummary.jatuhTempo)}
                  </p>
                </div>
              </div>
              {/* List */}
              <div className="space-y-3">
                {piutangSummary.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90 text-sm">
                        {item.pelanggan}
                      </p>
                      <Badge
                        size="sm"
                        color={
                          item.status === "Jatuh Tempo"
                            ? "error"
                            : item.status === "Sebagian"
                            ? "warning"
                            : "light"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="font-semibold text-error-500 text-sm">
                      {formatCurrency(item.jumlah)}
                    </p>
                  </div>
                ))}
                {piutangSummary.items.length === 0 && (
                  <p className="py-4 text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada piutang aktif.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

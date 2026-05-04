"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  actionWarning,
  redirectWithNotice,
} from "@/lib/action-feedback";
import { writeAuditLog } from "@/lib/audit";
import { getAuthorizedUser } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

type WorkOrderJasaPayload = {
  jasaServisId?: string;
  namaJasa?: string;
  kategori?: string;
  estimasiMenit?: number;
  harga?: number;
  catatan?: string;
};

type WorkOrderSparepartPayload = {
  sparepartId?: string;
  nama?: string;
  stokTersedia?: number;
  satuan?: string;
  qty?: number;
  hargaJual?: number;
  catatan?: string;
};

const getValue = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const parseJsonArray = <T>(value: string): T[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const parseDateInput = (value: string) => {
  if (!value) return new Date();
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const combineDateAndTime = (dateInput: string, timeInput: string) => {
  if (!dateInput || !timeInput) return null;
  const parsed = new Date(`${dateInput}T${timeInput}:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const validWorkOrderStatuses = new Set([
  "DRAFT",
  "ANTRI",
  "DIKERJAKAN",
  "MENUNGGU_PART",
  "SELESAI",
  "BATAL",
]);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const createWorkOrderAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("work_order", "create");

  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat work order.", "/servis/work-order/create");

  const pelangganId = getValue(formData, "pelangganId");
  const kendaraanId = getValue(formData, "kendaraanId");
  const mekanikId = getValue(formData, "mekanikId") || null;
  const tanggalMasukInput = getValue(formData, "tanggalMasuk");
  const tanggalMasuk = parseDateInput(tanggalMasukInput);
  const estimasiSelesai = combineDateAndTime(
    tanggalMasukInput,
    getValue(formData, "estimasiSelesaiTime")
  );
  const intent = getValue(formData, "intent");

  if (!pelangganId || !kendaraanId) {
    return actionError(formData, "Pelanggan dan kendaraan wajib dipilih.", "/servis/work-order/create");
  }

  const jasaItems = parseJsonArray<WorkOrderJasaPayload>(
    getValue(formData, "jasaItems")
  ).filter((item) => item.namaJasa || item.jasaServisId);
  const sparepartItems = parseJsonArray<WorkOrderSparepartPayload>(
    getValue(formData, "sparepartItems")
  ).filter((item) => item.nama || item.sparepartId);

  const totalJasa = jasaItems.reduce(
    (total, item) => total + Number(item.harga || 0),
    0
  );
  const totalSparepart = sparepartItems.reduce(
    (total, item) =>
      total + Number(item.qty || 0) * Number(item.hargaJual || 0),
    0
  );
  const existingNumbers = await prisma.workOrder.findMany({
    select: {
      noWorkOrder: true,
    },
  });
  const workOrder = await prisma.workOrder.create({
    data: {
      noWorkOrder: getNextTransactionNumber(
        existingNumbers.map((item) => item.noWorkOrder),
        "WO",
        tanggalMasuk
      ),
      tanggalMasuk,
      estimasiSelesai,
      pelangganId,
      kendaraanId,
      mekanikId,
      status: intent === "post" ? "ANTRI" : "DRAFT",
      keluhan: getValue(formData, "keluhan") || null,
      catatan: getValue(formData, "catatan") || null,
      totalJasa: String(totalJasa),
      totalSparepart: String(totalSparepart),
      grandTotal: String(totalJasa + totalSparepart),
      createdById: currentUser?.id ?? null,
      jasaItems: {
        create: jasaItems.map((item) => ({
          jasaServisId: item.jasaServisId || null,
          namaJasa: item.namaJasa || "Jasa servis",
          kategori: item.kategori || null,
          estimasiMenit: Number(item.estimasiMenit || 0) || null,
          harga: String(Number(item.harga || 0)),
          catatanMekanik: item.catatan || null,
        })),
      },
      sparepartItems: {
        create: sparepartItems.map((item) => {
          const qty = Number(item.qty || 0);
          const hargaJual = Number(item.hargaJual || 0);

          return {
            sparepartId: item.sparepartId || null,
            namaSparepart: item.nama || "Sparepart",
            stokSaatItu: Number(item.stokTersedia || 0),
            qty: String(qty),
            satuan: item.satuan || null,
            hargaJual: String(hargaJual),
            subtotal: String(qty * hargaJual),
            catatan: item.catatan || null,
          };
        }),
      },
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: intent === "post" ? "POST" : "CREATE_DRAFT",
    entity: "WORK_ORDER",
    entityId: workOrder.id,
    entityNo: workOrder.noWorkOrder,
    status: workOrder.status,
    message: `${workOrder.noWorkOrder} dibuat`,
  });

  revalidatePath("/servis/work-order");
  redirectWithNotice("/servis/work-order", "success", "Work order berhasil dibuat.");
};

export const updateWorkOrderDraftAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("work_order", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses edit work order.", "/servis/work-order");

  const id = getValue(formData, "id");
  const pelangganId = getValue(formData, "pelangganId");
  const kendaraanId = getValue(formData, "kendaraanId");
  const mekanikId = getValue(formData, "mekanikId") || null;
  const tanggalMasukInput = getValue(formData, "tanggalMasuk");
  const tanggalMasuk = parseDateInput(tanggalMasukInput);
  const estimasiSelesai = combineDateAndTime(
    tanggalMasukInput,
    getValue(formData, "estimasiSelesaiTime")
  );
  const intent = getValue(formData, "intent");

  if (!id || !pelangganId || !kendaraanId) {
    return actionError(formData, "Pelanggan dan kendaraan wajib dipilih.", "/servis/work-order");
  }

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id,
    },
    select: {
      status: true,
    },
  });

  if (!workOrder || workOrder.status !== "DRAFT") {
    return actionWarning(formData, "Work order hanya bisa diedit saat masih draft.", "/servis/work-order");
  }

  const jasaItems = parseJsonArray<WorkOrderJasaPayload>(
    getValue(formData, "jasaItems")
  ).filter((item) => item.namaJasa || item.jasaServisId);
  const sparepartItems = parseJsonArray<WorkOrderSparepartPayload>(
    getValue(formData, "sparepartItems")
  ).filter((item) => item.nama || item.sparepartId);

  const totalJasa = jasaItems.reduce(
    (total, item) => total + Number(item.harga || 0),
    0
  );
  const totalSparepart = sparepartItems.reduce(
    (total, item) =>
      total + Number(item.qty || 0) * Number(item.hargaJual || 0),
    0
  );

  const updated = await prisma.$transaction(async (tx) => {
    await tx.workOrderJasa.deleteMany({
      where: {
        workOrderId: id,
      },
    });
    await tx.workOrderSparepart.deleteMany({
      where: {
        workOrderId: id,
      },
    });

    const result = await tx.workOrder.update({
      where: {
        id,
      },
      data: {
        tanggalMasuk,
        estimasiSelesai,
        pelangganId,
        kendaraanId,
        mekanikId,
        status: intent === "post" ? "ANTRI" : "DRAFT",
        keluhan: getValue(formData, "keluhan") || null,
        catatan: getValue(formData, "catatan") || null,
        totalJasa: String(totalJasa),
        totalSparepart: String(totalSparepart),
        grandTotal: String(totalJasa + totalSparepart),
        jasaItems: {
          create: jasaItems.map((item) => ({
            jasaServisId: item.jasaServisId || null,
            namaJasa: item.namaJasa || "Jasa servis",
            kategori: item.kategori || null,
            estimasiMenit: Number(item.estimasiMenit || 0) || null,
            harga: String(Number(item.harga || 0)),
            catatanMekanik: item.catatan || null,
          })),
        },
        sparepartItems: {
          create: sparepartItems.map((item) => {
            const qty = Number(item.qty || 0);
            const hargaJual = Number(item.hargaJual || 0);

            return {
              sparepartId: item.sparepartId || null,
              namaSparepart: item.nama || "Sparepart",
              stokSaatItu: Number(item.stokTersedia || 0),
              qty: String(qty),
              satuan: item.satuan || null,
              hargaJual: String(hargaJual),
              subtotal: String(qty * hargaJual),
              catatan: item.catatan || null,
            };
          }),
        },
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: intent === "post" ? "POST_FROM_DRAFT" : "UPDATE_DRAFT",
        entity: "WORK_ORDER",
        entityId: result.id,
        entityNo: result.noWorkOrder,
        status: result.status,
        message: `${result.noWorkOrder} diperbarui`,
      },
      tx
    );

    return result;
  });

  revalidatePath("/servis/work-order");
  revalidatePath(`/servis/work-order/${id}`);
  redirectWithNotice(
    `/servis/work-order/${id}`,
    "success",
    updated.status === "DRAFT"
      ? "Draft work order berhasil diperbarui."
      : "Work order berhasil diposting."
  );
};

export const deleteWorkOrderAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("work_order", "delete");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses hapus work order.", "/servis/work-order");

  const id = getValue(formData, "id");

  if (!id) return actionError(formData, "Work order tidak valid.", "/servis/work-order");

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id,
    },
    select: {
      status: true,
    },
  });

  if (!workOrder || workOrder.status !== "DRAFT") {
    return actionWarning(formData, "Hanya work order draft yang bisa dihapus.", "/servis/work-order");
  }

  await prisma.workOrder.delete({
    where: {
      id,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "DELETE_DRAFT",
    entity: "WORK_ORDER",
    entityId: id,
    status: "DRAFT",
    message: "Draft work order dihapus",
  });

  revalidatePath("/servis/work-order");
  actionSuccess(formData, "Draft work order berhasil dihapus.", "/servis/work-order");
};

export const updateWorkOrderStatusAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("work_order", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses update status work order.", "/servis/work-order");

  const id = getValue(formData, "id");
  const status = getValue(formData, "status");

  if (!id || !validWorkOrderStatuses.has(status)) {
    return actionError(formData, "Status work order tidak valid.", "/servis/work-order");
  }

  const updated = await prisma.workOrder.update({
    where: {
      id,
    },
    data: {
      status: status as
        | "DRAFT"
        | "ANTRI"
        | "DIKERJAKAN"
        | "MENUNGGU_PART"
        | "SELESAI"
        | "BATAL",
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "UPDATE_STATUS",
    entity: "WORK_ORDER",
    entityId: updated.id,
    entityNo: updated.noWorkOrder,
    status: updated.status,
    message: `Status work order diubah ke ${updated.status}`,
  });

  revalidatePath("/servis/work-order");
  revalidatePath(`/servis/work-order/${id}`);
  actionSuccess(formData, "Status work order berhasil diperbarui.", `/servis/work-order/${id}`);
};

export const createStokKeluarFromWorkOrderAction = async (
  formData: FormData
) => {
  const currentUser = await getAuthorizedUser("stok_keluar", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat stok keluar.", "/servis/work-order");

  const id = getValue(formData, "id");

  if (!id) return actionError(formData, "Work order tidak valid.", "/servis/work-order");

  const existing = await prisma.stokKeluar.findFirst({
    where: {
      workOrderId: id,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    redirectWithNotice("/inventory/stok-keluar", "info", "Stok keluar untuk work order ini sudah pernah dibuat.");
  }

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id,
    },
    include: {
      pelanggan: {
        select: {
          nama: true,
        },
      },
      mekanik: {
        select: {
          nama: true,
        },
      },
      sparepartItems: {
        include: {
          sparepart: {
            select: {
              id: true,
              stok: true,
              hargaBeli: true,
              lokasiId: true,
              satuan: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!workOrder || workOrder.sparepartItems.length === 0) {
    return actionWarning(formData, "Work order belum memiliki detail sparepart.", "/servis/work-order");
  }

  const hasInsufficientStock = workOrder.sparepartItems.some(
    (item) =>
      item.sparepartId &&
      item.sparepart &&
      item.sparepart.stok < Number(item.qty || 0)
  );

  if (hasInsufficientStock) {
    return actionError(formData, "Stok sparepart tidak cukup untuk membuat stok keluar.", `/servis/work-order/${id}`);
  }

  const existingNumbers = await prisma.stokKeluar.findMany({
    select: {
      noTransaksi: true,
    },
  });
  const now = new Date();
  const noTransaksi = getNextTransactionNumber(
    existingNumbers.map((item) => item.noTransaksi),
    "SK",
    now
  );

  await prisma.$transaction(async (tx) => {
    const totalNilai = workOrder.sparepartItems.reduce((total, item) => {
      const qty = Number(item.qty || 0);
      const hargaModal = Number(item.sparepart?.hargaBeli ?? item.hargaJual);
      return total + qty * hargaModal;
    }, 0);

    const stokKeluar = await tx.stokKeluar.create({
      data: {
        noTransaksi,
        tanggal: now,
        tipe: "SERVIS",
        referensi: workOrder.noWorkOrder,
        dimintaOleh: workOrder.mekanik?.nama ?? workOrder.pelanggan.nama,
        workOrderId: workOrder.id,
        catatan: `Otomatis dari ${workOrder.noWorkOrder}`,
        totalItem: workOrder.sparepartItems.length,
        totalNilai: String(totalNilai),
        items: {
          create: workOrder.sparepartItems.map((item) => {
            const hargaModal = Number(
              item.sparepart?.hargaBeli ?? item.hargaJual
            );
            const qty = Number(item.qty || 0);

            return {
              sparepartId: item.sparepartId,
              namaSparepart: item.namaSparepart,
              stokSaatItu: item.sparepart?.stok ?? item.stokSaatItu,
              qtyKeluar: String(qty),
              satuan: item.satuan ?? item.sparepart?.satuan?.nama ?? null,
              hargaModal: String(hargaModal),
              subtotal: String(qty * hargaModal),
              catatan: item.catatan,
            };
          }),
        },
      },
    });

    for (const item of workOrder.sparepartItems) {
      if (!item.sparepartId || !item.sparepart) continue;

      const qty = Number(item.qty || 0);
      const stokSebelum = item.sparepart.stok;
      const stokSesudah = stokSebelum - qty;
      const hargaModal = Number(item.sparepart.hargaBeli ?? item.hargaJual);

      await tx.sparepart.update({
        where: {
          id: item.sparepartId,
        },
        data: {
          stok: {
            decrement: qty,
          },
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal: now,
          sparepartId: item.sparepartId,
          lokasiId: item.sparepart.lokasiId,
          tipe: "KELUAR",
          qtyMasuk: "0",
          qtyKeluar: String(qty),
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan ?? item.sparepart.satuan?.nama ?? null,
          hargaModal: String(hargaModal),
          refTipe: "WORK_ORDER",
          refId: stokKeluar.id,
          refNo: noTransaksi,
          catatan: `Stok keluar dari ${workOrder.noWorkOrder}`,
        },
      });
    }

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "POST",
        entity: "STOK_KELUAR",
        entityId: stokKeluar.id,
        entityNo: stokKeluar.noTransaksi,
        status: "POSTED",
        message: `Stok keluar dibuat dari ${workOrder.noWorkOrder}`,
      },
      tx
    );
  });

  revalidatePath("/servis/work-order");
  revalidatePath(`/servis/work-order/${id}`);
  revalidatePath("/inventory/stok-keluar");
  revalidatePath("/inventory/sparepart");
  redirectWithNotice("/inventory/stok-keluar", "success", "Stok keluar berhasil dibuat dari work order.");
};

export const createInvoiceFromWorkOrderAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("invoice", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat invoice.", "/servis/work-order");

  const id = getValue(formData, "id");

  if (!id) return actionError(formData, "Work order tidak valid.", "/servis/work-order");

  const existing = await prisma.invoice.findUnique({
    where: {
      workOrderId: id,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    redirectWithNotice("/keuangan/invoice", "info", "Invoice untuk work order ini sudah pernah dibuat.");
  }

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id,
    },
    include: {
      jasaItems: true,
      sparepartItems: true,
    },
  });

  if (!workOrder) return actionError(formData, "Work order tidak ditemukan.", "/servis/work-order");

  const now = new Date();
  const existingNumbers = await prisma.invoice.findMany({
    select: {
      noInvoice: true,
    },
  });
  const noInvoice = getNextTransactionNumber(
    existingNumbers.map((item) => item.noInvoice),
    "INV",
    now
  );
  const grandTotal = Number(workOrder.grandTotal || 0);
  const jatuhTempo = addDays(now, 7);

  const invoice = await prisma.invoice.create({
    data: {
      noInvoice,
      workOrderId: workOrder.id,
      pelangganId: workOrder.pelangganId,
      kendaraanId: workOrder.kendaraanId,
      tanggalInvoice: now,
      jatuhTempo,
      status: "BELUM_LUNAS",
      totalJasa: String(Number(workOrder.totalJasa || 0)),
      totalSparepart: String(Number(workOrder.totalSparepart || 0)),
      totalLainnya: "0",
      grandTotal: String(grandTotal),
      terbayar: "0",
      sisaTagihan: String(grandTotal),
      catatan: `Otomatis dari ${workOrder.noWorkOrder}`,
      items: {
        create: [
          ...workOrder.jasaItems.map((item) => ({
            tipe: "JASA" as const,
            deskripsi: item.namaJasa,
            jasaServisId: item.jasaServisId,
            qty: "1",
            harga: String(Number(item.harga || 0)),
            subtotal: String(Number(item.harga || 0)),
          })),
          ...workOrder.sparepartItems.map((item) => {
            const qty = Number(item.qty || 0);
            const harga = Number(item.hargaJual || 0);

            return {
              tipe: "SPAREPART" as const,
              deskripsi: item.namaSparepart,
              sparepartId: item.sparepartId,
              qty: String(qty),
              harga: String(harga),
              subtotal: String(qty * harga),
            };
          }),
        ],
      },
      piutang: {
        create: {
          pelangganId: workOrder.pelangganId,
          tanggal: now,
          jatuhTempo,
          totalTagihan: String(grandTotal),
          terbayar: "0",
          sisaPiutang: String(grandTotal),
          status: "BELUM_LUNAS",
        },
      },
    },
  });

  await prisma.workOrder.update({
    where: {
      id,
    },
    data: {
      status: "SELESAI",
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "POST",
    entity: "INVOICE",
    entityId: invoice.id,
    entityNo: invoice.noInvoice,
    status: invoice.status,
    message: `Invoice dibuat dari ${workOrder.noWorkOrder}`,
  });

  revalidatePath("/servis/work-order");
  revalidatePath(`/servis/work-order/${id}`);
  revalidatePath("/keuangan/invoice");
  redirectWithNotice("/keuangan/invoice", "success", "Invoice berhasil dibuat dari work order.");
};

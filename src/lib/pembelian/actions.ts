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
import { getCurrentUser } from "@/lib/auth/session";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

type PurchaseOrderItemPayload = {
  sparepartId?: string;
  namaSparepart?: string;
  stokSaatIni?: number;
  qtyPesan?: number;
  satuan?: string;
  hargaBeli?: number;
  catatan?: string;
};

type PenerimaanBarangItemPayload = {
  purchaseOrderItemId?: string;
  sparepartId?: string;
  kondisiBarangId?: string;
  namaSparepart?: string;
  qtyPo?: number;
  qtyTerima?: number;
  satuan?: string;
  hargaBeli?: number;
  catatan?: string;
};

type ReturPembelianItemPayload = {
  penerimaanBarangItemId?: string;
  sparepartId?: string;
  alasanReturId?: string;
  namaSparepart?: string;
  qtyDiterima?: number;
  qtyRetur?: number;
  satuan?: string;
  hargaBeli?: number;
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

export const createPurchaseOrderAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("purchase_order", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat purchase order.", "/pembelian/purchase-order/create");

  const supplierId = getValue(formData, "supplierId");
  const tanggal = parseDateInput(getValue(formData, "tanggal"));
  const intent = getValue(formData, "intent");

  if (!supplierId) return actionError(formData, "Supplier wajib dipilih.", "/pembelian/purchase-order/create");

  const items = parseJsonArray<PurchaseOrderItemPayload>(
    getValue(formData, "items")
  )
    .filter((item) => item.sparepartId || item.namaSparepart)
    .map((item) => {
      const qtyPesan = Number(item.qtyPesan || 0);
      const hargaBeli = Number(item.hargaBeli || 0);

      return {
        ...item,
        qtyPesan,
        hargaBeli,
        subtotal: qtyPesan * hargaBeli,
      };
    })
    .filter((item) => item.qtyPesan > 0);

  if (items.length === 0) return actionError(formData, "Minimal satu sparepart wajib diisi.", "/pembelian/purchase-order/create");

  const existingNumbers = await prisma.purchaseOrder.findMany({
    select: {
      noPurchaseOrder: true,
    },
  });

  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      noPurchaseOrder: getNextTransactionNumber(
        existingNumbers.map((item) => item.noPurchaseOrder),
        "PO",
        tanggal
      ),
      tanggal,
      supplierId,
      estimasiDatang: getValue(formData, "estimasiDatang")
        ? parseDateInput(getValue(formData, "estimasiDatang"))
        : null,
      status: intent === "post" ? "DIKIRIM" : "DRAFT",
      catatan: getValue(formData, "catatan") || null,
      totalItem: items.length,
      totalNilai: String(
        items.reduce((total, item) => total + item.subtotal, 0)
      ),
      items: {
        create: items.map((item) => ({
          sparepartId: item.sparepartId || null,
          namaSparepart: item.namaSparepart || "Sparepart",
          stokSaatIni: Number(item.stokSaatIni || 0),
          qtyPesan: String(item.qtyPesan),
          qtyDiterima: "0",
          satuan: item.satuan || null,
          hargaBeli: String(item.hargaBeli),
          subtotal: String(item.subtotal),
          catatan: item.catatan || null,
        })),
      },
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: intent === "post" ? "POST" : "CREATE_DRAFT",
    entity: "PURCHASE_ORDER",
    entityId: purchaseOrder.id,
    entityNo: purchaseOrder.noPurchaseOrder,
    status: purchaseOrder.status,
    message: `${purchaseOrder.noPurchaseOrder} dibuat`,
  });

  revalidatePath("/pembelian/purchase-order");
  redirectWithNotice("/pembelian/purchase-order", "success", "Purchase order berhasil dibuat.");
};

export const createPenerimaanBarangAction = async (formData: FormData) => {
  const authorizedUser = await getAuthorizedUser("penerimaan_barang", "create");
  if (!authorizedUser) return actionError(formData, "Anda tidak punya akses membuat penerimaan barang.", "/pembelian/penerimaan-barang/create");

  const purchaseOrderId = getValue(formData, "purchaseOrderId");
  const tanggalTerima = parseDateInput(getValue(formData, "tanggalTerima"));
  const intent = getValue(formData, "intent");

  if (!purchaseOrderId) return actionError(formData, "Purchase order wajib dipilih.", "/pembelian/penerimaan-barang/create");

  const purchaseOrder = await prisma.purchaseOrder.findUnique({
    where: {
      id: purchaseOrderId,
    },
    include: {
      items: true,
    },
  });

  if (!purchaseOrder) return actionError(formData, "Purchase order tidak ditemukan.", "/pembelian/penerimaan-barang/create");

  const rawItems = parseJsonArray<PenerimaanBarangItemPayload>(
    getValue(formData, "items")
  ).filter((item) => item.sparepartId || item.namaSparepart);

  const items = rawItems
    .map((item) => {
      const qtyPo = Number(item.qtyPo || 0);
      const inputQtyTerima = Number(item.qtyTerima || 0);
      const qtyTerima = qtyPo > 0 ? Math.min(inputQtyTerima, qtyPo) : inputQtyTerima;
      const hargaBeli = Number(item.hargaBeli || 0);

      return {
        ...item,
        qtyPo,
        qtyTerima,
        hargaBeli,
        subtotal: qtyTerima * hargaBeli,
      };
    })
    .filter((item) => item.qtyTerima > 0);

  if (items.length === 0) return actionError(formData, "Minimal satu barang diterima wajib diisi.", "/pembelian/penerimaan-barang/create");

  const existingNumbers = await prisma.penerimaanBarang.findMany({
    select: {
      noPenerimaan: true,
    },
  });
  const currentUser = await getCurrentUser();
  const noPenerimaan = getNextTransactionNumber(
    existingNumbers.map((item) => item.noPenerimaan),
    "PB",
    tanggalTerima
  );
  const totalNilai = items.reduce((total, item) => total + item.subtotal, 0);

  const incomingByPoItem = new Map<string, number>();
  for (const item of items) {
    if (!item.purchaseOrderItemId) continue;
    incomingByPoItem.set(
      item.purchaseOrderItemId,
      (incomingByPoItem.get(item.purchaseOrderItemId) ?? 0) + item.qtyTerima
    );
  }

  const isPoComplete = purchaseOrder.items.every((item) => {
    const incoming = incomingByPoItem.get(item.id) ?? 0;
    return Number(item.qtyDiterima) + incoming >= Number(item.qtyPesan);
  });
  const posted = intent === "post";

  await prisma.$transaction(async (tx) => {
    const penerimaan = await tx.penerimaanBarang.create({
      data: {
        noPenerimaan,
        purchaseOrderId: purchaseOrder.id,
        supplierId: purchaseOrder.supplierId,
        tanggalTerima,
        diterimaOlehId: currentUser?.id ?? null,
        status: posted ? (isPoComplete ? "SELESAI" : "PARSIAL") : "DRAFT",
        catatan: getValue(formData, "catatan") || null,
        totalItem: items.length,
        totalNilai: String(totalNilai),
        items: {
          create: items.map((item) => ({
            purchaseOrderItemId: item.purchaseOrderItemId || null,
            sparepartId: item.sparepartId || null,
            kondisiBarangId: item.kondisiBarangId || null,
            namaSparepart: item.namaSparepart || "Sparepart",
            qtyPo: String(item.qtyPo),
            qtyTerima: String(item.qtyTerima),
            satuan: item.satuan || null,
            hargaBeli: String(item.hargaBeli),
            subtotal: String(item.subtotal),
            catatan: item.catatan || null,
          })),
        },
      },
    });

    if (!posted) {
      await writeAuditLog(
        {
          userId: authorizedUser.id,
          action: "CREATE_DRAFT",
          entity: "PENERIMAAN_BARANG",
          entityId: penerimaan.id,
          entityNo: penerimaan.noPenerimaan,
          status: "DRAFT",
          message: `Draft penerimaan dibuat dari ${purchaseOrder.noPurchaseOrder}`,
        },
        tx
      );
      return;
    }

    for (const item of items) {
      if (item.purchaseOrderItemId) {
        await tx.purchaseOrderItem.update({
          where: {
            id: item.purchaseOrderItemId,
          },
          data: {
            qtyDiterima: {
              increment: String(item.qtyTerima),
            },
          },
        });
      }

      if (!item.sparepartId) continue;

      const sparepart = await tx.sparepart.findUnique({
        where: {
          id: item.sparepartId,
        },
        select: {
          id: true,
          stok: true,
          lokasiId: true,
          satuan: {
            select: {
              nama: true,
            },
          },
        },
      });

      if (!sparepart) continue;

      const stokSebelum = sparepart.stok;
      const stokSesudah = stokSebelum + item.qtyTerima;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          stok: {
            increment: item.qtyTerima,
          },
          hargaBeli: String(item.hargaBeli),
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal: tanggalTerima,
          sparepartId: sparepart.id,
          lokasiId: sparepart.lokasiId,
          tipe: "MASUK",
          qtyMasuk: String(item.qtyTerima),
          qtyKeluar: "0",
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(item.hargaBeli),
          refTipe: "PENERIMAAN_BARANG",
          refId: penerimaan.id,
          refNo: noPenerimaan,
          catatan: `Penerimaan dari ${purchaseOrder.noPurchaseOrder}`,
        },
      });
    }

    await tx.purchaseOrder.update({
      where: {
        id: purchaseOrder.id,
      },
      data: {
        status: isPoComplete ? "DITERIMA" : "DIKIRIM",
      },
    });

    await writeAuditLog(
      {
        userId: authorizedUser.id,
        action: "POST",
        entity: "PENERIMAAN_BARANG",
        entityId: penerimaan.id,
        entityNo: penerimaan.noPenerimaan,
        status: posted ? (isPoComplete ? "SELESAI" : "PARSIAL") : "DRAFT",
        message: `Penerimaan dibuat dari ${purchaseOrder.noPurchaseOrder}`,
      },
      tx
    );
  });

  revalidatePath("/pembelian/purchase-order");
  revalidatePath("/pembelian/penerimaan-barang");
  revalidatePath("/inventory/sparepart");
  redirectWithNotice("/pembelian/penerimaan-barang", "success", "Penerimaan barang berhasil dibuat.");
};

export const createReturPembelianAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("retur_pembelian", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat retur pembelian.", "/pembelian/retur-pembelian/create");

  const penerimaanBarangId = getValue(formData, "penerimaanBarangId");
  const alasanReturId = getValue(formData, "alasanReturId") || null;
  const tanggalRetur = parseDateInput(getValue(formData, "tanggalRetur"));
  const intent = getValue(formData, "intent");

  if (!penerimaanBarangId) return actionError(formData, "Referensi penerimaan wajib dipilih.", "/pembelian/retur-pembelian/create");

  const penerimaan = await prisma.penerimaanBarang.findUnique({
    where: {
      id: penerimaanBarangId,
    },
    include: {
      items: true,
      supplier: true,
    },
  });

  if (!penerimaan) return actionError(formData, "Penerimaan barang tidak ditemukan.", "/pembelian/retur-pembelian/create");

  const rawItems = parseJsonArray<ReturPembelianItemPayload>(
    getValue(formData, "items")
  ).filter((item) => item.sparepartId || item.namaSparepart);

  const items = rawItems
    .map((item) => {
      const qtyDiterima = Number(item.qtyDiterima || 0);
      const qtyRetur = Math.min(Number(item.qtyRetur || 0), qtyDiterima);
      const hargaBeli = Number(item.hargaBeli || 0);

      return {
        ...item,
        alasanReturId: item.alasanReturId || alasanReturId,
        qtyDiterima,
        qtyRetur,
        hargaBeli,
        subtotal: qtyRetur * hargaBeli,
      };
    })
    .filter((item) => item.qtyRetur > 0);

  if (items.length === 0) return actionError(formData, "Minimal satu barang retur wajib diisi.", "/pembelian/retur-pembelian/create");

  const posted = intent === "post";

  if (posted) {
    const stockChecks = await prisma.sparepart.findMany({
      where: {
        id: {
          in: items
            .map((item) => item.sparepartId)
            .filter((id): id is string => Boolean(id)),
        },
      },
      select: {
        id: true,
        stok: true,
      },
    });
    const stockById = new Map(stockChecks.map((item) => [item.id, item.stok]));
    const hasInsufficientStock = items.some(
      (item) =>
        item.sparepartId &&
        (stockById.get(item.sparepartId) ?? 0) < item.qtyRetur
    );

    if (hasInsufficientStock) return actionError(formData, "Stok tidak cukup untuk membuat retur pembelian.", "/pembelian/retur-pembelian/create");
  }

  const existingNumbers = await prisma.returPembelian.findMany({
    select: {
      noRetur: true,
    },
  });
  const noRetur = getNextTransactionNumber(
    existingNumbers.map((item) => item.noRetur),
    "RB",
    tanggalRetur
  );
  const totalNilai = items.reduce((total, item) => total + item.subtotal, 0);

  await prisma.$transaction(async (tx) => {
    const retur = await tx.returPembelian.create({
      data: {
        noRetur,
        penerimaanBarangId: penerimaan.id,
        supplierId: penerimaan.supplierId,
        alasanReturId,
        tanggalRetur,
        status: posted ? "DIKIRIM" : "DRAFT",
        catatan: getValue(formData, "catatan") || null,
        totalItem: items.length,
        totalNilai: String(totalNilai),
        items: {
          create: items.map((item) => ({
            penerimaanBarangItemId: item.penerimaanBarangItemId || null,
            sparepartId: item.sparepartId || null,
            alasanReturId: item.alasanReturId || null,
            namaSparepart: item.namaSparepart || "Sparepart",
            qtyDiterima: String(item.qtyDiterima),
            qtyRetur: String(item.qtyRetur),
            satuan: item.satuan || null,
            hargaBeli: String(item.hargaBeli),
            subtotal: String(item.subtotal),
          })),
        },
      },
    });

    if (!posted) {
      await writeAuditLog(
        {
          userId: currentUser.id,
          action: "CREATE_DRAFT",
          entity: "RETUR_PEMBELIAN",
          entityId: retur.id,
          entityNo: retur.noRetur,
          status: "DRAFT",
          message: `Draft retur pembelian dibuat dari ${penerimaan.noPenerimaan}`,
        },
        tx
      );
      return;
    }

    for (const item of items) {
      if (!item.sparepartId) continue;

      const sparepart = await tx.sparepart.findUnique({
        where: {
          id: item.sparepartId,
        },
        select: {
          id: true,
          stok: true,
          lokasiId: true,
          satuan: {
            select: {
              nama: true,
            },
          },
        },
      });

      if (!sparepart) continue;

      const stokSebelum = sparepart.stok;
      const stokSesudah = stokSebelum - item.qtyRetur;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          stok: {
            decrement: item.qtyRetur,
          },
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal: tanggalRetur,
          sparepartId: sparepart.id,
          lokasiId: sparepart.lokasiId,
          tipe: "KELUAR",
          qtyMasuk: "0",
          qtyKeluar: String(item.qtyRetur),
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(item.hargaBeli),
          refTipe: "RETUR_PEMBELIAN",
          refId: retur.id,
          refNo: noRetur,
          catatan: `Retur pembelian dari ${penerimaan.noPenerimaan}`,
        },
      });
    }

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: posted ? "POST" : "CREATE_DRAFT",
        entity: "RETUR_PEMBELIAN",
        entityId: retur.id,
        entityNo: retur.noRetur,
        status: posted ? "DIKIRIM" : "DRAFT",
        message: `Retur pembelian dibuat dari ${penerimaan.noPenerimaan}`,
      },
      tx
    );
  });

  revalidatePath("/pembelian/retur-pembelian");
  revalidatePath("/pembelian/penerimaan-barang");
  revalidatePath(`/pembelian/penerimaan-barang/${penerimaan.id}`);
  revalidatePath("/inventory/sparepart");
  redirectWithNotice("/pembelian/retur-pembelian", "success", "Retur pembelian berhasil dibuat.");
};

export const updatePurchaseOrderStatusAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("purchase_order", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses update purchase order.", "/pembelian/purchase-order");

  const id = getValue(formData, "id");
  const status = getValue(formData, "status");

  if (!id || !["DIKIRIM", "DIBATALKAN"].includes(status)) {
    return actionError(formData, "Status purchase order tidak valid.", "/pembelian/purchase-order");
  }

  const purchaseOrder = await prisma.purchaseOrder.findUnique({
    where: {
      id,
    },
    include: {
      penerimaanBarang: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!purchaseOrder) return actionError(formData, "Purchase order tidak ditemukan.", "/pembelian/purchase-order");
  if (status === "DIKIRIM" && purchaseOrder.status !== "DRAFT") {
    return actionWarning(formData, "Hanya purchase order draft yang bisa diposting.", `/pembelian/purchase-order/${id}`);
  }

  const hasPostedReceiving = purchaseOrder.penerimaanBarang.some(
    (item) => item.status !== "DIBATALKAN"
  );
  if (status === "DIBATALKAN" && hasPostedReceiving) {
    return actionWarning(formData, "Purchase order tidak bisa dibatalkan karena sudah memiliki penerimaan aktif.", `/pembelian/purchase-order/${id}`);
  }

  const updated = await prisma.purchaseOrder.update({
    where: {
      id,
    },
    data: {
      status: status as "DIKIRIM" | "DIBATALKAN",
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: status === "DIKIRIM" ? "POST" : "CANCEL_DRAFT",
    entity: "PURCHASE_ORDER",
    entityId: updated.id,
    entityNo: updated.noPurchaseOrder,
    status: updated.status,
    message: `Status purchase order diubah ke ${updated.status}`,
  });

  revalidatePath("/pembelian/purchase-order");
  revalidatePath(`/pembelian/purchase-order/${id}`);
  actionSuccess(formData, "Status purchase order berhasil diperbarui.", `/pembelian/purchase-order/${id}`);
};

export const postPenerimaanBarangAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("penerimaan_barang", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses posting penerimaan.", "/pembelian/penerimaan-barang");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Penerimaan tidak valid.", "/pembelian/penerimaan-barang");

  const penerimaan = await prisma.penerimaanBarang.findUnique({
    where: {
      id,
    },
    include: {
      purchaseOrder: {
        include: {
          items: true,
        },
      },
      items: true,
    },
  });

  if (!penerimaan || penerimaan.status !== "DRAFT") {
    return actionWarning(formData, "Hanya penerimaan draft yang bisa diposting.", "/pembelian/penerimaan-barang");
  }

  const incomingByPoItem = new Map<string, number>();
  for (const item of penerimaan.items) {
    if (!item.purchaseOrderItemId) continue;
    incomingByPoItem.set(
      item.purchaseOrderItemId,
      (incomingByPoItem.get(item.purchaseOrderItemId) ?? 0) +
        Number(item.qtyTerima)
    );
  }

  const isPoComplete =
    !penerimaan.purchaseOrder ||
    penerimaan.purchaseOrder.items.every((item) => {
      const incoming = incomingByPoItem.get(item.id) ?? 0;
      return Number(item.qtyDiterima) + incoming >= Number(item.qtyPesan);
    });

  await prisma.$transaction(async (tx) => {
    for (const item of penerimaan.items) {
      const qtyTerima = Number(item.qtyTerima);
      const hargaBeli = Number(item.hargaBeli);

      if (item.purchaseOrderItemId) {
        await tx.purchaseOrderItem.update({
          where: {
            id: item.purchaseOrderItemId,
          },
          data: {
            qtyDiterima: {
              increment: String(qtyTerima),
            },
          },
        });
      }

      if (!item.sparepartId) continue;

      const sparepart = await tx.sparepart.findUnique({
        where: {
          id: item.sparepartId,
        },
        select: {
          id: true,
          stok: true,
          lokasiId: true,
          satuan: {
            select: {
              nama: true,
            },
          },
        },
      });

      if (!sparepart) continue;

      const stokSebelum = sparepart.stok;
      const stokSesudah = stokSebelum + qtyTerima;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          stok: {
            increment: qtyTerima,
          },
          hargaBeli: String(hargaBeli),
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal: penerimaan.tanggalTerima,
          sparepartId: sparepart.id,
          lokasiId: sparepart.lokasiId,
          tipe: "MASUK",
          qtyMasuk: String(qtyTerima),
          qtyKeluar: "0",
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(hargaBeli),
          refTipe: "PENERIMAAN_BARANG",
          refId: penerimaan.id,
          refNo: penerimaan.noPenerimaan,
          catatan: `Penerimaan dari ${
            penerimaan.purchaseOrder?.noPurchaseOrder ?? penerimaan.noPenerimaan
          }`,
        },
      });
    }

    await tx.penerimaanBarang.update({
      where: {
        id: penerimaan.id,
      },
      data: {
        status: isPoComplete ? "SELESAI" : "PARSIAL",
      },
    });

    if (penerimaan.purchaseOrderId) {
      await tx.purchaseOrder.update({
        where: {
          id: penerimaan.purchaseOrderId,
        },
        data: {
          status: isPoComplete ? "DITERIMA" : "DIKIRIM",
        },
      });
    }

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "POST",
        entity: "PENERIMAAN_BARANG",
        entityId: penerimaan.id,
        entityNo: penerimaan.noPenerimaan,
        status: isPoComplete ? "SELESAI" : "PARSIAL",
        message: `${penerimaan.noPenerimaan} diposting`,
      },
      tx
    );
  });

  revalidatePath("/pembelian/penerimaan-barang");
  revalidatePath(`/pembelian/penerimaan-barang/${id}`);
  if (penerimaan.purchaseOrderId) {
    revalidatePath(`/pembelian/purchase-order/${penerimaan.purchaseOrderId}`);
  }
  revalidatePath("/inventory/sparepart");
  if (getValue(formData, "returnTo")) {
    actionSuccess(formData, "Penerimaan barang berhasil diposting.", `/pembelian/penerimaan-barang/${id}`);
  }
};

export const cancelPenerimaanBarangAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("penerimaan_barang", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membatalkan penerimaan.", "/pembelian/penerimaan-barang");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Penerimaan tidak valid.", "/pembelian/penerimaan-barang");

  const penerimaan = await prisma.penerimaanBarang.findUnique({
    where: {
      id,
    },
    select: {
      status: true,
      purchaseOrderId: true,
    },
  });

  if (!penerimaan || penerimaan.status !== "DRAFT") {
    return actionWarning(formData, "Hanya penerimaan draft yang bisa dibatalkan langsung.", "/pembelian/penerimaan-barang");
  }

  await prisma.penerimaanBarang.update({
    where: {
      id,
    },
    data: {
      status: "DIBATALKAN",
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "CANCEL_DRAFT",
    entity: "PENERIMAAN_BARANG",
    entityId: id,
    status: "DIBATALKAN",
    message: "Draft penerimaan barang dibatalkan",
  });

  revalidatePath("/pembelian/penerimaan-barang");
  revalidatePath(`/pembelian/penerimaan-barang/${id}`);
  if (penerimaan.purchaseOrderId) {
    revalidatePath(`/pembelian/purchase-order/${penerimaan.purchaseOrderId}`);
  }
  actionSuccess(formData, "Draft penerimaan barang berhasil dibatalkan.", `/pembelian/penerimaan-barang/${id}`);
};

export const postReturPembelianAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("retur_pembelian", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses posting retur pembelian.", "/pembelian/retur-pembelian");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Retur pembelian tidak valid.", "/pembelian/retur-pembelian");

  const retur = await prisma.returPembelian.findUnique({
    where: {
      id,
    },
    include: {
      penerimaanBarang: {
        select: {
          id: true,
          noPenerimaan: true,
        },
      },
      items: true,
    },
  });

  if (!retur || retur.status !== "DRAFT") {
    return actionWarning(formData, "Hanya retur draft yang bisa diposting.", "/pembelian/retur-pembelian");
  }

  const stockChecks = await prisma.sparepart.findMany({
    where: {
      id: {
        in: retur.items
          .map((item) => item.sparepartId)
          .filter((itemId): itemId is string => Boolean(itemId)),
      },
    },
    select: {
      id: true,
      stok: true,
    },
  });
  const stockById = new Map(stockChecks.map((item) => [item.id, item.stok]));
  const hasInsufficientStock = retur.items.some(
    (item) =>
      item.sparepartId &&
      (stockById.get(item.sparepartId) ?? 0) < Number(item.qtyRetur)
  );

  if (hasInsufficientStock) {
    return actionError(formData, "Stok tidak cukup untuk posting retur pembelian.", `/pembelian/retur-pembelian/${id}`);
  }

  await prisma.$transaction(async (tx) => {
    for (const item of retur.items) {
      if (!item.sparepartId) continue;

      const qtyRetur = Number(item.qtyRetur);
      const hargaBeli = Number(item.hargaBeli);
      const sparepart = await tx.sparepart.findUnique({
        where: {
          id: item.sparepartId,
        },
        select: {
          id: true,
          stok: true,
          lokasiId: true,
          satuan: {
            select: {
              nama: true,
            },
          },
        },
      });

      if (!sparepart) continue;

      const stokSebelum = sparepart.stok;
      const stokSesudah = stokSebelum - qtyRetur;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          stok: {
            decrement: qtyRetur,
          },
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal: retur.tanggalRetur,
          sparepartId: sparepart.id,
          lokasiId: sparepart.lokasiId,
          tipe: "KELUAR",
          qtyMasuk: "0",
          qtyKeluar: String(qtyRetur),
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(hargaBeli),
          refTipe: "RETUR_PEMBELIAN",
          refId: retur.id,
          refNo: retur.noRetur,
          catatan: `Retur pembelian dari ${
            retur.penerimaanBarang?.noPenerimaan ?? retur.noRetur
          }`,
        },
      });
    }

    await tx.returPembelian.update({
      where: {
        id: retur.id,
      },
      data: {
        status: "DIKIRIM",
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "POST",
        entity: "RETUR_PEMBELIAN",
        entityId: retur.id,
        entityNo: retur.noRetur,
        status: "DIKIRIM",
        message: `${retur.noRetur} diposting`,
      },
      tx
    );
  });

  revalidatePath("/pembelian/retur-pembelian");
  revalidatePath(`/pembelian/retur-pembelian/${id}`);
  if (retur.penerimaanBarang?.id) {
    revalidatePath(`/pembelian/penerimaan-barang/${retur.penerimaanBarang.id}`);
  }
  revalidatePath("/inventory/sparepart");
  if (getValue(formData, "returnTo")) {
    actionSuccess(formData, "Retur pembelian berhasil diposting.", `/pembelian/retur-pembelian/${id}`);
  }
};

export const completeReturPembelianAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("retur_pembelian", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses menyelesaikan retur.", "/pembelian/retur-pembelian");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Retur pembelian tidak valid.", "/pembelian/retur-pembelian");

  const result = await prisma.returPembelian.updateMany({
    where: {
      id,
      status: "DIKIRIM",
    },
    data: {
      status: "SELESAI",
    },
  });

  if (result.count === 0) {
    return actionWarning(formData, "Hanya retur berstatus dikirim yang bisa diselesaikan.", `/pembelian/retur-pembelian/${id}`);
  }

  await writeAuditLog({
    userId: currentUser.id,
    action: "COMPLETE",
    entity: "RETUR_PEMBELIAN",
    entityId: id,
    status: "SELESAI",
    message: "Retur pembelian diselesaikan",
  });

  revalidatePath("/pembelian/retur-pembelian");
  revalidatePath(`/pembelian/retur-pembelian/${id}`);
  actionSuccess(formData, "Retur pembelian berhasil diselesaikan.", `/pembelian/retur-pembelian/${id}`);
};

export const cancelReturPembelianAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("retur_pembelian", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membatalkan retur.", "/pembelian/retur-pembelian");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Retur pembelian tidak valid.", "/pembelian/retur-pembelian");

  const result = await prisma.returPembelian.updateMany({
    where: {
      id,
      status: "DRAFT",
    },
    data: {
      status: "DIBATALKAN",
    },
  });

  if (result.count === 0) {
    return actionWarning(formData, "Hanya retur draft yang bisa dibatalkan langsung.", `/pembelian/retur-pembelian/${id}`);
  }

  await writeAuditLog({
    userId: currentUser.id,
    action: "CANCEL_DRAFT",
    entity: "RETUR_PEMBELIAN",
    entityId: id,
    status: "DIBATALKAN",
    message: "Draft retur pembelian dibatalkan",
  });

  revalidatePath("/pembelian/retur-pembelian");
  revalidatePath(`/pembelian/retur-pembelian/${id}`);
  actionSuccess(formData, "Draft retur pembelian berhasil dibatalkan.", `/pembelian/retur-pembelian/${id}`);
};

export const updatePurchaseOrderDraftAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("purchase_order", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses edit purchase order.", "/pembelian/purchase-order");

  const id = getValue(formData, "id");
  const supplierId = getValue(formData, "supplierId");
  const tanggal = parseDateInput(getValue(formData, "tanggal"));
  const intent = getValue(formData, "intent");

  if (!id || !supplierId) return actionError(formData, "Supplier wajib dipilih.", "/pembelian/purchase-order");

  const purchaseOrder = await prisma.purchaseOrder.findUnique({
    where: {
      id,
    },
    select: {
      status: true,
    },
  });

  if (!purchaseOrder || purchaseOrder.status !== "DRAFT") {
    return actionWarning(formData, "Purchase order hanya bisa diedit saat masih draft.", `/pembelian/purchase-order/${id}`);
  }

  const items = parseJsonArray<PurchaseOrderItemPayload>(
    getValue(formData, "items")
  )
    .filter((item) => item.sparepartId || item.namaSparepart)
    .map((item) => {
      const qtyPesan = Number(item.qtyPesan || 0);
      const hargaBeli = Number(item.hargaBeli || 0);

      return {
        ...item,
        qtyPesan,
        hargaBeli,
        subtotal: qtyPesan * hargaBeli,
      };
    })
    .filter((item) => item.qtyPesan > 0);

  if (items.length === 0) return actionError(formData, "Minimal satu sparepart wajib diisi.", `/pembelian/purchase-order/${id}/edit`);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.purchaseOrderItem.deleteMany({
      where: {
        purchaseOrderId: id,
      },
    });
    const result = await tx.purchaseOrder.update({
      where: {
        id,
      },
      data: {
        tanggal,
        supplierId,
        estimasiDatang: getValue(formData, "estimasiDatang")
          ? parseDateInput(getValue(formData, "estimasiDatang"))
          : null,
        status: intent === "post" ? "DIKIRIM" : "DRAFT",
        catatan: getValue(formData, "catatan") || null,
        totalItem: items.length,
        totalNilai: String(
          items.reduce((total, item) => total + item.subtotal, 0)
        ),
        items: {
          create: items.map((item) => ({
            sparepartId: item.sparepartId || null,
            namaSparepart: item.namaSparepart || "Sparepart",
            stokSaatIni: Number(item.stokSaatIni || 0),
            qtyPesan: String(item.qtyPesan),
            qtyDiterima: "0",
            satuan: item.satuan || null,
            hargaBeli: String(item.hargaBeli),
            subtotal: String(item.subtotal),
            catatan: item.catatan || null,
          })),
        },
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: intent === "post" ? "POST_FROM_DRAFT" : "UPDATE_DRAFT",
        entity: "PURCHASE_ORDER",
        entityId: result.id,
        entityNo: result.noPurchaseOrder,
        status: result.status,
        message: `${result.noPurchaseOrder} diperbarui`,
      },
      tx
    );

    return result;
  });

  revalidatePath("/pembelian/purchase-order");
  revalidatePath(`/pembelian/purchase-order/${id}`);
  redirectWithNotice(
    `/pembelian/purchase-order/${id}`,
    "success",
    updated.status === "DRAFT"
      ? "Draft purchase order berhasil diperbarui."
      : "Purchase order berhasil diposting."
  );
};

export const updatePenerimaanBarangDraftAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("penerimaan_barang", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses edit penerimaan barang.", "/pembelian/penerimaan-barang");

  const id = getValue(formData, "id");
  const purchaseOrderId = getValue(formData, "purchaseOrderId");
  const tanggalTerima = parseDateInput(getValue(formData, "tanggalTerima"));
  const intent = getValue(formData, "intent");

  if (!id || !purchaseOrderId) return actionError(formData, "Purchase order wajib dipilih.", "/pembelian/penerimaan-barang");

  const [penerimaan, purchaseOrder] = await Promise.all([
    prisma.penerimaanBarang.findUnique({
      where: {
        id,
      },
      select: {
        status: true,
      },
    }),
    prisma.purchaseOrder.findUnique({
      where: {
        id: purchaseOrderId,
      },
      select: {
        id: true,
        supplierId: true,
      },
    }),
  ]);

  if (!penerimaan || penerimaan.status !== "DRAFT" || !purchaseOrder) {
    return actionWarning(formData, "Penerimaan hanya bisa diedit saat masih draft.", `/pembelian/penerimaan-barang/${id}`);
  }

  const items = parseJsonArray<PenerimaanBarangItemPayload>(
    getValue(formData, "items")
  )
    .filter((item) => item.sparepartId || item.namaSparepart)
    .map((item) => {
      const qtyPo = Number(item.qtyPo || 0);
      const inputQtyTerima = Number(item.qtyTerima || 0);
      const qtyTerima =
        qtyPo > 0 ? Math.min(inputQtyTerima, qtyPo) : inputQtyTerima;
      const hargaBeli = Number(item.hargaBeli || 0);

      return {
        ...item,
        qtyPo,
        qtyTerima,
        hargaBeli,
        subtotal: qtyTerima * hargaBeli,
      };
    })
    .filter((item) => item.qtyTerima > 0);

  if (items.length === 0) return actionError(formData, "Minimal satu barang diterima wajib diisi.", `/pembelian/penerimaan-barang/${id}/edit`);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.penerimaanBarangItem.deleteMany({
      where: {
        penerimaanBarangId: id,
      },
    });
    const result = await tx.penerimaanBarang.update({
      where: {
        id,
      },
      data: {
        purchaseOrderId: purchaseOrder.id,
        supplierId: purchaseOrder.supplierId,
        tanggalTerima,
        catatan: getValue(formData, "catatan") || null,
        totalItem: items.length,
        totalNilai: String(
          items.reduce((total, item) => total + item.subtotal, 0)
        ),
        items: {
          create: items.map((item) => ({
            purchaseOrderItemId: item.purchaseOrderItemId || null,
            sparepartId: item.sparepartId || null,
            kondisiBarangId: item.kondisiBarangId || null,
            namaSparepart: item.namaSparepart || "Sparepart",
            qtyPo: String(item.qtyPo),
            qtyTerima: String(item.qtyTerima),
            satuan: item.satuan || null,
            hargaBeli: String(item.hargaBeli),
            subtotal: String(item.subtotal),
            catatan: item.catatan || null,
          })),
        },
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "UPDATE_DRAFT",
        entity: "PENERIMAAN_BARANG",
        entityId: result.id,
        entityNo: result.noPenerimaan,
        status: result.status,
        message: `${result.noPenerimaan} diperbarui`,
      },
      tx
    );

    return result;
  });

  if (intent === "post") {
    const postFormData = new FormData();
    postFormData.set("id", id);
    postFormData.set("returnTo", `/pembelian/penerimaan-barang/${id}`);
    await postPenerimaanBarangAction(postFormData);
  }

  revalidatePath("/pembelian/penerimaan-barang");
  revalidatePath(`/pembelian/penerimaan-barang/${id}`);
  redirectWithNotice(
    `/pembelian/penerimaan-barang/${id}`,
    "success",
    updated.status === "DRAFT"
      ? "Draft penerimaan berhasil diperbarui."
      : "Penerimaan barang berhasil diposting."
  );
};

export const updateReturPembelianDraftAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("retur_pembelian", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses edit retur pembelian.", "/pembelian/retur-pembelian");

  const id = getValue(formData, "id");
  const penerimaanBarangId = getValue(formData, "penerimaanBarangId");
  const alasanReturId = getValue(formData, "alasanReturId") || null;
  const tanggalRetur = parseDateInput(getValue(formData, "tanggalRetur"));
  const intent = getValue(formData, "intent");

  if (!id || !penerimaanBarangId) return actionError(formData, "Referensi penerimaan wajib dipilih.", "/pembelian/retur-pembelian");

  const [retur, penerimaan] = await Promise.all([
    prisma.returPembelian.findUnique({
      where: {
        id,
      },
      select: {
        status: true,
      },
    }),
    prisma.penerimaanBarang.findUnique({
      where: {
        id: penerimaanBarangId,
      },
      select: {
        id: true,
        supplierId: true,
      },
    }),
  ]);

  if (!retur || retur.status !== "DRAFT" || !penerimaan) {
    return actionWarning(formData, "Retur pembelian hanya bisa diedit saat masih draft.", `/pembelian/retur-pembelian/${id}`);
  }

  const items = parseJsonArray<ReturPembelianItemPayload>(
    getValue(formData, "items")
  )
    .filter((item) => item.sparepartId || item.namaSparepart)
    .map((item) => {
      const qtyDiterima = Number(item.qtyDiterima || 0);
      const qtyRetur = Math.min(Number(item.qtyRetur || 0), qtyDiterima);
      const hargaBeli = Number(item.hargaBeli || 0);

      return {
        ...item,
        alasanReturId: item.alasanReturId || alasanReturId,
        qtyDiterima,
        qtyRetur,
        hargaBeli,
        subtotal: qtyRetur * hargaBeli,
      };
    })
    .filter((item) => item.qtyRetur > 0);

  if (items.length === 0) return actionError(formData, "Minimal satu barang retur wajib diisi.", `/pembelian/retur-pembelian/${id}/edit`);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.returPembelianItem.deleteMany({
      where: {
        returPembelianId: id,
      },
    });
    const result = await tx.returPembelian.update({
      where: {
        id,
      },
      data: {
        penerimaanBarangId: penerimaan.id,
        supplierId: penerimaan.supplierId,
        alasanReturId,
        tanggalRetur,
        catatan: getValue(formData, "catatan") || null,
        totalItem: items.length,
        totalNilai: String(
          items.reduce((total, item) => total + item.subtotal, 0)
        ),
        items: {
          create: items.map((item) => ({
            penerimaanBarangItemId: item.penerimaanBarangItemId || null,
            sparepartId: item.sparepartId || null,
            alasanReturId: item.alasanReturId || null,
            namaSparepart: item.namaSparepart || "Sparepart",
            qtyDiterima: String(item.qtyDiterima),
            qtyRetur: String(item.qtyRetur),
            satuan: item.satuan || null,
            hargaBeli: String(item.hargaBeli),
            subtotal: String(item.subtotal),
          })),
        },
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "UPDATE_DRAFT",
        entity: "RETUR_PEMBELIAN",
        entityId: result.id,
        entityNo: result.noRetur,
        status: result.status,
        message: `${result.noRetur} diperbarui`,
      },
      tx
    );

    return result;
  });

  if (intent === "post") {
    const postFormData = new FormData();
    postFormData.set("id", id);
    postFormData.set("returnTo", `/pembelian/retur-pembelian/${id}`);
    await postReturPembelianAction(postFormData);
  }

  revalidatePath("/pembelian/retur-pembelian");
  revalidatePath(`/pembelian/retur-pembelian/${id}`);
  redirectWithNotice(
    `/pembelian/retur-pembelian/${id}`,
    "success",
    updated.status === "DRAFT"
      ? "Draft retur pembelian berhasil diperbarui."
      : "Retur pembelian berhasil diposting."
  );
};

export const cancelPostedPenerimaanBarangAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("penerimaan_barang", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membatalkan posting penerimaan.", "/pembelian/penerimaan-barang");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Penerimaan tidak valid.", "/pembelian/penerimaan-barang");

  const penerimaan = await prisma.penerimaanBarang.findUnique({
    where: {
      id,
    },
    include: {
      purchaseOrder: {
        include: {
          items: true,
        },
      },
      items: true,
      retur: {
        select: {
          status: true,
        },
      },
    },
  });

  if (
    !penerimaan ||
    penerimaan.status === "DRAFT" ||
    penerimaan.status === "DIBATALKAN"
  ) {
    return actionWarning(formData, "Penerimaan ini tidak bisa dibatalkan posting.", "/pembelian/penerimaan-barang");
  }

  const hasActiveRetur = penerimaan.retur.some(
    (item) => item.status !== "DIBATALKAN"
  );
  if (hasActiveRetur) {
    return actionWarning(formData, "Penerimaan tidak bisa dibatalkan karena sudah memiliki retur aktif.", `/pembelian/penerimaan-barang/${id}`);
  }

  const stockChecks = await prisma.sparepart.findMany({
    where: {
      id: {
        in: penerimaan.items
          .map((item) => item.sparepartId)
          .filter((itemId): itemId is string => Boolean(itemId)),
      },
    },
    select: {
      id: true,
      stok: true,
    },
  });
  const stockById = new Map(stockChecks.map((item) => [item.id, item.stok]));
  const hasInsufficientStock = penerimaan.items.some(
    (item) =>
      item.sparepartId &&
      (stockById.get(item.sparepartId) ?? 0) < Number(item.qtyTerima)
  );

  if (hasInsufficientStock) {
    return actionError(formData, "Stok tidak cukup untuk reverse penerimaan barang.", `/pembelian/penerimaan-barang/${id}`);
  }

  await prisma.$transaction(async (tx) => {
    for (const item of penerimaan.items) {
      const qtyTerima = Number(item.qtyTerima);
      const hargaBeli = Number(item.hargaBeli);

      if (item.purchaseOrderItemId) {
        await tx.purchaseOrderItem.update({
          where: {
            id: item.purchaseOrderItemId,
          },
          data: {
            qtyDiterima: {
              decrement: String(qtyTerima),
            },
          },
        });
      }

      if (!item.sparepartId) continue;

      const sparepart = await tx.sparepart.findUnique({
        where: {
          id: item.sparepartId,
        },
        select: {
          id: true,
          stok: true,
          lokasiId: true,
          satuan: {
            select: {
              nama: true,
            },
          },
        },
      });

      if (!sparepart) continue;

      const stokSebelum = sparepart.stok;
      const stokSesudah = stokSebelum - qtyTerima;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          stok: {
            decrement: qtyTerima,
          },
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal: new Date(),
          sparepartId: sparepart.id,
          lokasiId: sparepart.lokasiId,
          tipe: "KELUAR",
          qtyMasuk: "0",
          qtyKeluar: String(qtyTerima),
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(hargaBeli),
          refTipe: "BATAL_PENERIMAAN_BARANG",
          refId: penerimaan.id,
          refNo: penerimaan.noPenerimaan,
          catatan: `Pembatalan penerimaan ${penerimaan.noPenerimaan}`,
        },
      });
    }

    await tx.penerimaanBarang.update({
      where: {
        id: penerimaan.id,
      },
      data: {
        status: "DIBATALKAN",
      },
    });

    if (penerimaan.purchaseOrderId && penerimaan.purchaseOrder) {
      const latestItems = await tx.purchaseOrderItem.findMany({
        where: {
          purchaseOrderId: penerimaan.purchaseOrderId,
        },
      });
      const anyReceived = latestItems.some(
        (item) => Number(item.qtyDiterima) > 0
      );
      const allComplete = latestItems.every(
        (item) => Number(item.qtyDiterima) >= Number(item.qtyPesan)
      );

      await tx.purchaseOrder.update({
        where: {
          id: penerimaan.purchaseOrderId,
        },
        data: {
          status: allComplete ? "DITERIMA" : anyReceived ? "DIKIRIM" : "DIKIRIM",
        },
      });
    }

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "REVERSE_CANCEL",
        entity: "PENERIMAAN_BARANG",
        entityId: penerimaan.id,
        entityNo: penerimaan.noPenerimaan,
        status: "DIBATALKAN",
        message: `${penerimaan.noPenerimaan} dibatalkan dengan reverse stok`,
      },
      tx
    );
  });

  revalidatePath("/pembelian/penerimaan-barang");
  revalidatePath(`/pembelian/penerimaan-barang/${id}`);
  if (penerimaan.purchaseOrderId) {
    revalidatePath(`/pembelian/purchase-order/${penerimaan.purchaseOrderId}`);
  }
  revalidatePath("/inventory/sparepart");
  actionSuccess(formData, "Posting penerimaan berhasil dibatalkan dan stok sudah direverse.", `/pembelian/penerimaan-barang/${id}`);
};

export const cancelPostedReturPembelianAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("retur_pembelian", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membatalkan posting retur.", "/pembelian/retur-pembelian");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Retur pembelian tidak valid.", "/pembelian/retur-pembelian");

  const retur = await prisma.returPembelian.findUnique({
    where: {
      id,
    },
    include: {
      penerimaanBarang: {
        select: {
          id: true,
          noPenerimaan: true,
        },
      },
      items: true,
    },
  });

  if (
    !retur ||
    retur.status === "DRAFT" ||
    retur.status === "DIBATALKAN"
  ) {
    return actionWarning(formData, "Retur pembelian ini tidak bisa dibatalkan posting.", "/pembelian/retur-pembelian");
  }

  await prisma.$transaction(async (tx) => {
    for (const item of retur.items) {
      if (!item.sparepartId) continue;

      const qtyRetur = Number(item.qtyRetur);
      const hargaBeli = Number(item.hargaBeli);
      const sparepart = await tx.sparepart.findUnique({
        where: {
          id: item.sparepartId,
        },
        select: {
          id: true,
          stok: true,
          lokasiId: true,
          satuan: {
            select: {
              nama: true,
            },
          },
        },
      });

      if (!sparepart) continue;

      const stokSebelum = sparepart.stok;
      const stokSesudah = stokSebelum + qtyRetur;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          stok: {
            increment: qtyRetur,
          },
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal: new Date(),
          sparepartId: sparepart.id,
          lokasiId: sparepart.lokasiId,
          tipe: "MASUK",
          qtyMasuk: String(qtyRetur),
          qtyKeluar: "0",
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(hargaBeli),
          refTipe: "BATAL_RETUR_PEMBELIAN",
          refId: retur.id,
          refNo: retur.noRetur,
          catatan: `Pembatalan retur ${retur.noRetur}`,
        },
      });
    }

    await tx.returPembelian.update({
      where: {
        id: retur.id,
      },
      data: {
        status: "DIBATALKAN",
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "REVERSE_CANCEL",
        entity: "RETUR_PEMBELIAN",
        entityId: retur.id,
        entityNo: retur.noRetur,
        status: "DIBATALKAN",
        message: `${retur.noRetur} dibatalkan dengan reverse stok`,
      },
      tx
    );
  });

  revalidatePath("/pembelian/retur-pembelian");
  revalidatePath(`/pembelian/retur-pembelian/${id}`);
  if (retur.penerimaanBarang?.id) {
    revalidatePath(`/pembelian/penerimaan-barang/${retur.penerimaanBarang.id}`);
  }
  revalidatePath("/inventory/sparepart");
  actionSuccess(formData, "Posting retur berhasil dibatalkan dan stok sudah direverse.", `/pembelian/retur-pembelian/${id}`);
};

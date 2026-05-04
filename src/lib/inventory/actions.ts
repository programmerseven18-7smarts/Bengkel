"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  actionWarning,
} from "@/lib/action-feedback";
import { writeAuditLog } from "@/lib/audit";
import { getAuthorizedUser } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

const getValue = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const parseDateInput = (value: string) => {
  if (!value) return new Date();
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

type StokMasukPayload = {
  sparepartId?: string;
  namaSparepart?: string;
  qtyMasuk?: number;
  satuan?: string;
  hargaModal?: number;
  catatan?: string;
};

type StokKeluarPayload = {
  sparepartId?: string;
  namaSparepart?: string;
  stok?: number;
  qtyKeluar?: number;
  satuan?: string;
  hargaModal?: number;
  catatan?: string;
};

type MutasiPayload = {
  sparepartId?: string;
  namaSparepart?: string;
  stokAsal?: number;
  qtyMutasi?: number;
  satuan?: string;
  catatan?: string;
};

const parseItems = <T>(raw: string): T[] => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const toNumber = (value: unknown) => {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const stokKeluarTipe = (value: string) => {
  if (value === "PENJUALAN") return "PENJUALAN";
  if (value === "RETUR") return "RETUR";
  if (value === "LAINNYA") return "LAINNYA";
  return "SERVIS";
};

export const createStokMasukAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("stok_masuk", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat stok masuk.", "/inventory/stok-masuk");

  const tanggal = parseDateInput(getValue(formData, "tanggal"));
  const sumber = getValue(formData, "sumber");
  const supplierId = getValue(formData, "supplierId") || null;
  const referensi = getValue(formData, "referensi") || null;
  const catatan = getValue(formData, "catatan") || null;
  const items = parseItems<StokMasukPayload>(getValue(formData, "items"))
    .map((item) => ({
      ...item,
      qtyMasuk: toNumber(item.qtyMasuk),
      hargaModal: toNumber(item.hargaModal),
    }))
    .filter((item) => item.sparepartId && item.qtyMasuk > 0);

  if (!sumber) return actionError(formData, "Sumber stok masuk wajib dipilih.", "/inventory/stok-masuk/create");
  if (items.length === 0) return actionError(formData, "Minimal satu sparepart masuk wajib diisi.", "/inventory/stok-masuk/create");

  const noTransaksi = await getNextTransactionNumber(
    (await prisma.stokMasuk.findMany({ select: { noTransaksi: true } })).map((item) => item.noTransaksi),
    "SM",
    tanggal
  );
  const totalNilai = items.reduce((sum, item) => sum + item.qtyMasuk * item.hargaModal, 0);

  const stokMasuk = await prisma.$transaction(async (tx) => {
    const created = await tx.stokMasuk.create({
      data: {
        noTransaksi,
        tanggal,
        sumber,
        supplierId,
        referensi,
        catatan,
        totalItem: items.length,
        totalNilai: String(totalNilai),
        items: {
          create: items.map((item) => ({
            sparepartId: item.sparepartId,
            namaSparepart: item.namaSparepart || "Sparepart",
            qtyMasuk: String(item.qtyMasuk),
            satuan: item.satuan || null,
            hargaModal: String(item.hargaModal),
            subtotal: String(item.qtyMasuk * item.hargaModal),
            catatan: item.catatan || null,
          })),
        },
      },
    });

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
      const stokSesudah = stokSebelum + item.qtyMasuk;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          stok: {
            increment: item.qtyMasuk,
          },
          hargaBeli: String(item.hargaModal),
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal,
          sparepartId: sparepart.id,
          lokasiId: sparepart.lokasiId,
          tipe: "MASUK",
          qtyMasuk: String(item.qtyMasuk),
          qtyKeluar: "0",
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(item.hargaModal),
          refTipe: "STOK_MASUK",
          refId: created.id,
          refNo: created.noTransaksi,
          catatan: item.catatan || catatan,
        },
      });
    }

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "POST",
        entity: "STOK_MASUK",
        entityId: created.id,
        entityNo: created.noTransaksi,
        status: "POSTED",
        message: `${created.noTransaksi} dibuat dari input manual.`,
      },
      tx
    );

    return created;
  });

  revalidatePath("/inventory/stok-masuk");
  revalidatePath("/inventory/sparepart");
  revalidatePath("/laporan/stok");
  actionSuccess(formData, `Stok masuk ${stokMasuk.noTransaksi} berhasil disimpan.`, "/inventory/stok-masuk");
};

export const createStokKeluarManualAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("stok_keluar", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat stok keluar.", "/inventory/stok-keluar");

  const tanggal = parseDateInput(getValue(formData, "tanggal"));
  const tipe = stokKeluarTipe(getValue(formData, "tipe"));
  const referensi = getValue(formData, "referensi") || null;
  const dimintaOleh = getValue(formData, "dimintaOleh") || null;
  const catatan = getValue(formData, "catatan") || null;
  const items = parseItems<StokKeluarPayload>(getValue(formData, "items"))
    .map((item) => ({
      ...item,
      qtyKeluar: toNumber(item.qtyKeluar),
      hargaModal: toNumber(item.hargaModal),
    }))
    .filter((item) => item.sparepartId && item.qtyKeluar > 0);

  if (items.length === 0) return actionError(formData, "Minimal satu sparepart keluar wajib diisi.", "/inventory/stok-keluar/create");

  const sparepartIds = items.map((item) => item.sparepartId).filter(Boolean) as string[];
  const spareparts = await prisma.sparepart.findMany({
    where: {
      id: {
        in: sparepartIds,
      },
    },
    select: {
      id: true,
      stok: true,
    },
  });
  const stockById = new Map(spareparts.map((item) => [item.id, item.stok]));
  const insufficient = items.some((item) => (stockById.get(item.sparepartId ?? "") ?? 0) < item.qtyKeluar);

  if (insufficient) {
    return actionError(formData, "Stok tidak cukup untuk salah satu sparepart.", "/inventory/stok-keluar/create");
  }

  const noTransaksi = await getNextTransactionNumber(
    (await prisma.stokKeluar.findMany({ select: { noTransaksi: true } })).map((item) => item.noTransaksi),
    "SK",
    tanggal
  );
  const totalNilai = items.reduce((sum, item) => sum + item.qtyKeluar * item.hargaModal, 0);

  const stokKeluar = await prisma.$transaction(async (tx) => {
    const created = await tx.stokKeluar.create({
      data: {
        noTransaksi,
        tanggal,
        tipe,
        referensi,
        dimintaOleh,
        catatan,
        totalItem: items.length,
        totalNilai: String(totalNilai),
        items: {
          create: items.map((item) => ({
            sparepartId: item.sparepartId,
            namaSparepart: item.namaSparepart || "Sparepart",
            stokSaatItu: toNumber(stockById.get(item.sparepartId ?? "")),
            qtyKeluar: String(item.qtyKeluar),
            satuan: item.satuan || null,
            hargaModal: String(item.hargaModal),
            subtotal: String(item.qtyKeluar * item.hargaModal),
            catatan: item.catatan || null,
          })),
        },
      },
    });

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
      const stokSesudah = stokSebelum - item.qtyKeluar;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          stok: {
            decrement: item.qtyKeluar,
          },
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal,
          sparepartId: sparepart.id,
          lokasiId: sparepart.lokasiId,
          tipe: "KELUAR",
          qtyMasuk: "0",
          qtyKeluar: String(item.qtyKeluar),
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(item.hargaModal),
          refTipe: "STOK_KELUAR",
          refId: created.id,
          refNo: created.noTransaksi,
          catatan: item.catatan || catatan,
        },
      });
    }

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "POST",
        entity: "STOK_KELUAR",
        entityId: created.id,
        entityNo: created.noTransaksi,
        status: "POSTED",
        message: `${created.noTransaksi} dibuat dari input manual.`,
      },
      tx
    );

    return created;
  });

  revalidatePath("/inventory/stok-keluar");
  revalidatePath("/inventory/sparepart");
  revalidatePath("/laporan/stok");
  actionSuccess(formData, `Stok keluar ${stokKeluar.noTransaksi} berhasil disimpan.`, "/inventory/stok-keluar");
};

export const createMutasiStokAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("mutasi_stok", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat mutasi stok.", "/inventory/mutasi");

  const tanggal = parseDateInput(getValue(formData, "tanggal"));
  const lokasiAsalId = getValue(formData, "lokasiAsalId");
  const lokasiTujuanId = getValue(formData, "lokasiTujuanId");
  const catatan = getValue(formData, "catatan") || null;
  const items = parseItems<MutasiPayload>(getValue(formData, "items"))
    .map((item) => ({
      ...item,
      qtyMutasi: toNumber(item.qtyMutasi),
    }))
    .filter((item) => item.sparepartId && item.qtyMutasi > 0);

  if (!lokasiAsalId || !lokasiTujuanId) {
    return actionError(formData, "Lokasi asal dan tujuan wajib dipilih.", "/inventory/mutasi/create");
  }

  if (lokasiAsalId === lokasiTujuanId) {
    return actionWarning(formData, "Lokasi asal dan tujuan tidak boleh sama.", "/inventory/mutasi/create");
  }

  if (items.length === 0) return actionError(formData, "Minimal satu sparepart mutasi wajib diisi.", "/inventory/mutasi/create");

  const noMutasi = await getNextTransactionNumber(
    (await prisma.mutasiStok.findMany({ select: { noMutasi: true } })).map((item) => item.noMutasi),
    "MT",
    tanggal
  );
  const totalQty = items.reduce((sum, item) => sum + item.qtyMutasi, 0);

  const mutasi = await prisma.$transaction(async (tx) => {
    const created = await tx.mutasiStok.create({
      data: {
        noMutasi,
        tanggal,
        lokasiAsalId,
        lokasiTujuanId,
        penanggungJawabId: currentUser.id,
        catatan,
        totalQty: String(totalQty),
        items: {
          create: items.map((item) => ({
            sparepartId: item.sparepartId,
            namaSparepart: item.namaSparepart || "Sparepart",
            stokAsal: toNumber(item.stokAsal),
            qtyMutasi: String(item.qtyMutasi),
            satuan: item.satuan || null,
            catatan: item.catatan || null,
          })),
        },
      },
    });

    for (const item of items) {
      if (!item.sparepartId) continue;

      const sparepart = await tx.sparepart.findUnique({
        where: {
          id: item.sparepartId,
        },
        select: {
          id: true,
          stok: true,
          satuan: {
            select: {
              nama: true,
            },
          },
          hargaBeli: true,
        },
      });

      if (!sparepart) continue;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          lokasiId: lokasiTujuanId,
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal,
          sparepartId: sparepart.id,
          lokasiId: lokasiTujuanId,
          tipe: "MUTASI",
          qtyMasuk: "0",
          qtyKeluar: "0",
          stokSebelum: String(sparepart.stok),
          stokSesudah: String(sparepart.stok),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(sparepart.hargaBeli),
          refTipe: "MUTASI_STOK",
          refId: created.id,
          refNo: created.noMutasi,
          catatan: item.catatan || catatan,
        },
      });
    }

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "POST",
        entity: "MUTASI_STOK",
        entityId: created.id,
        entityNo: created.noMutasi,
        status: "POSTED",
        message: `${created.noMutasi} dibuat dari input manual.`,
      },
      tx
    );

    return created;
  });

  revalidatePath("/inventory/mutasi");
  revalidatePath("/inventory/sparepart");
  actionSuccess(formData, `Mutasi stok ${mutasi.noMutasi} berhasil disimpan.`, "/inventory/mutasi");
};

export const cancelStokKeluarAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("stok_keluar", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membatalkan stok keluar.", "/inventory/stok-keluar");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Stok keluar tidak valid.", "/inventory/stok-keluar");

  const stokKeluar = await prisma.stokKeluar.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  if (!stokKeluar) return actionError(formData, "Stok keluar tidak ditemukan.", "/inventory/stok-keluar");

  const existingReverse = await prisma.stokLedger.findFirst({
    where: {
      refTipe: "BATAL_STOK_KELUAR",
      refId: stokKeluar.id,
    },
    select: {
      id: true,
    },
  });

  if (existingReverse) {
    return actionWarning(formData, "Stok keluar ini sudah pernah dibatalkan.", `/inventory/stok-keluar/${id}`);
  }

  await prisma.$transaction(async (tx) => {
    for (const item of stokKeluar.items) {
      if (!item.sparepartId) continue;

      const qty = Number(item.qtyKeluar);
      const hargaModal = Number(item.hargaModal);
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
      const stokSesudah = stokSebelum + qty;

      await tx.sparepart.update({
        where: {
          id: sparepart.id,
        },
        data: {
          stok: {
            increment: qty,
          },
        },
      });

      await tx.stokLedger.create({
        data: {
          tanggal: new Date(),
          sparepartId: sparepart.id,
          lokasiId: sparepart.lokasiId,
          tipe: "MASUK",
          qtyMasuk: String(qty),
          qtyKeluar: "0",
          stokSebelum: String(stokSebelum),
          stokSesudah: String(stokSesudah),
          satuan: item.satuan || sparepart.satuan?.nama || null,
          hargaModal: String(hargaModal),
          refTipe: "BATAL_STOK_KELUAR",
          refId: stokKeluar.id,
          refNo: stokKeluar.noTransaksi,
          catatan: `Pembatalan stok keluar ${stokKeluar.noTransaksi}`,
        },
      });
    }

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "REVERSE_CANCEL",
        entity: "STOK_KELUAR",
        entityId: stokKeluar.id,
        entityNo: stokKeluar.noTransaksi,
        status: "DIBATALKAN",
        message: `${stokKeluar.noTransaksi} dibatalkan dengan reverse stok`,
      },
      tx
    );
  });

  revalidatePath("/inventory/stok-keluar");
  revalidatePath(`/inventory/stok-keluar/${id}`);
  revalidatePath("/inventory/sparepart");
  actionSuccess(formData, "Stok keluar berhasil dibatalkan dan stok sudah direverse.", `/inventory/stok-keluar/${id}`);
};

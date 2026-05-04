"use server";

import { revalidatePath as refreshPath } from "next/cache";
import {
  actionError,
  actionSuccess,
  actionWarning,
  redirectWithNotice,
} from "@/lib/action-feedback";
import { writeAuditLog } from "@/lib/audit";
import { getAuthorizedUser } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";

const value = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const nullableValue = (formData: FormData, key: string) =>
  value(formData, key) || null;

const numberValue = (formData: FormData, key: string) =>
  Number(value(formData, key) || 0);

const statusData = (raw: string) =>
  raw === "TIDAK_AKTIF" || raw === "Tidak Aktif" ? "TIDAK_AKTIF" : "AKTIF";

const mekanikStatus = (raw: string) => {
  if (raw === "CUTI" || raw === "Cuti") return "CUTI";
  if (raw === "TIDAK_AKTIF" || raw === "Tidak Aktif") return "TIDAK_AKTIF";
  return "AKTIF";
};

const dateValue = (formData: FormData, key: string) => {
  const raw = value(formData, key);

  if (!raw) return null;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getNextCode = async (
  rowsPromise: Promise<Array<{ kode: string }>>,
  prefix: string
) => {
  const rows = await rowsPromise;
  return getNextSystemCode(rows.map((row) => row.kode), prefix);
};

const revalidatePath = (path: string) => {
  refreshPath(path);
  redirectWithNotice(path, "success", "Data berhasil disimpan.");
};

const safeDelete = async (deleteFn: () => Promise<unknown>, path: string) => {
  try {
    await deleteFn();
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    redirectWithNotice(path, "warning", "Data tidak bisa dihapus karena masih dipakai data lain.");
  }
};

export const createKategoriSparepartAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.kategoriSparepart.create({
    data: {
      kode: await getNextCode(prisma.kategoriSparepart.findMany({ select: { kode: true } }), "KSP"),
      nama,
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/kategori-sparepart");
};

export const updateKategoriSparepartAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.kategoriSparepart.update({
    where: { id },
    data: {
      nama,
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/kategori-sparepart");
};

export const deleteKategoriSparepartAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(
    () => prisma.kategoriSparepart.delete({ where: { id } }),
    "/master/kategori-sparepart"
  );
};

export const createKategoriJasaServisAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.kategoriJasaServis.create({
    data: {
      kode: await getNextCode(prisma.kategoriJasaServis.findMany({ select: { kode: true } }), "KJS"),
      nama,
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/kategori-jasa-servis");
};

export const updateKategoriJasaServisAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.kategoriJasaServis.update({
    where: { id },
    data: {
      nama,
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/kategori-jasa-servis");
};

export const deleteKategoriJasaServisAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(
    () => prisma.kategoriJasaServis.delete({ where: { id } }),
    "/master/kategori-jasa-servis"
  );
};

export const createSatuanAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.satuan.create({
    data: {
      kode: await getNextCode(prisma.satuan.findMany({ select: { kode: true } }), "SAT"),
      nama,
      jenis: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/satuan");
};

export const updateSatuanAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.satuan.update({
    where: { id },
    data: {
      nama,
      jenis: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/satuan");
};

export const deleteSatuanAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(() => prisma.satuan.delete({ where: { id } }), "/master/satuan");
};

export const createLokasiStokAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.lokasiStok.create({
    data: {
      kode: await getNextCode(prisma.lokasiStok.findMany({ select: { kode: true } }), "LOK"),
      nama,
      tipe: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/lokasi-stok");
};

export const updateLokasiStokAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.lokasiStok.update({
    where: { id },
    data: {
      nama,
      tipe: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/lokasi-stok");
};

export const deleteLokasiStokAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(() => prisma.lokasiStok.delete({ where: { id } }), "/master/lokasi-stok");
};

export const createMerkKendaraanAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.merkKendaraan.create({
    data: {
      kode: await getNextCode(prisma.merkKendaraan.findMany({ select: { kode: true } }), "MRK"),
      nama,
      jenisKendaraan: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/merk-kendaraan");
};

export const updateMerkKendaraanAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.merkKendaraan.update({
    where: { id },
    data: {
      nama,
      jenisKendaraan: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/merk-kendaraan");
};

export const deleteMerkKendaraanAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(
    () => prisma.merkKendaraan.delete({ where: { id } }),
    "/master/merk-kendaraan"
  );
};

export const createAlasanReturAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.alasanRetur.create({
    data: {
      kode: await getNextCode(prisma.alasanRetur.findMany({ select: { kode: true } }), "RTR"),
      nama,
      jenis: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/alasan-retur");
};

export const updateAlasanReturAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.alasanRetur.update({
    where: { id },
    data: {
      nama,
      jenis: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/alasan-retur");
};

export const deleteAlasanReturAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(() => prisma.alasanRetur.delete({ where: { id } }), "/master/alasan-retur");
};

export const createKondisiBarangAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.kondisiBarang.create({
    data: {
      kode: await getNextCode(prisma.kondisiBarang.findMany({ select: { kode: true } }), "KON"),
      nama,
      kelompok: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/kondisi-barang");
};

export const updateKondisiBarangAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.kondisiBarang.update({
    where: { id },
    data: {
      nama,
      kelompok: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/kondisi-barang");
};

export const deleteKondisiBarangAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(
    () => prisma.kondisiBarang.delete({ where: { id } }),
    "/master/kondisi-barang"
  );
};

export const createMetodePembayaranAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.metodePembayaran.create({
    data: {
      kode: await getNextCode(prisma.metodePembayaran.findMany({ select: { kode: true } }), "PAY"),
      nama,
      tipe: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/metode-pembayaran");
};

export const updateMetodePembayaranAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.metodePembayaran.update({
    where: { id },
    data: {
      nama,
      tipe: nullableValue(formData, "kategori"),
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/metode-pembayaran");
};

export const deleteMetodePembayaranAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(
    () => prisma.metodePembayaran.delete({ where: { id } }),
    "/master/metode-pembayaran"
  );
};

export const createSupplierAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.supplier.create({
    data: {
      kode: await getNextCode(prisma.supplier.findMany({ select: { kode: true } }), "SUP"),
      nama,
      noHp: nullableValue(formData, "noHp"),
      email: nullableValue(formData, "email"),
      alamat: nullableValue(formData, "alamat"),
      produkUtama: nullableValue(formData, "produk"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/supplier");
};

export const updateSupplierAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.supplier.update({
    where: {
      id,
    },
    data: {
      nama,
      noHp: nullableValue(formData, "noHp"),
      email: nullableValue(formData, "email"),
      alamat: nullableValue(formData, "alamat"),
      produkUtama: nullableValue(formData, "produk"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/supplier");
};

export const deleteSupplierAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(() => prisma.supplier.delete({ where: { id } }), "/master/supplier");
};

export const createPelangganAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.pelanggan.create({
    data: {
      kode: await getNextCode(prisma.pelanggan.findMany({ select: { kode: true } }), "PLG"),
      nama,
      noHp: nullableValue(formData, "noHp"),
      email: nullableValue(formData, "email"),
      alamat: nullableValue(formData, "alamat"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/pelanggan");
};

export const updatePelangganAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.pelanggan.update({
    where: {
      id,
    },
    data: {
      nama,
      noHp: nullableValue(formData, "noHp"),
      email: nullableValue(formData, "email"),
      alamat: nullableValue(formData, "alamat"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/pelanggan");
};

export const deletePelangganAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(() => prisma.pelanggan.delete({ where: { id } }), "/master/pelanggan");
};

export const createMekanikAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.mekanik.create({
    data: {
      kode: await getNextCode(prisma.mekanik.findMany({ select: { kode: true } }), "MEK"),
      nama,
      noHp: nullableValue(formData, "noHp"),
      spesialisasi: nullableValue(formData, "spesialisasi"),
      tanggalBergabung: dateValue(formData, "tanggalBergabung"),
      status: mekanikStatus(value(formData, "status")),
    },
  });

  revalidatePath("/master/mekanik");
};

export const updateMekanikAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.mekanik.update({
    where: {
      id,
    },
    data: {
      nama,
      noHp: nullableValue(formData, "noHp"),
      spesialisasi: nullableValue(formData, "spesialisasi"),
      tanggalBergabung: dateValue(formData, "tanggalBergabung"),
      status: mekanikStatus(value(formData, "status")),
    },
  });

  revalidatePath("/master/mekanik");
};

export const deleteMekanikAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(() => prisma.mekanik.delete({ where: { id } }), "/master/mekanik");
};

export const createJasaServisAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.jasaServis.create({
    data: {
      kode: await getNextCode(prisma.jasaServis.findMany({ select: { kode: true } }), "JSV"),
      nama,
      kategoriId: nullableValue(formData, "kategoriId"),
      harga: String(numberValue(formData, "harga")),
      estimasiMenit: numberValue(formData, "estimasiMenit") || null,
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/jasa-servis");
};

export const updateJasaServisAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.jasaServis.update({
    where: {
      id,
    },
    data: {
      nama,
      kategoriId: nullableValue(formData, "kategoriId"),
      harga: String(numberValue(formData, "harga")),
      estimasiMenit: numberValue(formData, "estimasiMenit") || null,
      deskripsi: nullableValue(formData, "deskripsi"),
      status: statusData(value(formData, "status")),
    },
  });

  revalidatePath("/master/jasa-servis");
};

export const deleteJasaServisAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(() => prisma.jasaServis.delete({ where: { id } }), "/master/jasa-servis");
};

type PaketJasaPayload = {
  jasaServisId?: string;
  estimasiMenit?: number;
  hargaNormal?: number;
};

type PaketSparepartPayload = {
  sparepartId?: string;
  qty?: number;
  hargaNormal?: number;
};

const parseJsonItems = <T>(raw: string): T[] => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export const createPaketServisAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("paket_servis", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat paket servis.", "/master/paket-servis");

  const nama = value(formData, "nama");
  const jenisKendaraan = nullableValue(formData, "jenisKendaraan");
  const estimasiMenit = numberValue(formData, "estimasiMenit") || null;
  const hargaPaket = numberValue(formData, "hargaPaket");
  const catatan = nullableValue(formData, "catatan");
  const status = statusData(value(formData, "status"));
  const jasaItems = parseJsonItems<PaketJasaPayload>(value(formData, "jasaItems"))
    .map((item) => ({
      ...item,
      estimasiMenit: Number(item.estimasiMenit ?? 0),
      hargaNormal: Number(item.hargaNormal ?? 0),
    }))
    .filter((item) => item.jasaServisId);
  const sparepartItems = parseJsonItems<PaketSparepartPayload>(value(formData, "sparepartItems"))
    .map((item) => ({
      ...item,
      qty: Number(item.qty ?? 0),
      hargaNormal: Number(item.hargaNormal ?? 0),
    }))
    .filter((item) => item.sparepartId && item.qty > 0);

  if (!nama) return actionError(formData, "Nama paket servis wajib diisi.", "/master/paket-servis/create");
  if (jasaItems.length === 0 && sparepartItems.length === 0) {
    return actionError(formData, "Minimal satu jasa atau sparepart wajib masuk paket.", "/master/paket-servis/create");
  }

  const kode = await getNextCode(
    prisma.paketServis.findMany({
      select: {
        kode: true,
      },
    }),
    "PKT"
  );

  const paket = await prisma.paketServis.create({
    data: {
      kode,
      nama,
      jenisKendaraan,
      estimasiMenit,
      hargaPaket: String(hargaPaket),
      catatan,
      status,
      jasaItems: {
        create: jasaItems.map((item) => ({
          jasaServisId: item.jasaServisId as string,
          estimasiMenit: item.estimasiMenit || null,
          hargaNormal: String(item.hargaNormal),
        })),
      },
      sparepartItems: {
        create: sparepartItems.map((item) => ({
          sparepartId: item.sparepartId as string,
          qty: String(item.qty),
          hargaNormal: String(item.hargaNormal),
        })),
      },
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    entity: "PAKET_SERVIS",
    entityId: paket.id,
    entityNo: paket.kode,
    status: "SUCCESS",
    message: `Paket servis ${paket.nama} dibuat.`,
  });

  refreshPath("/master/paket-servis");
  actionSuccess(formData, "Paket servis berhasil dibuat.", "/master/paket-servis");
};

export const updatePaketServisAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("paket_servis", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses edit paket servis.", "/master/paket-servis");

  const id = value(formData, "id");
  const nama = value(formData, "nama");
  const jenisKendaraan = nullableValue(formData, "jenisKendaraan");
  const estimasiMenit = numberValue(formData, "estimasiMenit") || null;
  const hargaPaket = numberValue(formData, "hargaPaket");
  const catatan = nullableValue(formData, "catatan");
  const status = statusData(value(formData, "status"));
  const jasaItems = parseJsonItems<PaketJasaPayload>(value(formData, "jasaItems"))
    .map((item) => ({
      ...item,
      estimasiMenit: Number(item.estimasiMenit ?? 0),
      hargaNormal: Number(item.hargaNormal ?? 0),
    }))
    .filter((item) => item.jasaServisId);
  const sparepartItems = parseJsonItems<PaketSparepartPayload>(value(formData, "sparepartItems"))
    .map((item) => ({
      ...item,
      qty: Number(item.qty ?? 0),
      hargaNormal: Number(item.hargaNormal ?? 0),
    }))
    .filter((item) => item.sparepartId && item.qty > 0);

  if (!id || !nama) return actionError(formData, "Nama paket servis wajib diisi.", "/master/paket-servis");

  const paket = await prisma.$transaction(async (tx) => {
    await tx.paketServisJasa.deleteMany({
      where: {
        paketServisId: id,
      },
    });
    await tx.paketServisSparepart.deleteMany({
      where: {
        paketServisId: id,
      },
    });

    const updated = await tx.paketServis.update({
      where: {
        id,
      },
      data: {
        nama,
        jenisKendaraan,
        estimasiMenit,
        hargaPaket: String(hargaPaket),
        catatan,
        status,
        jasaItems: {
          create: jasaItems.map((item) => ({
            jasaServisId: item.jasaServisId as string,
            estimasiMenit: item.estimasiMenit || null,
            hargaNormal: String(item.hargaNormal),
          })),
        },
        sparepartItems: {
          create: sparepartItems.map((item) => ({
            sparepartId: item.sparepartId as string,
            qty: String(item.qty),
            hargaNormal: String(item.hargaNormal),
          })),
        },
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "UPDATE",
        entity: "PAKET_SERVIS",
        entityId: updated.id,
        entityNo: updated.kode,
        status: "SUCCESS",
        message: `Paket servis ${updated.nama} diperbarui.`,
      },
      tx
    );

    return updated;
  });

  refreshPath("/master/paket-servis");
  refreshPath(`/master/paket-servis/${id}/edit`);
  actionSuccess(formData, `Paket servis ${paket.kode} berhasil diperbarui.`, "/master/paket-servis");
};

export const deletePaketServisAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("paket_servis", "delete");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses hapus paket servis.", "/master/paket-servis");

  const id = value(formData, "id");
  if (!id) return actionError(formData, "Paket servis tidak valid.", "/master/paket-servis");

  const paket = await prisma.paketServis.findUnique({
    where: {
      id,
    },
    select: {
      kode: true,
      nama: true,
      _count: {
        select: {
          workOrders: true,
        },
      },
    },
  });

  if (!paket) return actionWarning(formData, "Paket servis tidak ditemukan.", "/master/paket-servis");
  if (paket._count.workOrders > 0) {
    return actionWarning(formData, "Paket servis masih dipakai work order, jadi belum bisa dihapus.", "/master/paket-servis");
  }

  await prisma.paketServis.delete({
    where: {
      id,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    entity: "PAKET_SERVIS",
    entityId: id,
    entityNo: paket.kode,
    status: "SUCCESS",
    message: `Paket servis ${paket.nama} dihapus.`,
  });

  refreshPath("/master/paket-servis");
  actionSuccess(formData, "Paket servis berhasil dihapus.", "/master/paket-servis");
};

export const createSparepartAction = async (formData: FormData) => {
  const nama = value(formData, "nama");

  if (!nama) return;

  await prisma.sparepart.create({
    data: {
      kode: await getNextCode(prisma.sparepart.findMany({ select: { kode: true } }), "SPR"),
      nama,
      kategoriId: nullableValue(formData, "kategoriId"),
      supplierId: nullableValue(formData, "supplierId"),
      satuanId: nullableValue(formData, "satuanId"),
      lokasiId: nullableValue(formData, "lokasiId"),
      stok: numberValue(formData, "stok"),
      minStok: numberValue(formData, "minStok"),
      hargaBeli: String(numberValue(formData, "hargaBeli")),
      hargaJual: String(numberValue(formData, "hargaJual")),
      status: "AKTIF",
    },
  });

  revalidatePath("/inventory/sparepart");
};

export const updateSparepartAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const nama = value(formData, "nama");

  if (!id || !nama) return;

  await prisma.sparepart.update({
    where: {
      id,
    },
    data: {
      nama,
      kategoriId: nullableValue(formData, "kategoriId"),
      supplierId: nullableValue(formData, "supplierId"),
      satuanId: nullableValue(formData, "satuanId"),
      lokasiId: nullableValue(formData, "lokasiId"),
      stok: numberValue(formData, "stok"),
      minStok: numberValue(formData, "minStok"),
      hargaBeli: String(numberValue(formData, "hargaBeli")),
      hargaJual: String(numberValue(formData, "hargaJual")),
    },
  });

  revalidatePath("/inventory/sparepart");
};

export const deleteSparepartAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(() => prisma.sparepart.delete({ where: { id } }), "/inventory/sparepart");
};

export const createKendaraanAction = async (formData: FormData) => {
  const platNomor = value(formData, "platNomor").toUpperCase();
  const pelangganId = value(formData, "pelangganId");
  const tipe = value(formData, "tipe");

  if (!platNomor || !pelangganId || !tipe) return;

  await prisma.kendaraan.create({
    data: {
      platNomor,
      pelangganId,
      merkId: nullableValue(formData, "merkId"),
      tipe,
      tahun: numberValue(formData, "tahun") || null,
      warna: nullableValue(formData, "warna"),
      noRangka: nullableValue(formData, "noRangka"),
      noMesin: nullableValue(formData, "noMesin"),
    },
  });

  revalidatePath("/master/kendaraan");
};

export const updateKendaraanAction = async (formData: FormData) => {
  const id = value(formData, "id");
  const platNomor = value(formData, "platNomor").toUpperCase();
  const pelangganId = value(formData, "pelangganId");
  const tipe = value(formData, "tipe");

  if (!id || !platNomor || !pelangganId || !tipe) return;

  await prisma.kendaraan.update({
    where: { id },
    data: {
      platNomor,
      pelangganId,
      merkId: nullableValue(formData, "merkId"),
      tipe,
      tahun: numberValue(formData, "tahun") || null,
      warna: nullableValue(formData, "warna"),
      noRangka: nullableValue(formData, "noRangka"),
      noMesin: nullableValue(formData, "noMesin"),
    },
  });

  revalidatePath("/master/kendaraan");
};

export const deleteKendaraanAction = async (formData: FormData) => {
  const id = value(formData, "id");

  if (!id) return;

  await safeDelete(() => prisma.kendaraan.delete({ where: { id } }), "/master/kendaraan");
};

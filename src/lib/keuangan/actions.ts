"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  actionWarning,
} from "@/lib/action-feedback";
import { writeAuditLog } from "@/lib/audit";
import { getAuthorizedUser } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

const getValue = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const parseDateInput = (value: string) => {
  if (!value) return new Date();
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const getInvoiceStatus = (sisaTagihan: number, terbayar: number) => {
  if (sisaTagihan <= 0) return "LUNAS";
  if (terbayar > 0) return "SEBAGIAN";
  return "BELUM_LUNAS";
};

const getPiutangStatus = (
  sisaPiutang: number,
  terbayar: number,
  jatuhTempo: Date | null | undefined
) => {
  if (sisaPiutang <= 0) return "LUNAS";
  if (jatuhTempo && jatuhTempo < new Date()) return "JATUH_TEMPO";
  if (terbayar > 0) return "SEBAGIAN";
  return "BELUM_LUNAS";
};

type ManualInvoiceItemPayload = {
  deskripsi?: string;
  tipe?: string;
  qty?: number;
  harga?: number;
  jasaServisId?: string;
  sparepartId?: string;
};

const parseItems = <T>(raw: string): T[] => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const normalizeInvoiceItemType = (
  value: string | undefined
): "JASA" | "SPAREPART" | "LAINNYA" => {
  if (value === "SPAREPART") return "SPAREPART";
  if (value === "LAINNYA") return "LAINNYA";
  return "JASA";
};

export const createManualInvoiceAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("invoice", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat invoice.", "/keuangan/invoice");

  const workOrderId = getValue(formData, "workOrderId");
  const pelangganId = getValue(formData, "pelangganId");
  const kendaraanId = getValue(formData, "kendaraanId") || null;
  const tanggalInvoice = parseDateInput(getValue(formData, "tanggalInvoice"));
  const jatuhTempoRaw = getValue(formData, "jatuhTempo");
  const jatuhTempo = jatuhTempoRaw ? parseDateInput(jatuhTempoRaw) : null;
  const catatan = getValue(formData, "catatan") || null;
  const intent = getValue(formData, "intent");
  const status = intent === "draft" ? "DRAFT" : "BELUM_LUNAS";
  const items = parseItems<ManualInvoiceItemPayload>(getValue(formData, "items"))
    .map((item) => ({
      ...item,
      tipe: normalizeInvoiceItemType(item.tipe),
      qty: Number(item.qty ?? 0),
      harga: Number(item.harga ?? 0),
    }))
    .filter((item) => item.deskripsi && item.qty > 0 && item.harga >= 0);

  if (!workOrderId || !pelangganId) {
    return actionError(formData, "Work order wajib dipilih untuk membuat invoice.", "/keuangan/invoice/create");
  }

  if (items.length === 0) {
    return actionError(formData, "Minimal satu item tagihan wajib diisi.", "/keuangan/invoice/create");
  }

  const existingInvoice = await prisma.invoice.findUnique({
    where: {
      workOrderId,
    },
    select: {
      id: true,
    },
  });

  if (existingInvoice) {
    return actionWarning(formData, "Work order ini sudah punya invoice.", `/keuangan/invoice/${existingInvoice.id}`);
  }

  const noInvoice = await getNextTransactionNumber(
    (await prisma.invoice.findMany({ select: { noInvoice: true } })).map((item) => item.noInvoice),
    "INV",
    tanggalInvoice
  );
  const totals = items.reduce(
    (acc, item) => {
      const subtotal = item.qty * item.harga;

      if (item.tipe === "JASA") acc.totalJasa += subtotal;
      if (item.tipe === "SPAREPART") acc.totalSparepart += subtotal;
      if (item.tipe === "LAINNYA") acc.totalLainnya += subtotal;

      return acc;
    },
    {
      totalJasa: 0,
      totalSparepart: 0,
      totalLainnya: 0,
    }
  );
  const grandTotal =
    totals.totalJasa + totals.totalSparepart + totals.totalLainnya;

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.invoice.create({
      data: {
        noInvoice,
        workOrderId,
        pelangganId,
        kendaraanId,
        tanggalInvoice,
        jatuhTempo,
        status,
        totalJasa: String(totals.totalJasa),
        totalSparepart: String(totals.totalSparepart),
        totalLainnya: String(totals.totalLainnya),
        grandTotal: String(grandTotal),
        terbayar: "0",
        sisaTagihan: String(grandTotal),
        catatan,
        items: {
          create: items.map((item) => ({
            tipe: item.tipe,
            deskripsi: item.deskripsi || "Item Tagihan",
            jasaServisId: item.tipe === "JASA" ? item.jasaServisId || null : null,
            sparepartId: item.tipe === "SPAREPART" ? item.sparepartId || null : null,
            qty: String(item.qty),
            harga: String(item.harga),
            subtotal: String(item.qty * item.harga),
          })),
        },
      },
    });

    if (status !== "DRAFT") {
      await tx.piutang.create({
        data: {
          invoiceId: created.id,
          pelangganId,
          tanggal: tanggalInvoice,
          jatuhTempo,
          totalTagihan: String(grandTotal),
          terbayar: "0",
          sisaPiutang: String(grandTotal),
          status: getPiutangStatus(grandTotal, 0, jatuhTempo),
        },
      });
    }

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: status === "DRAFT" ? "CREATE_DRAFT" : "POST",
        entity: "INVOICE",
        entityId: created.id,
        entityNo: created.noInvoice,
        status,
        message: `${created.noInvoice} dibuat manual dari menu invoice.`,
      },
      tx
    );

    return created;
  });

  revalidatePath("/keuangan/invoice");
  revalidatePath("/keuangan/piutang");
  revalidatePath("/laporan/keuangan");
  actionSuccess(formData, `Invoice ${invoice.noInvoice} berhasil dibuat.`, `/keuangan/invoice/${invoice.id}`);
};

export const createPembayaranAction = async (formData: FormData) => {
  const authorizedUser = await getAuthorizedUser("pembayaran", "create");
  if (!authorizedUser) return actionError(formData, "Anda tidak punya akses membuat pembayaran.", "/keuangan/invoice");

  const invoiceId = getValue(formData, "invoiceId");
  const jumlahBayar = Number(getValue(formData, "jumlahBayar"));
  const tanggal = parseDateInput(getValue(formData, "tanggal"));
  const metodePembayaranId = getValue(formData, "metodePembayaranId") || null;
  const akunKasBankId = getValue(formData, "akunKasBankId") || null;

  if (!invoiceId || !Number.isFinite(jumlahBayar) || jumlahBayar <= 0) {
    return actionError(formData, "Jumlah pembayaran tidak valid.", "/keuangan/invoice");
  }

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      piutang: true,
    },
  });

  if (!invoice) return actionError(formData, "Invoice tidak ditemukan.", "/keuangan/invoice");

  const sisaTagihan = Number(invoice.sisaTagihan);
  const amount = Math.min(jumlahBayar, sisaTagihan);

  if (amount <= 0) return actionWarning(formData, "Invoice ini sudah lunas.", `/keuangan/invoice/${invoiceId}`);

  const existingNumbers = await prisma.pembayaran.findMany({
    select: {
      noPembayaran: true,
    },
  });
  const existingKasNumbers = await prisma.kasBankTransaksi.findMany({
    select: {
      noTransaksi: true,
    },
  });
  const currentUser = await getCurrentUser();
  const noPembayaran = getNextTransactionNumber(
    existingNumbers.map((item) => item.noPembayaran),
    "PAY",
    tanggal
  );
  const noKasBank = getNextTransactionNumber(
    existingKasNumbers.map((item) => item.noTransaksi),
    "KB",
    tanggal
  );

  await prisma.$transaction(async (tx) => {
    const terbayar = Number(invoice.terbayar) + amount;
    const sisaBaru = Math.max(Number(invoice.grandTotal) - terbayar, 0);

    const pembayaran = await tx.pembayaran.create({
      data: {
        noPembayaran,
        invoiceId: invoice.id,
        pelangganId: invoice.pelangganId,
        tanggal,
        metodePembayaranId,
        akunKasBankId,
        jumlahBayar: String(amount),
        nomorReferensi: getValue(formData, "nomorReferensi") || null,
        kasirId: currentUser?.id ?? null,
        status: "SELESAI",
        catatan: getValue(formData, "catatan") || null,
      },
    });

    await tx.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        terbayar: String(terbayar),
        sisaTagihan: String(sisaBaru),
        status: getInvoiceStatus(sisaBaru, terbayar),
      },
    });

    if (invoice.piutang) {
      await tx.piutang.update({
        where: {
          invoiceId: invoice.id,
        },
        data: {
          terbayar: String(terbayar),
          sisaPiutang: String(sisaBaru),
          status: getPiutangStatus(sisaBaru, terbayar, invoice.piutang.jatuhTempo),
        },
      });
    }

    if (akunKasBankId) {
      const akun = await tx.akunKasBank.findUnique({
        where: {
          id: akunKasBankId,
        },
        select: {
          saldoAwal: true,
        },
      });
      const lastKas = await tx.kasBankTransaksi.findFirst({
        where: {
          akunKasBankId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          saldoAkhir: true,
        },
      });
      const saldoSebelum = Number(lastKas?.saldoAkhir ?? akun?.saldoAwal ?? 0);

      await tx.kasBankTransaksi.create({
        data: {
          noTransaksi: noKasBank,
          tanggal,
          jenis: "MASUK",
          kategori: "Pembayaran Invoice",
          deskripsi: `Pembayaran ${invoice.noInvoice}`,
          jumlah: String(amount),
          akunKasBankId,
          saldoAkhir: String(saldoSebelum + amount),
          refTipe: "PEMBAYARAN",
          refId: pembayaran.id,
          refNo: noPembayaran,
          createdById: currentUser?.id ?? null,
        },
      });
    }

    await writeAuditLog(
      {
        userId: authorizedUser.id,
        action: "POST",
        entity: "PEMBAYARAN",
        entityId: pembayaran.id,
        entityNo: pembayaran.noPembayaran,
        status: pembayaran.status,
        message: `Pembayaran ${invoice.noInvoice} sebesar ${amount}`,
      },
      tx
    );
  });

  revalidatePath("/keuangan/invoice");
  revalidatePath(`/keuangan/invoice/${invoiceId}`);
  revalidatePath("/keuangan/pembayaran");
  revalidatePath("/keuangan/piutang");
  revalidatePath("/keuangan/kas-bank");
  actionSuccess(formData, "Pembayaran berhasil disimpan.", `/keuangan/invoice/${invoiceId}`);
};

export const cancelPembayaranAction = async (formData: FormData) => {
  const authorizedUser = await getAuthorizedUser("pembayaran", "edit");
  if (!authorizedUser) return actionError(formData, "Anda tidak punya akses membatalkan pembayaran.", "/keuangan/pembayaran");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Pembayaran tidak valid.", "/keuangan/pembayaran");

  const pembayaran = await prisma.pembayaran.findUnique({
    where: {
      id,
    },
    include: {
      invoice: {
        include: {
          piutang: true,
        },
      },
    },
  });

  if (!pembayaran || pembayaran.status !== "SELESAI") {
    return actionWarning(formData, "Hanya pembayaran selesai yang bisa dibatalkan.", "/keuangan/pembayaran");
  }

  const amount = Number(pembayaran.jumlahBayar);
  const existingKasNumbers = await prisma.kasBankTransaksi.findMany({
    select: {
      noTransaksi: true,
    },
  });
  const currentUser = await getCurrentUser();
  const now = new Date();
  const noKasBank = getNextTransactionNumber(
    existingKasNumbers.map((item) => item.noTransaksi),
    "KB",
    now
  );

  await prisma.$transaction(async (tx) => {
    const terbayar = Math.max(Number(pembayaran.invoice.terbayar) - amount, 0);
    const sisaBaru = Math.max(Number(pembayaran.invoice.grandTotal) - terbayar, 0);

    await tx.pembayaran.update({
      where: {
        id,
      },
      data: {
        status: "BATAL",
      },
    });

    await tx.invoice.update({
      where: {
        id: pembayaran.invoiceId,
      },
      data: {
        terbayar: String(terbayar),
        sisaTagihan: String(sisaBaru),
        status: getInvoiceStatus(sisaBaru, terbayar),
      },
    });

    if (pembayaran.invoice.piutang) {
      await tx.piutang.update({
        where: {
          invoiceId: pembayaran.invoiceId,
        },
        data: {
          terbayar: String(terbayar),
          sisaPiutang: String(sisaBaru),
          status: getPiutangStatus(
            sisaBaru,
            terbayar,
            pembayaran.invoice.piutang.jatuhTempo
          ),
        },
      });
    }

    if (pembayaran.akunKasBankId) {
      const akun = await tx.akunKasBank.findUnique({
        where: {
          id: pembayaran.akunKasBankId,
        },
        select: {
          saldoAwal: true,
        },
      });
      const lastKas = await tx.kasBankTransaksi.findFirst({
        where: {
          akunKasBankId: pembayaran.akunKasBankId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          saldoAkhir: true,
        },
      });
      const saldoSebelum = Number(lastKas?.saldoAkhir ?? akun?.saldoAwal ?? 0);

      await tx.kasBankTransaksi.create({
        data: {
          noTransaksi: noKasBank,
          tanggal: now,
          jenis: "KELUAR",
          kategori: "Pembatalan Pembayaran",
          deskripsi: `Pembatalan ${pembayaran.noPembayaran}`,
          jumlah: String(amount),
          akunKasBankId: pembayaran.akunKasBankId,
          saldoAkhir: String(saldoSebelum - amount),
          refTipe: "BATAL_PEMBAYARAN",
          refId: pembayaran.id,
          refNo: pembayaran.noPembayaran,
          createdById: currentUser?.id ?? null,
        },
      });
    }

    await writeAuditLog(
      {
        userId: authorizedUser.id,
        action: "REVERSE_CANCEL",
        entity: "PEMBAYARAN",
        entityId: pembayaran.id,
        entityNo: pembayaran.noPembayaran,
        status: "BATAL",
        message: `${pembayaran.noPembayaran} dibatalkan dan kas/piutang direverse`,
      },
      tx
    );
  });

  revalidatePath("/keuangan/invoice");
  revalidatePath(`/keuangan/invoice/${pembayaran.invoiceId}`);
  revalidatePath("/keuangan/pembayaran");
  revalidatePath("/keuangan/piutang");
  revalidatePath("/keuangan/kas-bank");
  actionSuccess(formData, "Pembayaran berhasil dibatalkan dan kas/piutang sudah direverse.", "/keuangan/pembayaran");
};

export const createKasBankManualAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("kas_bank", "create");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membuat transaksi kas bank.", "/keuangan/kas-bank");

  const akunKasBankId = getValue(formData, "akunKasBankId");
  const tanggal = parseDateInput(getValue(formData, "tanggal"));
  const jenis = getValue(formData, "jenis");
  const kategori = getValue(formData, "kategori");
  const jumlah = Number(getValue(formData, "jumlah"));
  const deskripsi = getValue(formData, "deskripsi");

  if (
    !akunKasBankId ||
    !["MASUK", "KELUAR"].includes(jenis) ||
    !kategori ||
    !Number.isFinite(jumlah) ||
    jumlah <= 0
  ) {
    return actionError(formData, "Data kas bank belum lengkap atau jumlah tidak valid.", "/keuangan/kas-bank");
  }

  const existingKasNumbers = await prisma.kasBankTransaksi.findMany({
    select: {
      noTransaksi: true,
    },
  });
  const noKasBank = getNextTransactionNumber(
    existingKasNumbers.map((item) => item.noTransaksi),
    "KB",
    tanggal
  );

  await prisma.$transaction(async (tx) => {
    const akun = await tx.akunKasBank.findUnique({
      where: {
        id: akunKasBankId,
      },
      select: {
        saldoAwal: true,
      },
    });
    const lastKas = await tx.kasBankTransaksi.findFirst({
      where: {
        akunKasBankId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        saldoAkhir: true,
      },
    });
    const saldoSebelum = Number(lastKas?.saldoAkhir ?? akun?.saldoAwal ?? 0);
    const saldoAkhir =
      jenis === "MASUK" ? saldoSebelum + jumlah : saldoSebelum - jumlah;

    const kasBank = await tx.kasBankTransaksi.create({
      data: {
        noTransaksi: noKasBank,
        tanggal,
        jenis: jenis as "MASUK" | "KELUAR",
        kategori,
        deskripsi: deskripsi || null,
        jumlah: String(jumlah),
        akunKasBankId,
        saldoAkhir: String(saldoAkhir),
        refTipe: "MANUAL",
        refNo: noKasBank,
        createdById: currentUser.id,
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "POST",
        entity: "KAS_BANK",
        entityId: kasBank.id,
        entityNo: kasBank.noTransaksi,
        status: jenis,
        message: `Transaksi kas bank manual ${kasBank.noTransaksi}`,
      },
      tx
    );
  });

  revalidatePath("/keuangan/kas-bank");
  actionSuccess(formData, "Transaksi kas bank berhasil disimpan.", "/keuangan/kas-bank");
};

export const cancelInvoiceAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("invoice", "edit");
  if (!currentUser) return actionError(formData, "Anda tidak punya akses membatalkan invoice.", "/keuangan/invoice");

  const id = getValue(formData, "id");
  if (!id) return actionError(formData, "Invoice tidak valid.", "/keuangan/invoice");

  const invoice = await prisma.invoice.findUnique({
    where: {
      id,
    },
    include: {
      pembayaran: {
        select: {
          status: true,
        },
      },
      piutang: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!invoice || invoice.status === "BATAL") {
    return actionWarning(formData, "Invoice ini sudah batal atau tidak ditemukan.", "/keuangan/invoice");
  }

  const hasPayment = invoice.pembayaran.some((item) => item.status === "SELESAI");
  if (hasPayment) return actionWarning(formData, "Invoice tidak bisa dibatalkan karena sudah memiliki pembayaran aktif.", `/keuangan/invoice/${id}`);

  await prisma.$transaction(async (tx) => {
    if (invoice.piutang) {
      await tx.piutang.delete({
        where: {
          invoiceId: invoice.id,
        },
      });
    }

    await tx.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        status: "BATAL",
        terbayar: "0",
        sisaTagihan: "0",
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "CANCEL",
        entity: "INVOICE",
        entityId: invoice.id,
        entityNo: invoice.noInvoice,
        status: "BATAL",
        message: `${invoice.noInvoice} dibatalkan`,
      },
      tx
    );
  });

  revalidatePath("/keuangan/invoice");
  revalidatePath(`/keuangan/invoice/${id}`);
  revalidatePath("/keuangan/piutang");
  actionSuccess(formData, "Invoice berhasil dibatalkan.", `/keuangan/invoice/${id}`);
};

"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionSuccess, actionWarning } from "@/lib/action-feedback";
import { writeAuditLog } from "@/lib/audit";
import { getAuthorizedUser } from "@/lib/auth/permissions";
import { getNextTransactionNumber } from "@/lib/numbering";
import { prisma } from "@/lib/prisma";

const value = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const parseDateInput = (raw: string) => {
  if (!raw) return new Date();
  const parsed = new Date(`${raw}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const normalizeJadwalStatus = (raw: string) => {
  if (raw === "DATANG") return "DATANG";
  if (raw === "BATAL") return "BATAL";
  if (raw === "SELESAI") return "SELESAI";
  return "TERJADWAL";
};

const normalizeReminderStatus = (raw: string) => {
  if (raw === "DIKIRIM") return "DIKIRIM";
  if (raw === "SELESAI") return "SELESAI";
  if (raw === "LEWAT") return "LEWAT";
  return "TERJADWAL";
};

export const createJadwalServisAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("antrian_jadwal", "create");
  if (!currentUser) {
    return actionError(
      formData,
      "Anda tidak punya akses membuat booking servis.",
      "/servis/antrian-jadwal"
    );
  }

  const tanggal = parseDateInput(value(formData, "tanggal"));
  const jam = value(formData, "jam");
  const pelangganId = value(formData, "pelangganId");
  const kendaraanId = value(formData, "kendaraanId");
  const jasaServisId = value(formData, "jasaServisId") || null;
  const mekanikId = value(formData, "mekanikId") || null;
  const keluhan = value(formData, "keluhan") || null;

  if (!pelangganId || !kendaraanId) {
    return actionError(
      formData,
      "Pelanggan dan kendaraan wajib dipilih.",
      "/servis/antrian-jadwal"
    );
  }

  const kendaraan = await prisma.kendaraan.findUnique({
    where: {
      id: kendaraanId,
    },
    select: {
      pelangganId: true,
    },
  });

  if (!kendaraan || kendaraan.pelangganId !== pelangganId) {
    return actionWarning(
      formData,
      "Kendaraan tidak sesuai dengan pelanggan yang dipilih.",
      "/servis/antrian-jadwal"
    );
  }

  const noJadwal = await getNextTransactionNumber(
    (await prisma.jadwalServis.findMany({ select: { noJadwal: true } })).map(
      (item) => item.noJadwal
    ),
    "JDW",
    tanggal
  );

  const jadwal = await prisma.$transaction(async (tx) => {
    const created = await tx.jadwalServis.create({
      data: {
        noJadwal,
        tanggal,
        jam: jam || null,
        pelangganId,
        kendaraanId,
        jasaServisId,
        mekanikId,
        keluhan,
        createdById: currentUser.id,
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "CREATE",
        entity: "JADWAL_SERVIS",
        entityId: created.id,
        entityNo: created.noJadwal,
        status: created.status,
        message: `${created.noJadwal} dibuat dari Antrian & Jadwal.`,
      },
      tx
    );

    return created;
  });

  revalidatePath("/servis/antrian-jadwal");
  actionSuccess(
    formData,
    `Booking servis ${jadwal.noJadwal} berhasil disimpan.`,
    "/servis/antrian-jadwal"
  );
};

export const updateJadwalServisStatusAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("antrian_jadwal", "edit");
  if (!currentUser) {
    return actionError(
      formData,
      "Anda tidak punya akses mengubah status jadwal.",
      "/servis/antrian-jadwal"
    );
  }

  const id = value(formData, "id");
  const status = normalizeJadwalStatus(value(formData, "status"));

  if (!id) {
    return actionError(formData, "Jadwal servis tidak valid.", "/servis/antrian-jadwal");
  }

  const jadwal = await prisma.jadwalServis.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "UPDATE_STATUS",
    entity: "JADWAL_SERVIS",
    entityId: jadwal.id,
    entityNo: jadwal.noJadwal,
    status: jadwal.status,
    message: `${jadwal.noJadwal} diubah ke ${jadwal.status}.`,
  });

  revalidatePath("/servis/antrian-jadwal");
  actionSuccess(
    formData,
    `Status ${jadwal.noJadwal} berhasil diperbarui.`,
    "/servis/antrian-jadwal"
  );
};

export const createReminderServisAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("reminder_servis", "create");
  if (!currentUser) {
    return actionError(
      formData,
      "Anda tidak punya akses membuat reminder servis.",
      "/servis/reminder"
    );
  }

  const pelangganId = value(formData, "pelangganId");
  const kendaraanId = value(formData, "kendaraanId");
  const jenisReminder = value(formData, "jenisReminder");
  const jatuhTempo = parseDateInput(value(formData, "jatuhTempo"));
  const kanal = value(formData, "kanal") || "WhatsApp";
  const status = normalizeReminderStatus(value(formData, "status"));
  const catatan = value(formData, "catatan") || null;

  if (!pelangganId || !kendaraanId || !jenisReminder) {
    return actionError(
      formData,
      "Pelanggan, kendaraan, dan jenis reminder wajib diisi.",
      "/servis/reminder"
    );
  }

  const kendaraan = await prisma.kendaraan.findUnique({
    where: {
      id: kendaraanId,
    },
    select: {
      pelangganId: true,
    },
  });

  if (!kendaraan || kendaraan.pelangganId !== pelangganId) {
    return actionWarning(
      formData,
      "Kendaraan tidak sesuai dengan pelanggan yang dipilih.",
      "/servis/reminder"
    );
  }

  const reminder = await prisma.$transaction(async (tx) => {
    const created = await tx.reminderServis.create({
      data: {
        pelangganId,
        kendaraanId,
        jenisReminder,
        jatuhTempo,
        kanal,
        status,
        catatan,
      },
    });

    await writeAuditLog(
      {
        userId: currentUser.id,
        action: "CREATE",
        entity: "REMINDER_SERVIS",
        entityId: created.id,
        entityNo: jenisReminder,
        status: created.status,
        message: `Reminder ${jenisReminder} berhasil dibuat.`,
      },
      tx
    );

    return created;
  });

  revalidatePath("/servis/reminder");
  revalidatePath(`/master/pelanggan/${pelangganId}`);
  revalidatePath(`/master/kendaraan/${kendaraanId}`);
  actionSuccess(formData, `Reminder ${reminder.jenisReminder} berhasil disimpan.`, "/servis/reminder");
};

export const updateReminderServisAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("reminder_servis", "edit");
  if (!currentUser) {
    return actionError(
      formData,
      "Anda tidak punya akses mengubah reminder servis.",
      "/servis/reminder"
    );
  }

  const id = value(formData, "id");
  const pelangganId = value(formData, "pelangganId");
  const kendaraanId = value(formData, "kendaraanId");
  const jenisReminder = value(formData, "jenisReminder");
  const jatuhTempo = parseDateInput(value(formData, "jatuhTempo"));
  const kanal = value(formData, "kanal") || "WhatsApp";
  const status = normalizeReminderStatus(value(formData, "status"));
  const catatan = value(formData, "catatan") || null;

  if (!id) return actionError(formData, "Reminder tidak valid.", "/servis/reminder");
  if (!pelangganId || !kendaraanId || !jenisReminder) {
    return actionError(
      formData,
      "Pelanggan, kendaraan, dan jenis reminder wajib diisi.",
      "/servis/reminder"
    );
  }

  const kendaraan = await prisma.kendaraan.findUnique({
    where: {
      id: kendaraanId,
    },
    select: {
      pelangganId: true,
    },
  });

  if (!kendaraan || kendaraan.pelangganId !== pelangganId) {
    return actionWarning(
      formData,
      "Kendaraan tidak sesuai dengan pelanggan yang dipilih.",
      "/servis/reminder"
    );
  }

  const reminder = await prisma.reminderServis.update({
    where: {
      id,
    },
    data: {
      pelangganId,
      kendaraanId,
      jenisReminder,
      jatuhTempo,
      kanal,
      status,
      catatan,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    entity: "REMINDER_SERVIS",
    entityId: reminder.id,
    entityNo: reminder.jenisReminder,
    status: reminder.status,
    message: `Reminder ${reminder.jenisReminder} diperbarui.`,
  });

  revalidatePath("/servis/reminder");
  revalidatePath(`/master/pelanggan/${pelangganId}`);
  revalidatePath(`/master/kendaraan/${kendaraanId}`);
  actionSuccess(formData, `Reminder ${reminder.jenisReminder} berhasil diperbarui.`, "/servis/reminder");
};

export const updateReminderServisStatusAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("reminder_servis", "edit");
  if (!currentUser) {
    return actionError(
      formData,
      "Anda tidak punya akses mengubah status reminder.",
      "/servis/reminder"
    );
  }

  const id = value(formData, "id");
  const status = normalizeReminderStatus(value(formData, "status"));

  if (!id) return actionError(formData, "Reminder tidak valid.", "/servis/reminder");

  const reminder = await prisma.reminderServis.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "UPDATE_STATUS",
    entity: "REMINDER_SERVIS",
    entityId: reminder.id,
    entityNo: reminder.jenisReminder,
    status: reminder.status,
    message: `Status reminder ${reminder.jenisReminder} diubah ke ${reminder.status}.`,
  });

  revalidatePath("/servis/reminder");
  actionSuccess(formData, "Status reminder berhasil diperbarui.", "/servis/reminder");
};

export const deleteReminderServisAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("reminder_servis", "delete");
  if (!currentUser) {
    return actionError(
      formData,
      "Anda tidak punya akses menghapus reminder servis.",
      "/servis/reminder"
    );
  }

  const id = value(formData, "id");
  if (!id) return actionError(formData, "Reminder tidak valid.", "/servis/reminder");

  const reminder = await prisma.reminderServis.delete({
    where: {
      id,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    entity: "REMINDER_SERVIS",
    entityId: reminder.id,
    entityNo: reminder.jenisReminder,
    status: reminder.status,
    message: `Reminder ${reminder.jenisReminder} dihapus.`,
  });

  revalidatePath("/servis/reminder");
  actionSuccess(formData, `Reminder ${reminder.jenisReminder} berhasil dihapus.`, "/servis/reminder");
};

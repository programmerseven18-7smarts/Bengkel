"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  actionWarning,
} from "@/lib/action-feedback";
import { writeAuditLog } from "@/lib/audit";
import { hashPassword } from "@/lib/auth/password";
import { getAuthorizedUser } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

const penggunaPath = "/pengaturan/pengguna";

const getValue = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const getStatus = (value: string) =>
  value === "NONAKTIF" ? "NONAKTIF" : "AKTIF";

export const createUserAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("pengguna", "create");
  const nama = getValue(formData, "nama");
  const email = getValue(formData, "email").toLowerCase();
  const noHp = getValue(formData, "noHp") || null;
  const roleId = getValue(formData, "roleId");
  const password = getValue(formData, "password");
  const status = getStatus(getValue(formData, "status"));

  if (!currentUser) {
    return actionError(formData, "Anda tidak punya akses membuat pengguna.", penggunaPath);
  }

  if (!nama || !email || !roleId || !password) {
    return actionError(formData, "Nama, email, role, dan password wajib diisi.", penggunaPath);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return actionWarning(formData, "Email pengguna sudah terdaftar.", penggunaPath);
  }

  const user = await prisma.user.create({
    data: {
      nama,
      email,
      noHp,
      roleId,
      status,
      passwordHash: await hashPassword(password),
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    entity: "USER",
    entityId: user.id,
    entityNo: user.email,
    status: "SUCCESS",
    message: `Pengguna ${user.nama} dibuat.`,
  });

  revalidatePath(penggunaPath);
  actionSuccess(formData, "Pengguna berhasil dibuat.", penggunaPath);
};

export const updateUserAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("pengguna", "edit");
  const id = getValue(formData, "id");
  const nama = getValue(formData, "nama");
  const email = getValue(formData, "email").toLowerCase();
  const noHp = getValue(formData, "noHp") || null;
  const roleId = getValue(formData, "roleId");
  const password = getValue(formData, "password");
  const status = getStatus(getValue(formData, "status"));

  if (!currentUser) {
    return actionError(formData, "Anda tidak punya akses mengubah pengguna.", penggunaPath);
  }

  if (!id || !nama || !email || !roleId) {
    return actionError(formData, "Nama, email, dan role wajib diisi.", penggunaPath);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser && existingUser.id !== id) {
    return actionWarning(formData, "Email sudah digunakan pengguna lain.", penggunaPath);
  }

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      nama,
      email,
      noHp,
      roleId,
      status,
      ...(password ? { passwordHash: await hashPassword(password) } : {}),
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    entity: "USER",
    entityId: user.id,
    entityNo: user.email,
    status: "SUCCESS",
    message: `Pengguna ${user.nama} diperbarui.`,
    metadata: {
      passwordChanged: Boolean(password),
    },
  });

  revalidatePath(penggunaPath);
  actionSuccess(formData, "Pengguna berhasil diperbarui.", penggunaPath);
};

export const deleteUserAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("pengguna", "delete");
  const id = getValue(formData, "id");

  if (!currentUser) {
    return actionError(formData, "Anda tidak punya akses menghapus pengguna.", penggunaPath);
  }

  if (!id) {
    return actionError(formData, "Pengguna tidak valid.", penggunaPath);
  }

  if (currentUser.id === id) {
    return actionWarning(formData, "Akun yang sedang dipakai tidak bisa dihapus.", penggunaPath);
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      nama: true,
      email: true,
      role: {
        select: {
          kode: true,
        },
      },
    },
  });

  if (!user) {
    return actionWarning(formData, "Pengguna tidak ditemukan.", penggunaPath);
  }

  if (user.role?.kode === "SUPER_ADMIN") {
    return actionWarning(formData, "Akun owner/super admin tidak bisa dihapus.", penggunaPath);
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    entity: "USER",
    entityId: id,
    entityNo: user.email,
    status: "SUCCESS",
    message: `Pengguna ${user.nama} dihapus.`,
  });

  revalidatePath(penggunaPath);
  actionSuccess(formData, "Pengguna berhasil dihapus.", penggunaPath);
};

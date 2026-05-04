"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  actionWarning,
} from "@/lib/action-feedback";
import {
  allPermissionCodes,
  defaultRolePermissionCodesByCode,
  type DefaultRoleCode,
} from "@/lib/access-control";
import { writeAuditLog } from "@/lib/audit";
import { getAuthorizedUser } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

const rolePath = "/pengaturan/role";

const normalizeRoleCode = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const getRequiredValue = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export const createRoleAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("role_hak_akses", "create");
  const nama = getRequiredValue(formData, "nama");
  const kode = normalizeRoleCode(getRequiredValue(formData, "kode") || nama);
  const deskripsi = getRequiredValue(formData, "deskripsi") || null;
  const status = getRequiredValue(formData, "status") === "TIDAK_AKTIF"
    ? "TIDAK_AKTIF"
    : "AKTIF";

  if (!currentUser) {
    return actionError(formData, "Anda tidak punya akses membuat role.", rolePath);
  }

  if (!kode || !nama) {
    return actionError(formData, "Nama role dan kode wajib diisi.", rolePath);
  }

  const existingRole = await prisma.role.findUnique({
    where: {
      kode,
    },
    select: {
      id: true,
    },
  });

  if (existingRole) {
    return actionWarning(formData, "Kode role sudah digunakan.", rolePath);
  }

  const role = await prisma.role.create({
    data: {
      kode,
      nama,
      deskripsi,
      status,
      isDefault: false,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    entity: "ROLE",
    entityId: role.id,
    entityNo: role.kode,
    status: "SUCCESS",
    message: `Role ${role.nama} dibuat.`,
  });

  revalidatePath(rolePath);
  actionSuccess(formData, "Role berhasil dibuat.", rolePath);
};

export const updateRoleAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("role_hak_akses", "edit");
  const id = getRequiredValue(formData, "id");
  const submittedKode = normalizeRoleCode(getRequiredValue(formData, "kode"));
  const nama = getRequiredValue(formData, "nama");
  const deskripsi = getRequiredValue(formData, "deskripsi") || null;
  const status = getRequiredValue(formData, "status") === "TIDAK_AKTIF"
    ? "TIDAK_AKTIF"
    : "AKTIF";

  if (!currentUser) {
    return actionError(formData, "Anda tidak punya akses mengubah role.", rolePath);
  }

  if (!id || !nama) {
    return actionError(formData, "Nama role wajib diisi.", rolePath);
  }

  const currentRole = await prisma.role.findUnique({
    where: {
      id,
    },
    select: {
      kode: true,
      isDefault: true,
      nama: true,
    },
  });

  if (!currentRole) {
    return actionWarning(formData, "Role tidak ditemukan.", rolePath);
  }

  const nextKode = currentRole.isDefault
    ? currentRole.kode
    : submittedKode || currentRole.kode;

  if (nextKode !== currentRole.kode) {
    const duplicateRole = await prisma.role.findUnique({
      where: {
        kode: nextKode,
      },
      select: {
        id: true,
      },
    });

    if (duplicateRole && duplicateRole.id !== id) {
      return actionWarning(formData, "Kode role sudah digunakan role lain.", rolePath);
    }
  }

  const role = await prisma.role.update({
    where: {
      id,
    },
    data: {
      kode: nextKode,
      nama,
      deskripsi,
      status,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    entity: "ROLE",
    entityId: role.id,
    entityNo: role.kode,
    status: "SUCCESS",
    message: `Role ${role.nama} diperbarui.`,
  });

  revalidatePath(rolePath);
  actionSuccess(formData, "Role berhasil diperbarui.", rolePath);
};

export const updateRolePermissionsAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("role_hak_akses", "edit");
  const roleId = getRequiredValue(formData, "roleId");

  if (!currentUser) {
    return actionError(formData, "Anda tidak punya akses mengubah hak akses.", rolePath);
  }

  if (!roleId) {
    return actionError(formData, "Role belum dipilih.", rolePath);
  }

  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
    select: {
      kode: true,
      nama: true,
    },
  });

  if (!role) {
    return actionWarning(formData, "Role tidak ditemukan.", rolePath);
  }

  const submittedCodes = formData.getAll("permissionCodes").map(String);
  const permissionCodes =
    role.kode === "SUPER_ADMIN"
      ? defaultRolePermissionCodesByCode[role.kode as DefaultRoleCode] ??
        allPermissionCodes
      : submittedCodes;

  const permissions = await prisma.permission.findMany({
    where: {
      kode: {
        in: permissionCodes,
      },
    },
    select: {
      id: true,
    },
  });

  await prisma.$transaction([
    prisma.rolePermission.deleteMany({
      where: {
        roleId,
      },
    }),
    prisma.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId,
        permissionId: permission.id,
        allowed: true,
      })),
      skipDuplicates: true,
    }),
  ]);

  await writeAuditLog({
    userId: currentUser.id,
    action: "UPDATE_PERMISSION",
    entity: "ROLE",
    entityId: roleId,
    entityNo: role.kode,
    status: "SUCCESS",
    message: `Hak akses role ${role.nama} diperbarui.`,
    metadata: {
      permissionCount: permissions.length,
    },
  });

  revalidatePath(rolePath);
  actionSuccess(formData, "Hak akses berhasil disimpan.", rolePath);
};

export const deleteRoleAction = async (formData: FormData) => {
  const currentUser = await getAuthorizedUser("role_hak_akses", "delete");
  const id = getRequiredValue(formData, "id");

  if (!currentUser) {
    return actionError(formData, "Anda tidak punya akses menghapus role.", rolePath);
  }

  if (!id) {
    return actionError(formData, "Role tidak valid.", rolePath);
  }

  const role = await prisma.role.findUnique({
    where: {
      id,
    },
    select: {
      kode: true,
      nama: true,
      isDefault: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  if (!role) {
    return actionWarning(formData, "Role tidak ditemukan.", rolePath);
  }

  if (role.isDefault) {
    return actionWarning(formData, "Role bawaan sistem tidak bisa dihapus.", rolePath);
  }

  if (role._count.users > 0) {
    return actionWarning(formData, "Role masih digunakan pengguna, jadi belum bisa dihapus.", rolePath);
  }

  await prisma.role.delete({
    where: {
      id,
    },
  });

  await writeAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    entity: "ROLE",
    entityId: id,
    entityNo: role.kode,
    status: "SUCCESS",
    message: `Role ${role.nama} dihapus.`,
  });

  revalidatePath(rolePath);
  actionSuccess(formData, "Role berhasil dihapus.", rolePath);
};

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RoleHakAkses from "@/components/bengkel/pengaturan/RoleHakAkses";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Role & Hak Akses | Auto7",
  description: "Kelola role dan permission bengkel",
};

export default async function RolePage() {
  await requirePageAccess("role_hak_akses");

  const roles = await prisma.role.findMany({
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
    select: {
      id: true,
      kode: true,
      nama: true,
      deskripsi: true,
      isDefault: true,
      status: true,
      _count: {
        select: {
          users: true,
        },
      },
      permissions: {
        where: {
          allowed: true,
        },
        select: {
          permission: {
            select: {
              kode: true,
            },
          },
        },
      },
    },
  });

  const roleRows = roles.map((role) => ({
    id: role.id,
    kode: role.kode,
    nama: role.nama,
    deskripsi: role.deskripsi,
    isDefault: role.isDefault,
    status: role.status,
    userCount: role._count.users,
    permissionCodes: role.permissions.map((item) => item.permission.kode),
  }));

  return (
    <div>
      <PageBreadcrumb pageTitle="Role & Hak Akses" />
      <RoleHakAkses roles={roleRows} />
    </div>
  );
}

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PenggunaList from "@/components/bengkel/pengaturan/PenggunaList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Pengguna | Auto7",
  description: "Kelola pengguna dan role bengkel",
};

export default async function PenggunaPage() {
  await requirePageAccess("pengguna");

  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        nama: true,
        email: true,
        noHp: true,
        status: true,
        terakhirLogin: true,
        roleId: true,
        role: {
          select: {
            kode: true,
            nama: true,
          },
        },
      },
    }),
    prisma.role.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          nama: "asc",
        },
      ],
      select: {
        id: true,
        kode: true,
        nama: true,
      },
    }),
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Pengguna" />
      <PenggunaList
        roles={roles}
        users={users.map((user) => ({
          id: user.id,
          nama: user.nama,
          email: user.email,
          noHp: user.noHp,
          status: user.status,
          terakhirLogin: user.terakhirLogin?.toISOString() ?? null,
          roleId: user.roleId,
          roleKode: user.role?.kode ?? "-",
          roleNama: user.role?.nama ?? "Tanpa Role",
        }))}
      />
    </div>
  );
}

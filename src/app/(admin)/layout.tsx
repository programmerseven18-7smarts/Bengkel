import { redirect } from "next/navigation";
import AdminShell from "@/layout/AdminShell";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
    select: {
      id: true,
      action: true,
      entity: true,
      entityNo: true,
      status: true,
      message: true,
      createdAt: true,
      user: {
        select: {
          nama: true,
        },
      },
    },
  });

  return (
    <AdminShell
      user={user}
      notifications={auditLogs.map((item) => ({
        id: item.id,
        actor: item.user?.nama ?? "Sistem",
        action: item.action,
        entity: item.entity,
        entityNo: item.entityNo ?? "",
        message: item.message ?? "",
        status: item.status ?? "",
        createdAt: item.createdAt.toISOString(),
      }))}
    >
      {children}
    </AdminShell>
  );
}

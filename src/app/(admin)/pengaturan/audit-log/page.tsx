import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AuditLogList from "@/components/bengkel/pengaturan/AuditLogList";
import { requirePageAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Audit Log | Auto7",
  description: "Histori aktivitas penting aplikasi bengkel",
};

export default async function AuditLogPage() {
  await requirePageAccess("audit_log");

  const logs = await prisma.auditLog.findMany({
    take: 200,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          nama: true,
          email: true,
        },
      },
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Audit Log" />
      <AuditLogList
        logs={logs.map((log) => ({
          id: log.id,
          createdAt: log.createdAt.toISOString(),
          userName: log.user?.nama ?? "Sistem",
          userEmail: log.user?.email ?? "-",
          action: log.action,
          entity: log.entity,
          entityNo: log.entityNo ?? "",
          status: log.status ?? "-",
          message: log.message ?? "",
        }))}
      />
    </div>
  );
}

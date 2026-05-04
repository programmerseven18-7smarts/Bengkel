import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditClient = typeof prisma | Prisma.TransactionClient;

interface AuditLogInput {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  entityNo?: string | null;
  status?: string | null;
  message?: string | null;
  metadata?: Prisma.InputJsonValue;
}

export const writeAuditLog = async (
  input: AuditLogInput,
  client: AuditClient = prisma
) => {
  await client.auditLog.create({
    data: {
      userId: input.userId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      entityNo: input.entityNo ?? null,
      status: input.status ?? null,
      message: input.message ?? null,
      metadata: input.metadata ?? undefined,
    },
  });
};

"use client";

import { useMemo, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadCsv } from "@/lib/client-csv";

export type AuditLogRow = {
  id: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  action: string;
  entity: string;
  entityNo: string;
  status: string;
  message: string;
};

type AuditLogListProps = {
  logs: AuditLogRow[];
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const statusColor = (
  status: string
): "success" | "error" | "warning" | "light" => {
  if (status === "SUCCESS") return "success";
  if (status === "ERROR") return "error";
  if (status === "WARNING") return "warning";
  return "light";
};

export default function AuditLogList({ logs }: AuditLogListProps) {
  const [query, setQuery] = useState("");

  const filteredLogs = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return logs;

    return logs.filter((log) =>
      `${log.createdAt} ${log.userName} ${log.userEmail} ${log.action} ${log.entity} ${log.entityNo} ${log.status} ${log.message}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [logs, query]);

  const handleExport = () => {
    const rows = filteredLogs.map((log) => ({
      waktu: formatDateTime(log.createdAt),
      pengguna: log.userName,
      email: log.userEmail,
      action: log.action,
      entity: log.entity,
      nomor: log.entityNo,
      status: log.status,
      pesan: log.message,
    }));

    downloadCsv(
      "audit-log-auto7.csv",
      [
        { key: "waktu", label: "Waktu" },
        { key: "pengguna", label: "Pengguna" },
        { key: "email", label: "Email" },
        { key: "action", label: "Action" },
        { key: "entity", label: "Entity" },
        { key: "nomor", label: "Nomor" },
        { key: "status", label: "Status" },
        { key: "pesan", label: "Pesan" },
      ],
      rows
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Audit Log
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Histori aksi penting dari transaksi, role, dan pengguna.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Cari audit log..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Button size="md" variant="outline" onClick={handleExport}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1040px]">
          <Table>
            <TableHeader className="border-y border-gray-100 bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <TableRow>
                {["No", "Waktu", "Pengguna", "Action", "Entity", "Nomor", "Status", "Pesan"].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredLogs.map((log, index) => (
                <TableRow key={log.id}>
                  <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {log.userName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {log.userEmail}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {log.action}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {log.entity}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {log.entityNo || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge color={statusColor(log.status)} size="sm">
                      {log.status || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {log.message || "-"}
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Belum ada audit log.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

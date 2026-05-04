"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

export type DashboardWorkOrderStatus =
  | "DRAFT"
  | "ANTRI"
  | "DIKERJAKAN"
  | "MENUNGGU_PART"
  | "SELESAI"
  | "BATAL";

export interface DashboardWorkOrderRow {
  id: string;
  noWorkOrder: string;
  pelanggan: string;
  kendaraan: string;
  platNomor: string;
  mekanik: string;
  status: DashboardWorkOrderStatus;
  tanggal: string;
}

interface WorkOrderTableProps {
  workOrders: DashboardWorkOrderRow[];
}

const statusLabel = (status: DashboardWorkOrderStatus) => {
  switch (status) {
    case "ANTRI":
      return "Antri";
    case "DIKERJAKAN":
      return "Dikerjakan";
    case "MENUNGGU_PART":
      return "Menunggu Part";
    case "SELESAI":
      return "Selesai";
    case "BATAL":
      return "Batal";
    default:
      return "Draft";
  }
};

const getStatusColor = (status: DashboardWorkOrderStatus) => {
  switch (status) {
    case "ANTRI":
      return "light";
    case "DIKERJAKAN":
      return "primary";
    case "MENUNGGU_PART":
      return "warning";
    case "SELESAI":
      return "success";
    case "BATAL":
      return "error";
    default:
      return "light";
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function WorkOrderTable({ workOrders }: WorkOrderTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Work Order Terbaru
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/servis/work-order"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Lihat Semua
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              {[
                "No",
                "No. Work Order",
                "Pelanggan",
                "Kendaraan",
                "Mekanik",
                "Status",
                "Tanggal",
              ].map((header) => (
                <TableCell
                  key={header}
                  isHeader
                  className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {workOrders.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="py-3">
                  <Link
                    href={`/servis/work-order/${order.id}`}
                    className="text-theme-sm font-medium text-brand-500 hover:text-brand-600"
                  >
                    {order.noWorkOrder}
                  </Link>
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  {order.pelanggan}
                </TableCell>
                <TableCell className="py-3">
                  <div>
                    <p className="text-theme-sm text-gray-800 dark:text-white/90">
                      {order.kendaraan}
                    </p>
                    <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                      {order.platNomor}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {order.mekanik}
                </TableCell>
                <TableCell className="py-3">
                  <Badge size="sm" color={getStatusColor(order.status)}>
                    {statusLabel(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {formatDate(order.tanggal)}
                </TableCell>
              </TableRow>
            ))}
            {workOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-theme-sm text-gray-500 dark:text-gray-400"
                >
                  Belum ada work order.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

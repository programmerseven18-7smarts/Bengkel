"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";

interface WorkOrder {
  id: string;
  noWorkOrder: string;
  pelanggan: string;
  kendaraan: string;
  platNomor: string;
  mekanik: string;
  status: "Antri" | "Dikerjakan" | "Menunggu Part" | "Selesai" | "Batal";
  tanggal: string;
}

const workOrders: WorkOrder[] = [
  {
    id: "1",
    noWorkOrder: "WO-2024-001",
    pelanggan: "Budi Santoso",
    kendaraan: "Honda Beat",
    platNomor: "B 1234 ABC",
    mekanik: "Rudi",
    status: "Dikerjakan",
    tanggal: "30 Apr 2024",
  },
  {
    id: "2",
    noWorkOrder: "WO-2024-002",
    pelanggan: "Andi Wijaya",
    kendaraan: "Toyota Avanza",
    platNomor: "D 7788 KA",
    mekanik: "Dimas",
    status: "Antri",
    tanggal: "30 Apr 2024",
  },
  {
    id: "3",
    noWorkOrder: "WO-2024-003",
    pelanggan: "Siti Rahma",
    kendaraan: "Yamaha NMAX",
    platNomor: "F 9921 ZZ",
    mekanik: "Ahmad",
    status: "Menunggu Part",
    tanggal: "29 Apr 2024",
  },
  {
    id: "4",
    noWorkOrder: "WO-2024-004",
    pelanggan: "Joko Prasetyo",
    kendaraan: "Honda Vario",
    platNomor: "B 5678 DEF",
    mekanik: "Rudi",
    status: "Selesai",
    tanggal: "29 Apr 2024",
  },
  {
    id: "5",
    noWorkOrder: "WO-2024-005",
    pelanggan: "Dewi Lestari",
    kendaraan: "Suzuki Ertiga",
    platNomor: "B 9012 GHI",
    mekanik: "Dimas",
    status: "Batal",
    tanggal: "28 Apr 2024",
  },
];

const getStatusColor = (status: WorkOrder["status"]) => {
  switch (status) {
    case "Antri":
      return "light";
    case "Dikerjakan":
      return "primary";
    case "Menunggu Part":
      return "warning";
    case "Selesai":
      return "success";
    case "Batal":
      return "error";
    default:
      return "light";
  }
};

export default function WorkOrderTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
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
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                No. Work Order
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Pelanggan
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Kendaraan
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Mekanik
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tanggal
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {workOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="py-3">
                  <Link
                    href={`/servis/work-order/${order.id}`}
                    className="font-medium text-brand-500 hover:text-brand-600 text-theme-sm"
                  >
                    {order.noWorkOrder}
                  </Link>
                </TableCell>
                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                  {order.pelanggan}
                </TableCell>
                <TableCell className="py-3">
                  <div>
                    <p className="text-gray-800 text-theme-sm dark:text-white/90">
                      {order.kendaraan}
                    </p>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {order.platNomor}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.mekanik}
                </TableCell>
                <TableCell className="py-3">
                  <Badge size="sm" color={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.tanggal}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

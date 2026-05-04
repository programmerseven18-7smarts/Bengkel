"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import { deleteWorkOrderAction } from "@/lib/work-orders/actions";

type WorkOrderStatus =
  | "DRAFT"
  | "ANTRI"
  | "DIKERJAKAN"
  | "MENUNGGU_PART"
  | "SELESAI"
  | "BATAL";

export interface WorkOrderRow {
  id: string;
  noWorkOrder: string;
  pelanggan: string;
  noHp: string;
  kendaraan: string;
  platNomor: string;
  keluhan: string;
  mekanikId: string;
  mekanik: string;
  status: WorkOrderStatus;
  tanggal: string;
  estimasi: number;
}

export interface WorkOrderOption {
  value: string;
  label: string;
}

interface WorkOrderListProps {
  workOrders: WorkOrderRow[];
  mekanikOptions: WorkOrderOption[];
}

const statusLabel = (status: WorkOrderStatus) => {
  switch (status) {
    case "DRAFT":
      return "Draft";
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
  }
};

const getStatusColor = (status: WorkOrderStatus) => {
  switch (status) {
    case "DRAFT":
      return "light";
    case "ANTRI":
      return "info";
    case "DIKERJAKAN":
      return "primary";
    case "MENUNGGU_PART":
      return "warning";
    case "SELESAI":
      return "success";
    case "BATAL":
      return "error";
  }
};

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "ANTRI", label: "Antri" },
  { value: "DIKERJAKAN", label: "Dikerjakan" },
  { value: "MENUNGGU_PART", label: "Menunggu Part" },
  { value: "SELESAI", label: "Selesai" },
  { value: "BATAL", label: "Batal" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function WorkOrderList({
  workOrders,
  mekanikOptions,
}: WorkOrderListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMekanik, setSelectedMekanik] = useState("");
  const [deleteItem, setDeleteItem] = useState<WorkOrderRow | null>(null);

  const filteredWorkOrders = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return workOrders.filter((order) => {
      const text = `${order.noWorkOrder} ${order.pelanggan} ${order.noHp} ${order.kendaraan} ${order.platNomor} ${order.keluhan} ${order.mekanik}`.toLowerCase();
      const matchKeyword = !keyword || text.includes(keyword);
      const matchStatus = !selectedStatus || order.status === selectedStatus;
      const matchMekanik = !selectedMekanik || order.mekanikId === selectedMekanik;
      return matchKeyword && matchStatus && matchMekanik;
    });
  }, [query, selectedMekanik, selectedStatus, workOrders]);

  const filterMekanikOptions = useMemo(
    () => [{ value: "", label: "Semua Mekanik" }, ...mekanikOptions],
    [mekanikOptions]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari work order..."
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Link href="/servis/work-order/create">
            <Button size="md" variant="primary" className="w-full sm:w-auto">
              Buat Work Order
            </Button>
          </Link>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 sm:w-40 sm:flex-none">
            <Select
              options={statusOptions}
              placeholder="Status"
              onChange={setSelectedStatus}
              defaultValue={selectedStatus}
            />
          </div>
          <div className="flex-1 sm:w-48 sm:flex-none">
            <Select
              options={filterMekanikOptions}
              placeholder="Mekanik"
              onChange={setSelectedMekanik}
              defaultValue={selectedMekanik}
            />
          </div>
        </div>
      </div>

      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {filteredWorkOrders.map((order) => (
            <div key={order.id} className="p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/servis/work-order/${order.id}`}
                    className="font-medium text-brand-500 hover:text-brand-600"
                  >
                    {order.noWorkOrder}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(order.tanggal)}
                  </p>
                </div>
                <Badge size="sm" color={getStatusColor(order.status)}>
                  {statusLabel(order.status)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <MobileItem label="Pelanggan" value={order.pelanggan} />
                <MobileItem label="No. HP" value={order.noHp || "-"} />
                <MobileItem label="Kendaraan" value={order.kendaraan} />
                <MobileItem label="Plat Nomor" value={order.platNomor} />
                <MobileItem label="Mekanik" value={order.mekanik || "-"} />
                <MobileItem label="Estimasi" value={formatCurrency(order.estimasi)} strong />
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Keluhan</span>
                  <p className="mt-1 text-gray-800 dark:text-white/90">{order.keluhan || "-"}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                <Link href={`/servis/work-order/${order.id}`}>
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400"
                  >
                    <PencilIcon className="size-5" />
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteItem(order)}
                  className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400"
                >
                  <TrashBinIcon className="size-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "No",
                  "No. Work Order",
                  "Pelanggan",
                  "Kendaraan",
                  "Keluhan",
                  "Mekanik",
                  "Status",
                  "Estimasi",
                  "Aksi",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredWorkOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href={`/servis/work-order/${order.id}`}
                      className="font-medium text-brand-500 hover:text-brand-600 text-theme-sm"
                    >
                      {order.noWorkOrder}
                    </Link>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {formatDate(order.tanggal)}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {order.pelanggan}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {order.noHp || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="text-gray-800 text-theme-sm dark:text-white/90">
                      {order.kendaraan}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {order.platNomor}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.keluhan || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {order.mekanik || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={getStatusColor(order.status)}>
                      {statusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {formatCurrency(order.estimasi)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <Link href={`/servis/work-order/${order.id}`}>
                        <button
                          type="button"
                          className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                        >
                          <PencilIcon className="size-5" />
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteItem(order)}
                        className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                      >
                        <TrashBinIcon className="size-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {filteredWorkOrders.length} dari {workOrders.length} data
        </p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.noWorkOrder}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deleteWorkOrderAction}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}

function MobileItem({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`${strong ? "font-medium" : ""} text-gray-800 dark:text-white/90`}>
        {value}
      </span>
    </div>
  );
}

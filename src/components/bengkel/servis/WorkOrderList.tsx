"use client";
import { useState } from "react";
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
import Link from "next/link";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";

interface WorkOrder {
  id: string;
  noWorkOrder: string;
  pelanggan: string;
  noHp: string;
  kendaraan: string;
  platNomor: string;
  keluhan: string;
  mekanik: string;
  status: "Antri" | "Dikerjakan" | "Menunggu Part" | "Selesai" | "Batal";
  tanggal: string;
  estimasi: string;
}

const workOrders: WorkOrder[] = [
  {
    id: "1",
    noWorkOrder: "WO-2024-001",
    pelanggan: "Budi Santoso",
    noHp: "081234567890",
    kendaraan: "Honda Beat",
    platNomor: "B 1234 ABC",
    keluhan: "Mesin brebet saat dingin",
    mekanik: "Rudi",
    status: "Dikerjakan",
    tanggal: "30 Apr 2024",
    estimasi: "Rp 350.000",
  },
  {
    id: "2",
    noWorkOrder: "WO-2024-002",
    pelanggan: "Andi Wijaya",
    noHp: "082345678901",
    kendaraan: "Toyota Avanza",
    platNomor: "D 7788 KA",
    keluhan: "Servis berkala 20.000 km",
    mekanik: "Dimas",
    status: "Antri",
    tanggal: "30 Apr 2024",
    estimasi: "Rp 1.200.000",
  },
  {
    id: "3",
    noWorkOrder: "WO-2024-003",
    pelanggan: "Siti Rahma",
    noHp: "083456789012",
    kendaraan: "Yamaha NMAX",
    platNomor: "F 9921 ZZ",
    keluhan: "Ganti kampas rem depan",
    mekanik: "Ahmad",
    status: "Menunggu Part",
    tanggal: "29 Apr 2024",
    estimasi: "Rp 250.000",
  },
  {
    id: "4",
    noWorkOrder: "WO-2024-004",
    pelanggan: "Joko Prasetyo",
    noHp: "084567890123",
    kendaraan: "Honda Vario",
    platNomor: "B 5678 DEF",
    keluhan: "Tune up mesin",
    mekanik: "Rudi",
    status: "Selesai",
    tanggal: "29 Apr 2024",
    estimasi: "Rp 450.000",
  },
  {
    id: "5",
    noWorkOrder: "WO-2024-005",
    pelanggan: "Dewi Lestari",
    noHp: "085678901234",
    kendaraan: "Suzuki Ertiga",
    platNomor: "B 9012 GHI",
    keluhan: "Cek kelistrikan",
    mekanik: "Dimas",
    status: "Batal",
    tanggal: "28 Apr 2024",
    estimasi: "Rp 150.000",
  },
  {
    id: "6",
    noWorkOrder: "WO-2024-006",
    pelanggan: "Agus Hermawan",
    noHp: "086789012345",
    kendaraan: "Honda CBR 150",
    platNomor: "B 3344 JKL",
    keluhan: "Ganti oli dan filter",
    mekanik: "Ahmad",
    status: "Selesai",
    tanggal: "28 Apr 2024",
    estimasi: "Rp 180.000",
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

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "Antri", label: "Antri" },
  { value: "Dikerjakan", label: "Dikerjakan" },
  { value: "Menunggu Part", label: "Menunggu Part" },
  { value: "Selesai", label: "Selesai" },
  { value: "Batal", label: "Batal" },
];

const mekanikOptions = [
  { value: "", label: "Semua Mekanik" },
  { value: "Rudi", label: "Rudi" },
  { value: "Dimas", label: "Dimas" },
  { value: "Ahmad", label: "Ahmad" },
];

export default function WorkOrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMekanik, setSelectedMekanik] = useState("");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari work order..."
              className="w-full"
            />
          </div>
          <Link href="/servis/work-order/create">
            <Button
              size="md"
              variant="primary"
              startIcon={<PlusIcon className="size-5" />}
              className="w-full sm:w-auto"
            >
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
          <div className="flex-1 sm:w-40 sm:flex-none">
            <Select
              options={mekanikOptions}
              placeholder="Mekanik"
              onChange={setSelectedMekanik}
              defaultValue={selectedMekanik}
            />
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {workOrders.map((order) => (
            <div key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link
                    href={`/servis/work-order/${order.id}`}
                    className="font-medium text-brand-500 hover:text-brand-600"
                  >
                    {order.noWorkOrder}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.tanggal}
                  </p>
                </div>
                <Badge size="sm" color={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Pelanggan</span>
                  <span className="text-gray-800 dark:text-white/90">{order.pelanggan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">No. HP</span>
                  <span className="text-gray-800 dark:text-white/90">{order.noHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Kendaraan</span>
                  <span className="text-gray-800 dark:text-white/90">{order.kendaraan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Plat Nomor</span>
                  <span className="text-gray-800 dark:text-white/90">{order.platNomor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Mekanik</span>
                  <span className="text-gray-800 dark:text-white/90">{order.mekanik}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Estimasi</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">{order.estimasi}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Keluhan</span>
                  <p className="text-gray-800 dark:text-white/90 mt-1">{order.keluhan}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.05]">
                <Link href={`/servis/work-order/${order.id}`}>
                  <button className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
                    <PencilIcon className="size-5" />
                  </button>
                </Link>
                <button className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400">
                  <TrashBinIcon className="size-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  No. Work Order
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Pelanggan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Kendaraan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Keluhan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Mekanik
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Estimasi
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {workOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href={`/servis/work-order/${order.id}`}
                      className="font-medium text-brand-500 hover:text-brand-600 text-theme-sm"
                    >
                      {order.noWorkOrder}
                    </Link>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {order.tanggal}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {order.pelanggan}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {order.noHp}
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
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-[200px] truncate">
                    {order.keluhan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {order.mekanik}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {order.estimasi}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <Link href={`/servis/work-order/${order.id}`}>
                        <button className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                          <PencilIcon className="size-5" />
                        </button>
                      </Link>
                      <button className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400">
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

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan 1-6 dari 6 data
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

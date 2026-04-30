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
import { Modal } from "@/components/ui/modal";
import { PlusIcon, CalenderIcon } from "@/icons";

type StatusAntrian = "Booking" | "Check-in" | "Menunggu" | "Dikerjakan" | "Menunggu Sparepart" | "Selesai" | "Batal";

interface AntrianItem {
  id: string;
  noAntrian: string;
  waktuBooking: string;
  tanggal: string;
  pelanggan: string;
  kendaraan: string;
  platNomor: string;
  jenisServis: string;
  mekanik: string | null;
  estimasiDurasi: string;
  status: StatusAntrian;
}

const antrianData: AntrianItem[] = [
  {
    id: "1",
    noAntrian: "A001",
    waktuBooking: "08:00",
    tanggal: "2024-01-15",
    pelanggan: "Budi Santoso",
    kendaraan: "Honda Beat",
    platNomor: "B 1234 ABC",
    jenisServis: "Ganti Oli",
    mekanik: "Rudi",
    estimasiDurasi: "30 menit",
    status: "Dikerjakan",
  },
  {
    id: "2",
    noAntrian: "A002",
    waktuBooking: "08:30",
    tanggal: "2024-01-15",
    pelanggan: "Andi Wijaya",
    kendaraan: "Toyota Avanza",
    platNomor: "D 7788 KA",
    jenisServis: "Tune Up",
    mekanik: "Dimas",
    estimasiDurasi: "2 jam",
    status: "Dikerjakan",
  },
  {
    id: "3",
    noAntrian: "A003",
    waktuBooking: "09:00",
    tanggal: "2024-01-15",
    pelanggan: "Siti Rahma",
    kendaraan: "Yamaha NMAX",
    platNomor: "F 9921 ZZ",
    jenisServis: "Servis Rem",
    mekanik: "Ahmad",
    estimasiDurasi: "1 jam",
    status: "Menunggu Sparepart",
  },
  {
    id: "4",
    noAntrian: "A004",
    waktuBooking: "09:30",
    tanggal: "2024-01-15",
    pelanggan: "Raka Pratama",
    kendaraan: "Honda Brio",
    platNomor: "B 8812 KJ",
    jenisServis: "Ganti Aki",
    mekanik: null,
    estimasiDurasi: "45 menit",
    status: "Check-in",
  },
  {
    id: "5",
    noAntrian: "A005",
    waktuBooking: "10:00",
    tanggal: "2024-01-15",
    pelanggan: "Maya Putri",
    kendaraan: "Suzuki GSX",
    platNomor: "B 3344 YZA",
    jenisServis: "Cek Kelistrikan",
    mekanik: null,
    estimasiDurasi: "1 jam",
    status: "Menunggu",
  },
  {
    id: "6",
    noAntrian: "A006",
    waktuBooking: "10:30",
    tanggal: "2024-01-15",
    pelanggan: "Doni Saputra",
    kendaraan: "Honda PCX",
    platNomor: "B 5566 MNO",
    jenisServis: "Ganti Oli",
    mekanik: null,
    estimasiDurasi: "30 menit",
    status: "Booking",
  },
  {
    id: "7",
    noAntrian: "A007",
    waktuBooking: "14:00",
    tanggal: "2024-01-15",
    pelanggan: "Eko Prasetyo",
    kendaraan: "Toyota Innova",
    platNomor: "B 7788 PQR",
    jenisServis: "Tune Up",
    mekanik: "Fajar",
    estimasiDurasi: "2 jam",
    status: "Selesai",
  },
];

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "Booking", label: "Booking" },
  { value: "Check-in", label: "Check-in" },
  { value: "Menunggu", label: "Menunggu" },
  { value: "Dikerjakan", label: "Dikerjakan" },
  { value: "Menunggu Sparepart", label: "Menunggu Sparepart" },
  { value: "Selesai", label: "Selesai" },
  { value: "Batal", label: "Batal" },
];

const mekanikOptions = [
  { value: "", label: "Semua Mekanik" },
  { value: "Rudi", label: "Rudi" },
  { value: "Dimas", label: "Dimas" },
  { value: "Ahmad", label: "Ahmad" },
  { value: "Fajar", label: "Fajar" },
];

const pelangganOptions = [
  { value: "", label: "Pilih Pelanggan" },
  { value: "1", label: "Budi Santoso - 081234567890" },
  { value: "2", label: "Andi Wijaya - 082345678901" },
  { value: "3", label: "Siti Rahma - 083456789012" },
  { value: "4", label: "Raka Pratama - 084567890123" },
];

const kendaraanOptions = [
  { value: "", label: "Pilih Kendaraan" },
  { value: "1", label: "Honda Beat - B 1234 ABC" },
  { value: "2", label: "Toyota Avanza - D 7788 KA" },
  { value: "3", label: "Yamaha NMAX - F 9921 ZZ" },
  { value: "4", label: "Honda Brio - B 8812 KJ" },
];

const jasaServisOptions = [
  { value: "", label: "Pilih Jenis Servis" },
  { value: "Ganti Oli", label: "Ganti Oli" },
  { value: "Tune Up", label: "Tune Up" },
  { value: "Servis Rem", label: "Servis Rem" },
  { value: "Ganti Aki", label: "Ganti Aki" },
  { value: "Cek Kelistrikan", label: "Cek Kelistrikan" },
];

const mekanikFormOptions = [
  { value: "", label: "Pilih Mekanik (Opsional)" },
  { value: "Rudi", label: "Rudi" },
  { value: "Dimas", label: "Dimas" },
  { value: "Ahmad", label: "Ahmad" },
  { value: "Fajar", label: "Fajar" },
];

const getStatusColor = (status: StatusAntrian) => {
  switch (status) {
    case "Booking":
      return "info";
    case "Check-in":
      return "primary";
    case "Menunggu":
      return "light";
    case "Dikerjakan":
      return "primary";
    case "Menunggu Sparepart":
      return "warning";
    case "Selesai":
      return "success";
    case "Batal":
      return "error";
    default:
      return "light";
  }
};

export default function AntrianJadwalServis() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMekanik, setSelectedMekanik] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "jadwal">("table");

  // Count statistics
  const bookingHariIni = antrianData.filter(
    (item) => item.status === "Booking"
  ).length;
  const menunggu = antrianData.filter(
    (item) => item.status === "Menunggu" || item.status === "Check-in"
  ).length;
  const sedangDikerjakan = antrianData.filter(
    (item) => item.status === "Dikerjakan" || item.status === "Menunggu Sparepart"
  ).length;
  const selesaiHariIni = antrianData.filter(
    (item) => item.status === "Selesai"
  ).length;

  // Group by time for jadwal view
  const jadwalPagi = antrianData.filter((item) => {
    const hour = parseInt(item.waktuBooking.split(":")[0]);
    return hour >= 8 && hour < 12;
  });
  const jadwalSiang = antrianData.filter((item) => {
    const hour = parseInt(item.waktuBooking.split(":")[0]);
    return hour >= 12 && hour < 15;
  });
  const jadwalSore = antrianData.filter((item) => {
    const hour = parseInt(item.waktuBooking.split(":")[0]);
    return hour >= 15 && hour < 18;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Booking Hari Ini
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-1">
                {bookingHariIni}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <CalenderIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Menunggu
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-1">
                {menunggu}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sedang Dikerjakan
              </p>
              <p className="text-2xl font-bold text-brand-500 mt-1">
                {sedangDikerjakan}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
              <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selesai Hari Ini
              </p>
              <p className="text-2xl font-bold text-success-500 mt-1">
                {selesaiHariIni}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50 dark:bg-success-500/10">
              <svg className="h-6 w-6 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Header with Filters */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-white/[0.05]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-40">
                <Input type="date" defaultValue="2024-01-15" />
              </div>
              <div className="w-full sm:w-44">
                <Select
                  options={statusOptions}
                  placeholder="Status"
                  onChange={setSelectedStatus}
                  defaultValue={selectedStatus}
                />
              </div>
              <div className="w-full sm:w-40">
                <Select
                  options={mekanikOptions}
                  placeholder="Mekanik"
                  onChange={setSelectedMekanik}
                  defaultValue={selectedMekanik}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 text-sm font-medium ${
                    viewMode === "table"
                      ? "bg-brand-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  Tabel
                </button>
                <button
                  onClick={() => setViewMode("jadwal")}
                  className={`px-4 py-2 text-sm font-medium ${
                    viewMode === "jadwal"
                      ? "bg-brand-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  Jadwal
                </button>
              </div>
              <Button
                size="md"
                variant="primary"
                startIcon={<PlusIcon className="size-5" />}
                onClick={() => setIsModalOpen(true)}
              >
                Tambah Booking
              </Button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1100px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      No. Antrian
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Waktu
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Pelanggan
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Kendaraan
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Jenis Servis
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Mekanik
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Estimasi
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Status
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Aksi
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {antrianData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="text-lg font-bold text-gray-800 dark:text-white/90">
                          {item.noAntrian}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {item.waktuBooking}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.pelanggan}
                        </p>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <p className="text-gray-800 text-theme-sm dark:text-white/90">
                          {item.kendaraan}
                        </p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {item.platNomor}
                        </p>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {item.jenisServis}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {item.mekanik || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {item.estimasiDurasi}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge size="sm" color={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-2">
                          {item.status === "Booking" && (
                            <Button size="sm" variant="outline">
                              Check-in
                            </Button>
                          )}
                          {item.status === "Check-in" && (
                            <Button size="sm" variant="outline">
                              Mulai
                            </Button>
                          )}
                          {item.status === "Menunggu" && (
                            <Button size="sm" variant="primary">
                              Mulai Servis
                            </Button>
                          )}
                          {(item.status === "Dikerjakan" || item.status === "Menunggu Sparepart") && (
                            <Button size="sm" variant="success">
                              Selesai
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Jadwal View */}
        {viewMode === "jadwal" && (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pagi */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                    Pagi (08:00 - 12:00)
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    {jadwalPagi.length} jadwal
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  {jadwalPagi.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                          {item.waktuBooking} - {item.noAntrian}
                        </span>
                        <Badge size="sm" color={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {item.pelanggan}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.kendaraan} - {item.platNomor}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.jenisServis} {item.mekanik && `| ${item.mekanik}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Siang */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-amber-700 dark:text-amber-400">
                    Siang (12:00 - 15:00)
                  </h3>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    {jadwalSiang.length} jadwal
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  {jadwalSiang.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Tidak ada jadwal
                    </p>
                  ) : (
                    jadwalSiang.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                            {item.waktuBooking} - {item.noAntrian}
                          </span>
                          <Badge size="sm" color={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-white/90">
                          {item.pelanggan}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.kendaraan} - {item.platNomor}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.jenisServis} {item.mekanik && `| ${item.mekanik}`}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sore */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-orange-700 dark:text-orange-400">
                    Sore (15:00 - 18:00)
                  </h3>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    {jadwalSore.length} jadwal
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  {jadwalSore.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Tidak ada jadwal
                    </p>
                  ) : (
                    jadwalSore.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                            {item.waktuBooking} - {item.noAntrian}
                          </span>
                          <Badge size="sm" color={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-white/90">
                          {item.pelanggan}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.kendaraan} - {item.platNomor}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.jenisServis} {item.mekanik && `| ${item.mekanik}`}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Tambah Booking */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-xl p-6 lg:p-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Tambah Booking Servis
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pelanggan
            </label>
            <Select
              options={pelangganOptions}
              placeholder="Pilih Pelanggan"
              onChange={() => {}}
              defaultValue=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kendaraan
            </label>
            <Select
              options={kendaraanOptions}
              placeholder="Pilih Kendaraan"
              onChange={() => {}}
              defaultValue=""
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Servis
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jam Servis
              </label>
              <Input type="time" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jenis Servis Awal
            </label>
            <Select
              options={jasaServisOptions}
              placeholder="Pilih Jenis Servis"
              onChange={() => {}}
              defaultValue=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keluhan Awal
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-white/90 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              rows={3}
              placeholder="Deskripsikan keluhan kendaraan..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mekanik
              </label>
              <Select
                options={mekanikFormOptions}
                placeholder="Pilih Mekanik"
                onChange={() => {}}
                defaultValue=""
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimasi Durasi
              </label>
              <Input type="text" placeholder="Contoh: 1 jam" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catatan Admin
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-white/90 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              rows={2}
              placeholder="Catatan tambahan..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Simpan Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

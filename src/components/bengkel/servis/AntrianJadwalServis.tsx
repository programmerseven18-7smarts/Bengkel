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
import { Modal } from "@/components/ui/modal";
import { CalenderIcon } from "@/icons";
import {
  createJadwalServisAction,
  updateJadwalServisStatusAction,
} from "@/lib/servis/actions";

type JadwalStatus = "TERJADWAL" | "DATANG" | "BATAL" | "SELESAI";

export interface JadwalServisRow {
  id: string;
  noJadwal: string;
  tanggal: string;
  jam: string;
  pelanggan: string;
  pelangganId: string;
  kendaraan: string;
  kendaraanId: string;
  platNomor: string;
  jasaServis: string;
  jasaServisId: string;
  mekanik: string;
  mekanikId: string;
  estimasiDurasi: string;
  keluhan: string;
  status: JadwalStatus;
}

interface Option {
  value: string;
  label: string;
}

interface AntrianJadwalServisProps {
  jadwal: JadwalServisRow[];
  pelangganOptions: Option[];
  kendaraanOptions: Option[];
  jasaOptions: Option[];
  mekanikOptions: Option[];
}

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "TERJADWAL", label: "Booking" },
  { value: "DATANG", label: "Check-in" },
  { value: "SELESAI", label: "Selesai" },
  { value: "BATAL", label: "Batal" },
];

const statusLabel = (status: JadwalStatus) => {
  switch (status) {
    case "DATANG":
      return "Check-in";
    case "SELESAI":
      return "Selesai";
    case "BATAL":
      return "Batal";
    default:
      return "Booking";
  }
};

const getStatusColor = (status: JadwalStatus) => {
  switch (status) {
    case "TERJADWAL":
      return "info";
    case "DATANG":
      return "primary";
    case "SELESAI":
      return "success";
    case "BATAL":
      return "error";
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const selectClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

const todayInputValue = () => new Date().toISOString().slice(0, 10);

export default function AntrianJadwalServis({
  jadwal,
  pelangganOptions,
  kendaraanOptions,
  jasaOptions,
  mekanikOptions,
}: AntrianJadwalServisProps) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMekanik, setSelectedMekanik] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "jadwal">("table");

  const mekanikFilterOptions = useMemo(
    () => [{ value: "", label: "Semua Mekanik" }, ...mekanikOptions],
    [mekanikOptions]
  );

  const filteredItems = useMemo(
    () =>
      jadwal.filter((item) => {
        const matchStatus = !selectedStatus || item.status === selectedStatus;
        const matchMekanik = !selectedMekanik || item.mekanikId === selectedMekanik;
        const matchDate = !selectedDate || item.tanggal.slice(0, 10) === selectedDate;
        return matchStatus && matchMekanik && matchDate;
      }),
    [jadwal, selectedDate, selectedMekanik, selectedStatus]
  );

  const bookingHariIni = jadwal.filter(
    (item) => item.status === "TERJADWAL" && item.tanggal.slice(0, 10) === todayInputValue()
  ).length;
  const checkIn = jadwal.filter((item) => item.status === "DATANG").length;
  const selesai = jadwal.filter((item) => item.status === "SELESAI").length;
  const batal = jadwal.filter((item) => item.status === "BATAL").length;

  const jadwalPagi = filteredItems.filter((item) => {
    const hour = Number((item.jam || "0").split(":")[0]);
    return hour >= 8 && hour < 12;
  });
  const jadwalSiang = filteredItems.filter((item) => {
    const hour = Number((item.jam || "0").split(":")[0]);
    return hour >= 12 && hour < 15;
  });
  const jadwalSore = filteredItems.filter((item) => {
    const hour = Number((item.jam || "0").split(":")[0]);
    return hour >= 15;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Booking Hari Ini" value={bookingHariIni} icon="calendar" />
        <SummaryCard label="Check-in" value={checkIn} tone="primary" />
        <SummaryCard label="Selesai" value={selesai} tone="success" />
        <SummaryCard label="Batal" value={batal} tone="error" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 p-4 dark:border-white/[0.05] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-40">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </div>
              <div className="w-full sm:w-44">
                <Select
                  options={statusOptions}
                  placeholder="Semua Status"
                  onChange={setSelectedStatus}
                  defaultValue={selectedStatus}
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  options={mekanikFilterOptions}
                  placeholder="Semua Mekanik"
                  onChange={setSelectedMekanik}
                  defaultValue={selectedMekanik}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
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
                  type="button"
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
              <Button size="md" variant="primary" onClick={() => setIsModalOpen(true)}>
                Tambah Booking
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "table" && (
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1100px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    {[
                      "No",
                      "No. Jadwal",
                      "Tanggal",
                      "Pelanggan",
                      "Kendaraan",
                      "Jenis Servis",
                      "Mekanik",
                      "Estimasi",
                      "Status",
                      "Aksi",
                    ].map((header) => (
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
                  {filteredItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-bold text-gray-800 dark:text-white/90">
                          {item.noJadwal}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                        {formatDate(item.tanggal)}
                        <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                          {item.jam || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <p className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                          {item.pelanggan}
                        </p>
                        <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                          {item.keluhan || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <p className="text-theme-sm text-gray-800 dark:text-white/90">
                          {item.kendaraan}
                        </p>
                        <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                          {item.platNomor}
                        </p>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                        {item.jasaServis || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                        {item.mekanik || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                        {item.estimasiDurasi || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge size="sm" color={getStatusColor(item.status)}>
                          {statusLabel(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <JadwalActions item={item} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredItems.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada jadwal servis sesuai filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {viewMode === "jadwal" && (
          <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-3">
            <ScheduleColumn title="Pagi (08:00 - 12:00)" items={jadwalPagi} color="blue" />
            <ScheduleColumn title="Siang (12:00 - 15:00)" items={jadwalSiang} color="amber" />
            <ScheduleColumn title="Sore (15:00+)" items={jadwalSore} color="orange" />
          </div>
        )}
      </div>

      <BookingModal
        isOpen={isModalOpen}
        pelangganOptions={pelangganOptions}
        kendaraanOptions={kendaraanOptions}
        jasaOptions={jasaOptions}
        mekanikOptions={mekanikOptions}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
  icon,
}: {
  label: string;
  value: number;
  tone?: "default" | "primary" | "success" | "error";
  icon?: "calendar";
}) {
  const toneClass =
    tone === "primary"
      ? "text-brand-500"
      : tone === "success"
      ? "text-success-500"
      : tone === "error"
      ? "text-error-500"
      : "text-gray-800 dark:text-white/90";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
        </div>
        {icon === "calendar" && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
            <CalenderIcon className="h-6 w-6 text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}

function JadwalActions({ item }: { item: JadwalServisRow }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {item.status === "TERJADWAL" && (
        <>
          <StatusButton id={item.id} status="DATANG" label="Check-in" />
          <StatusButton id={item.id} status="BATAL" label="Batal" variant="danger" />
        </>
      )}
      {item.status === "DATANG" && (
        <>
          <Link
            href="/servis/work-order/create"
            className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-medium text-white hover:bg-brand-600"
          >
            Buat WO
          </Link>
          <StatusButton id={item.id} status="SELESAI" label="Selesai" variant="success" />
          <StatusButton id={item.id} status="BATAL" label="Batal" variant="danger" />
        </>
      )}
      {(item.status === "SELESAI" || item.status === "BATAL") && (
        <span className="text-theme-xs text-gray-500 dark:text-gray-400">Tidak ada aksi</span>
      )}
    </div>
  );
}

function StatusButton({
  id,
  status,
  label,
  variant = "default",
}: {
  id: string;
  status: JadwalStatus;
  label: string;
  variant?: "default" | "success" | "danger";
}) {
  const className =
    variant === "success"
      ? "bg-success-500 text-white hover:bg-success-600"
      : variant === "danger"
      ? "border border-error-200 text-error-600 hover:bg-error-50 dark:border-error-500/30 dark:hover:bg-error-500/10"
      : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]";

  return (
    <form action={updateJadwalServisStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={`rounded-lg px-3 py-2 text-xs font-medium ${className}`}>
        {label}
      </button>
    </form>
  );
}

function ScheduleColumn({
  title,
  items,
  color,
}: {
  title: string;
  items: JadwalServisRow[];
  color: "blue" | "amber" | "orange";
}) {
  const headerClass =
    color === "blue"
      ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
      : color === "amber"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
      : "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className={`border-b border-gray-200 p-4 dark:border-gray-700 ${headerClass}`}>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{items.length} jadwal</p>
      </div>
      <div className="space-y-3 p-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                {item.jam || "-"} - {item.noJadwal}
              </span>
              <Badge size="sm" color={getStatusColor(item.status)}>
                {statusLabel(item.status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-800 dark:text-white/90">{item.pelanggan}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item.kendaraan} - {item.platNomor}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {item.jasaServis || "Servis umum"} {item.mekanik && `| ${item.mekanik}`}
            </p>
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Tidak ada jadwal
          </p>
        )}
      </div>
    </div>
  );
}

function BookingModal({
  isOpen,
  pelangganOptions,
  kendaraanOptions,
  jasaOptions,
  mekanikOptions,
  onClose,
}: {
  isOpen: boolean;
  pelangganOptions: Option[];
  kendaraanOptions: Option[];
  jasaOptions: Option[];
  mekanikOptions: Option[];
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="mx-4 w-full max-w-3xl max-h-[90vh] overflow-hidden p-0"
    >
      <form action={createJadwalServisAction} onSubmit={onClose} className="flex max-h-[90vh] flex-col">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Tambah Booking Servis
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Booking akan tersimpan di tabel jadwal servis.
          </p>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField name="pelangganId" label="Pelanggan" options={pelangganOptions} />
            <SelectField name="kendaraanId" label="Kendaraan" options={kendaraanOptions} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tanggal Servis
              </label>
              <Input name="tanggal" type="date" defaultValue={todayInputValue()} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Jam Servis
              </label>
              <Input name="jam" type="time" defaultValue="08:00" />
            </div>
            <SelectField name="jasaServisId" label="Jenis Servis Awal" options={jasaOptions} optional />
            <SelectField name="mekanikId" label="Mekanik" options={mekanikOptions} optional />
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Keluhan Awal
              </label>
              <textarea
                name="keluhan"
                rows={3}
                placeholder="Deskripsikan keluhan kendaraan..."
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit">
            Simpan Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function SelectField({
  name,
  label,
  options,
  optional,
}: {
  name: string;
  label: string;
  options: Option[];
  optional?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>
      <select name={name} defaultValue="" className={selectClass}>
        <option value="" disabled={!optional}>
          {optional ? `Tanpa ${label.toLowerCase()}` : `Pilih ${label.toLowerCase()}`}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

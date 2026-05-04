"use client";

import { useMemo, useState } from "react";
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
import { Modal } from "@/components/ui/modal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import {
  createReminderServisAction,
  deleteReminderServisAction,
  updateReminderServisAction,
  updateReminderServisStatusAction,
} from "@/lib/servis/actions";

type ReminderStatus = "TERJADWAL" | "DIKIRIM" | "SELESAI" | "LEWAT";

export interface ReminderServisRow {
  id: string;
  pelangganId: string;
  pelanggan: string;
  noHp: string;
  kendaraanId: string;
  kendaraan: string;
  platNomor: string;
  jenisReminder: string;
  jatuhTempo: string;
  kanal: string;
  status: ReminderStatus;
  catatan: string;
}

interface Option {
  value: string;
  label: string;
}

interface ReminderServisListProps {
  reminders: ReminderServisRow[];
  pelangganOptions: Option[];
  kendaraanOptions: Option[];
}

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "TERJADWAL", label: "Terjadwal" },
  { value: "DIKIRIM", label: "Dikirim" },
  { value: "SELESAI", label: "Selesai" },
  { value: "LEWAT", label: "Lewat" },
];

const formStatusOptions = statusOptions.filter((item) => item.value);

const kanalOptions = ["WhatsApp", "Telepon", "SMS", "Email"];

const statusLabel = (status: ReminderStatus) => {
  switch (status) {
    case "DIKIRIM":
      return "Dikirim";
    case "SELESAI":
      return "Selesai";
    case "LEWAT":
      return "Lewat";
    default:
      return "Terjadwal";
  }
};

const getStatusColor = (status: ReminderStatus) => {
  switch (status) {
    case "TERJADWAL":
      return "info";
    case "DIKIRIM":
      return "warning";
    case "SELESAI":
      return "success";
    case "LEWAT":
      return "error";
  }
};

const nextStatus: Record<ReminderStatus, ReminderStatus> = {
  TERJADWAL: "DIKIRIM",
  DIKIRIM: "SELESAI",
  SELESAI: "TERJADWAL",
  LEWAT: "DIKIRIM",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const selectClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

export default function ReminderServisList({
  reminders,
  pelangganOptions,
  kendaraanOptions,
}: ReminderServisListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [formItem, setFormItem] = useState<ReminderServisRow | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ReminderServisRow | null>(null);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return reminders.filter((item) => {
      const searchable = `${item.pelanggan} ${item.noHp} ${item.kendaraan} ${item.platNomor} ${item.jenisReminder}`.toLowerCase();
      const matchKeyword = !keyword || searchable.includes(keyword);
      const matchStatus = !selectedStatus || item.status === selectedStatus;
      return matchKeyword && matchStatus;
    });
  }, [query, reminders, selectedStatus]);

  const terjadwal = reminders.filter((item) => item.status === "TERJADWAL").length;
  const dikirim = reminders.filter((item) => item.status === "DIKIRIM").length;
  const lewat = reminders.filter((item) => item.status === "LEWAT").length;

  const openCreate = () => {
    setFormItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: ReminderServisRow) => {
    setFormItem(item);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Terjadwal" value={terjadwal} />
        <SummaryCard label="Sudah Dikirim" value={dikirim} tone="warning" />
        <SummaryCard label="Lewat Jadwal" value={lewat} tone="error" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-64">
              <Input
                type="text"
                placeholder="Cari pelanggan..."
                className="w-full"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
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
          </div>
          <Button size="md" variant="primary" onClick={openCreate}>
            Tambah Reminder
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[980px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    "No",
                    "Pelanggan",
                    "Kendaraan",
                    "Reminder",
                    "Jatuh Tempo",
                    "Kanal",
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
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <p className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                        {item.pelanggan}
                      </p>
                      <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                        {item.noHp || "-"}
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
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                      {item.jenisReminder}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.jatuhTempo)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color="light">
                        {item.kanal}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={getStatusColor(item.status)}>
                        {statusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <form action={updateReminderServisStatusAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="status" value={nextStatus[item.status]} />
                          <button
                            type="submit"
                            className="rounded-lg px-2 py-1 text-xs font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"
                            title="Ubah status reminder"
                          >
                            {statusLabel(nextStatus[item.status])}
                          </button>
                        </form>
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400"
                          title="Edit reminder"
                        >
                          <PencilIcon className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteItem(item)}
                          className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400"
                          title="Hapus reminder"
                        >
                          <TrashBinIcon className="size-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Belum ada reminder servis sesuai filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-white/[0.05] sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {filteredItems.length} dari {reminders.length} data
          </p>
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </div>
      </div>

      <ReminderFormModal
        isOpen={isFormOpen}
        item={formItem}
        pelangganOptions={pelangganOptions}
        kendaraanOptions={kendaraanOptions}
        onClose={() => {
          setIsFormOpen(false);
          setFormItem(null);
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.jenisReminder}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deleteReminderServisAction}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "warning" | "error";
}) {
  const toneClass =
    tone === "warning"
      ? "text-warning-500"
      : tone === "error"
      ? "text-error-500"
      : "text-gray-800 dark:text-white/90";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function ReminderFormModal({
  isOpen,
  item,
  pelangganOptions,
  kendaraanOptions,
  onClose,
}: {
  isOpen: boolean;
  item: ReminderServisRow | null;
  pelangganOptions: Option[];
  kendaraanOptions: Option[];
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="mx-4 w-full max-w-3xl max-h-[90vh] overflow-hidden p-0"
    >
      <form
        action={item ? updateReminderServisAction : createReminderServisAction}
        onSubmit={onClose}
        className="flex max-h-[90vh] flex-col"
      >
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {item ? "Edit Reminder Servis" : "Tambah Reminder Servis"}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Reminder akan dipakai untuk follow up servis pelanggan.
          </p>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              name="pelangganId"
              label="Pelanggan"
              defaultValue={item?.pelangganId ?? ""}
              options={pelangganOptions}
            />
            <SelectField
              name="kendaraanId"
              label="Kendaraan"
              defaultValue={item?.kendaraanId ?? ""}
              options={kendaraanOptions}
            />
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Jenis Reminder
              </label>
              <Input
                name="jenisReminder"
                placeholder="Contoh: Ganti oli berikutnya"
                defaultValue={item?.jenisReminder ?? ""}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Jatuh Tempo
              </label>
              <Input
                name="jatuhTempo"
                type="date"
                defaultValue={item?.jatuhTempo.slice(0, 10) ?? new Date().toISOString().slice(0, 10)}
              />
            </div>
            <SelectField
              name="kanal"
              label="Kanal"
              defaultValue={item?.kanal ?? "WhatsApp"}
              options={kanalOptions.map((kanal) => ({ value: kanal, label: kanal }))}
            />
            <SelectField
              name="status"
              label="Status"
              defaultValue={item?.status ?? "TERJADWAL"}
              options={formStatusOptions}
            />
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Catatan
              </label>
              <textarea
                name="catatan"
                rows={3}
                defaultValue={item?.catatan ?? ""}
                placeholder="Catatan follow up..."
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
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: Option[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>
      <select name={name} defaultValue={defaultValue} className={selectClass}>
        <option value="" disabled>
          Pilih {label.toLowerCase()}
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

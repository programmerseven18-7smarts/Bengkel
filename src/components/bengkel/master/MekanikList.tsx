"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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
import Pagination from "@/components/tables/Pagination";
import { PencilIcon, TrashBinIcon } from "@/icons";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import MasterRecordModal, {
  type MasterRecordData,
  type MasterRecordField,
} from "./MasterRecordModal";
import {
  createMekanikAction,
  deleteMekanikAction,
  updateMekanikAction,
} from "@/lib/masters/actions";

type MekanikStatus = "AKTIF" | "TIDAK_AKTIF" | "CUTI";

export interface MekanikRow {
  id: string;
  kode: string;
  nama: string;
  noHp: string;
  spesialisasi: string;
  tanggalBergabung: string;
  totalServis: number;
  rating: number;
  status: MekanikStatus;
}

interface MekanikListProps {
  mekanik: MekanikRow[];
  nextCode: string;
}

const StarIcon = () => (
  <svg className="size-4 fill-current text-warning-500" viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

const statusLabel = (status: MekanikStatus) => {
  if (status === "CUTI") return "Cuti";
  return status === "AKTIF" ? "Aktif" : "Tidak Aktif";
};

const statusColor = (status: MekanikStatus) => {
  if (status === "CUTI") return "warning";
  return status === "AKTIF" ? "success" : "light";
};

const formatDate = (date: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function MekanikList({ mekanik, nextCode }: MekanikListProps) {
  const items = mekanik;
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MekanikRow | null>(null);
  const [deleteItem, setDeleteItem] = useState<MekanikRow | null>(null);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((item) =>
      `${item.kode} ${item.nama} ${item.noHp} ${item.spesialisasi}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [items, query]);

  const fields: MasterRecordField[] = [
    {
      name: "kode",
      label: "Kode Mekanik",
      placeholder: selectedItem?.kode ?? nextCode,
      readOnly: true,
    },
    { name: "nama", label: "Nama Mekanik", placeholder: "Nama mekanik" },
    { name: "noHp", label: "No. HP", placeholder: "081234567890" },
    { name: "spesialisasi", label: "Spesialisasi", placeholder: "Motor Honda / Kelistrikan" },
    { name: "tanggalBergabung", label: "Tanggal Bergabung", type: "date" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "AKTIF", label: "Aktif" },
        { value: "TIDAK_AKTIF", label: "Tidak Aktif" },
        { value: "CUTI", label: "Cuti" },
      ],
    },
  ];

  const initialValues = selectedItem
    ? ({ ...selectedItem } satisfies MasterRecordData)
    : ({ kode: nextCode, status: "AKTIF" } satisfies MasterRecordData);

  const openEdit = (item: MekanikRow) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Cari mekanik..."
            className="w-full"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
        >
          Tambah Mekanik
        </Button>
      </div>

      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4">
              <div className="mb-3 flex items-start gap-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                  <Image width={48} height={48} src="/images/user/user-17.jpg" alt={item.nama} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90">{item.nama}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.kode}</p>
                    </div>
                    <Badge size="sm" color={statusColor(item.status)}>
                      {statusLabel(item.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">No. HP</span>
                  <span className="text-gray-800 dark:text-white/90">{item.noHp || "-"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Spesialisasi</span>
                  <span className="text-gray-800 dark:text-white/90">{item.spesialisasi || "-"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Bergabung</span>
                  <span className="text-gray-800 dark:text-white/90">{formatDate(item.tanggalBergabung)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Total Servis</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">{item.totalServis}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Rating</span>
                  <span className="inline-flex items-center gap-1">
                    <StarIcon />
                    <span className="font-medium text-gray-800 dark:text-white/90">{item.rating}</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                <button type="button" onClick={() => openEdit(item)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
                  <PencilIcon className="size-5" />
                </button>
                <button type="button" onClick={() => setDeleteItem(item)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400">
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
                  "Mekanik",
                  "No. HP",
                  "Spesialisasi",
                  "Bergabung",
                  "Total Servis",
                  "Rating",
                  "Status",
                  "Aksi",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${
                      ["Total Servis", "Rating"].includes(header)
                        ? "text-center"
                        : "text-start"
                    }`}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{index + 1}</TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <Image width={40} height={40} src="/images/user/user-17.jpg" alt={item.nama} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.nama}</p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">{item.kode}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">{item.noHp || "-"}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.spesialisasi || "-"}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatDate(item.tanggalBergabung)}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm font-medium dark:text-white/90">{item.totalServis}</TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1">
                      <StarIcon />
                      <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">{item.rating}</span>
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={statusColor(item.status)}>
                      {statusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openEdit(item)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                        <PencilIcon className="size-5" />
                      </button>
                      <button type="button" onClick={() => setDeleteItem(item)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400">
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
          Menampilkan {filteredItems.length} dari {items.length} data
        </p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>

      <MasterRecordModal
        isOpen={isFormOpen}
        title={selectedItem ? "Edit Mekanik" : "Tambah Mekanik"}
        description="Data mekanik dipakai pada work order dan jadwal servis."
        fields={fields}
        initialValues={initialValues}
        hiddenFields={selectedItem ? { id: selectedItem.id } : undefined}
        formAction={selectedItem ? updateMekanikAction : createMekanikAction}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.nama}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deleteMekanikAction}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}

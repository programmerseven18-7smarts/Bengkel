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
import Pagination from "@/components/tables/Pagination";
import { PencilIcon, TrashBinIcon, EyeIcon } from "@/icons";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import MasterRecordModal, {
  type MasterRecordData,
  type MasterRecordField,
} from "./MasterRecordModal";
import {
  createPelangganAction,
  deletePelangganAction,
  updatePelangganAction,
} from "@/lib/masters/actions";

type StatusData = "AKTIF" | "TIDAK_AKTIF";

export interface PelangganRow {
  id: string;
  kode: string;
  nama: string;
  noHp: string;
  email: string;
  alamat: string;
  totalKendaraan: number;
  totalServis: number;
  status: StatusData;
}

interface PelangganListProps {
  pelanggan: PelangganRow[];
  nextCode: string;
}

const statusLabel = (status: StatusData) =>
  status === "AKTIF" ? "Aktif" : "Tidak Aktif";

export default function PelangganList({
  pelanggan,
  nextCode,
}: PelangganListProps) {
  const items = pelanggan;
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PelangganRow | null>(null);
  const [deleteItem, setDeleteItem] = useState<PelangganRow | null>(null);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((item) =>
      `${item.kode} ${item.nama} ${item.noHp} ${item.email} ${item.alamat}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [items, query]);

  const fields: MasterRecordField[] = [
    {
      name: "kode",
      label: "Kode Pelanggan",
      placeholder: selectedItem?.kode ?? nextCode,
      readOnly: true,
    },
    { name: "nama", label: "Nama Pelanggan", placeholder: "Nama pelanggan" },
    { name: "noHp", label: "No. HP", placeholder: "081234567890" },
    { name: "email", label: "Email", type: "email", placeholder: "pelanggan@email.com" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "AKTIF", label: "Aktif" },
        { value: "TIDAK_AKTIF", label: "Tidak Aktif" },
      ],
    },
    { name: "alamat", label: "Alamat", placeholder: "Alamat pelanggan", colSpan: "full" },
  ];

  const initialValues = selectedItem
    ? ({ ...selectedItem } satisfies MasterRecordData)
    : ({ kode: nextCode, status: "AKTIF" } satisfies MasterRecordData);

  const openEdit = (item: PelangganRow) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Cari pelanggan..."
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
          Tambah Pelanggan
        </Button>
      </div>

      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {item.nama}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.kode}
                  </p>
                </div>
                <Badge size="sm" color={item.status === "AKTIF" ? "success" : "light"}>
                  {statusLabel(item.status)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">No. HP</span>
                  <span className="text-gray-800 dark:text-white/90">{item.noHp || "-"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Email</span>
                  <span className="text-gray-800 dark:text-white/90">{item.email || "-"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Kendaraan</span>
                  <span className="text-gray-800 dark:text-white/90">{item.totalKendaraan}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Total Servis</span>
                  <span className="text-gray-800 dark:text-white/90">{item.totalServis}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Alamat</span>
                  <p className="mt-1 text-gray-800 dark:text-white/90">{item.alamat || "-"}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                <Link href={`/master/pelanggan/${item.id}`} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
                  <EyeIcon className="size-5" />
                </Link>
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
                  "Kode",
                  "Nama",
                  "No. HP",
                  "Alamat",
                  "Kendaraan",
                  "Total Servis",
                  "Status",
                  "Aksi",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${
                      ["Kendaraan", "Total Servis"].includes(header)
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
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {item.kode}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {item.nama}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {item.email || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {item.noHp || "-"}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.alamat || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm dark:text-white/90">
                    {item.totalKendaraan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm dark:text-white/90">
                    {item.totalServis}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={item.status === "AKTIF" ? "success" : "light"}>
                      {statusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <Link href={`/master/pelanggan/${item.id}`} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                        <EyeIcon className="size-5" />
                      </Link>
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
        title={selectedItem ? "Edit Pelanggan" : "Tambah Pelanggan"}
        description="Data pelanggan dipakai pada kendaraan, work order, invoice, dan reminder servis."
        fields={fields}
        initialValues={initialValues}
        hiddenFields={selectedItem ? { id: selectedItem.id } : undefined}
        formAction={selectedItem ? updatePelangganAction : createPelangganAction}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.nama}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deletePelangganAction}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}

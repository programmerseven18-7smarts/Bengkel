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
import Pagination from "@/components/tables/Pagination";
import { PencilIcon, TrashBinIcon } from "@/icons";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import MasterRecordModal, {
  type MasterRecordData,
  type MasterRecordField,
} from "./MasterRecordModal";
import {
  createSupplierAction,
  deleteSupplierAction,
  updateSupplierAction,
} from "@/lib/masters/actions";

type StatusData = "AKTIF" | "TIDAK_AKTIF";

export interface SupplierRow {
  id: string;
  kode: string;
  nama: string;
  noHp: string;
  email: string;
  alamat: string;
  produk: string;
  totalTransaksi: number;
  status: StatusData;
}

interface SupplierListProps {
  suppliers: SupplierRow[];
  nextCode: string;
}

const statusLabel = (status: StatusData) =>
  status === "AKTIF" ? "Aktif" : "Tidak Aktif";

export default function SupplierList({ suppliers, nextCode }: SupplierListProps) {
  const items = suppliers;
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SupplierRow | null>(null);
  const [deleteItem, setDeleteItem] = useState<SupplierRow | null>(null);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((item) =>
      `${item.kode} ${item.nama} ${item.noHp} ${item.email} ${item.produk}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [items, query]);

  const fields: MasterRecordField[] = [
    {
      name: "kode",
      label: "Kode Supplier",
      placeholder: selectedItem?.kode ?? nextCode,
      readOnly: true,
    },
    { name: "nama", label: "Nama Supplier", placeholder: "Nama supplier" },
    { name: "noHp", label: "No. HP / Telepon", placeholder: "081234567890" },
    { name: "email", label: "Email", type: "email", placeholder: "supplier@email.com" },
    { name: "produk", label: "Produk Utama", placeholder: "Oli & sparepart" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "AKTIF", label: "Aktif" },
        { value: "TIDAK_AKTIF", label: "Tidak Aktif" },
      ],
    },
    { name: "alamat", label: "Alamat", placeholder: "Alamat supplier", colSpan: "full" },
  ];

  const initialValues = selectedItem
    ? ({
        ...selectedItem,
      } satisfies MasterRecordData)
    : ({ kode: nextCode, status: "AKTIF" } satisfies MasterRecordData);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Cari supplier..."
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
          Tambah Supplier
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "No",
                  "Kode",
                  "Nama Supplier",
                  "Kontak",
                  "Produk",
                  "Total Transaksi",
                  "Status",
                  "Aksi",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${
                      header === "Total Transaksi" ? "text-center" : "text-start"
                    }`}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredItems.map((supplier, index) => (
                <TableRow key={supplier.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {supplier.kode}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {supplier.nama}
                    </p>
                    <p className="max-w-[220px] truncate text-gray-500 text-theme-xs dark:text-gray-400">
                      {supplier.alamat || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="text-gray-800 text-theme-sm dark:text-white/90">
                      {supplier.noHp || "-"}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {supplier.email || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {supplier.produk || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm font-medium dark:text-white/90">
                    {supplier.totalTransaksi}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge
                      size="sm"
                      color={supplier.status === "AKTIF" ? "success" : "light"}
                    >
                      {statusLabel(supplier.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItem(supplier);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                        aria-label={`Edit ${supplier.nama}`}
                      >
                        <PencilIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteItem(supplier)}
                        className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                        aria-label={`Hapus ${supplier.nama}`}
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
          Menampilkan {filteredItems.length} dari {items.length} data
        </p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>

      <MasterRecordModal
        isOpen={isFormOpen}
        title={selectedItem ? "Edit Supplier" : "Tambah Supplier"}
        description="Data supplier dipakai pada purchase order, penerimaan, dan retur pembelian."
        fields={fields}
        initialValues={initialValues}
        hiddenFields={selectedItem ? { id: selectedItem.id } : undefined}
        formAction={selectedItem ? updateSupplierAction : createSupplierAction}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.nama}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deleteSupplierAction}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}

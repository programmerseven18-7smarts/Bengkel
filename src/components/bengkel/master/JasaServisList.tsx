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
import { PencilIcon, TrashBinIcon } from "@/icons";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import MasterRecordModal, {
  type MasterRecordData,
  type MasterRecordField,
} from "./MasterRecordModal";
import {
  createJasaServisAction,
  deleteJasaServisAction,
  updateJasaServisAction,
} from "@/lib/masters/actions";

type StatusData = "AKTIF" | "TIDAK_AKTIF";

export interface JasaServisRow {
  id: string;
  kode: string;
  nama: string;
  kategoriId: string;
  kategori: string;
  harga: number;
  estimasiMenit: number;
  deskripsi: string;
  status: StatusData;
}

export interface MasterOption {
  value: string;
  label: string;
}

interface JasaServisListProps {
  jasaServis: JasaServisRow[];
  kategoriOptions: MasterOption[];
  nextCode: string;
}

const statusLabel = (status: StatusData) =>
  status === "AKTIF" ? "Aktif" : "Tidak Aktif";

export default function JasaServisList({
  jasaServis,
  kategoriOptions,
  nextCode,
}: JasaServisListProps) {
  const items = jasaServis;
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<JasaServisRow | null>(null);
  const [deleteItem, setDeleteItem] = useState<JasaServisRow | null>(null);

  const filterOptions = useMemo(
    () => [{ value: "", label: "Semua Kategori" }, ...kategoriOptions],
    [kategoriOptions]
  );

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchKeyword =
        !keyword ||
        `${item.kode} ${item.nama} ${item.kategori} ${item.deskripsi}`
          .toLowerCase()
          .includes(keyword);
      const matchKategori = !selectedKategori || item.kategoriId === selectedKategori;
      return matchKeyword && matchKategori;
    });
  }, [items, query, selectedKategori]);

  const fields: MasterRecordField[] = [
    {
      name: "kode",
      label: "Kode Jasa",
      placeholder: selectedItem?.kode ?? nextCode,
      readOnly: true,
    },
    { name: "nama", label: "Nama Jasa", placeholder: "Nama jasa servis" },
    {
      name: "kategoriId",
      label: "Kategori",
      type: "select",
      options: kategoriOptions,
    },
    { name: "harga", label: "Harga", type: "number", placeholder: "0" },
    { name: "estimasiMenit", label: "Estimasi Menit", type: "number", placeholder: "30" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "AKTIF", label: "Aktif" },
        { value: "TIDAK_AKTIF", label: "Tidak Aktif" },
      ],
    },
    { name: "deskripsi", label: "Deskripsi", placeholder: "Deskripsi jasa", colSpan: "full" },
  ];

  const initialValues = selectedItem
    ? ({ ...selectedItem } satisfies MasterRecordData)
    : ({ kode: nextCode, status: "AKTIF" } satisfies MasterRecordData);

  const openEdit = (item: JasaServisRow) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari jasa servis..."
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={filterOptions}
              placeholder="Kategori"
              onChange={setSelectedKategori}
              defaultValue={selectedKategori}
            />
          </div>
        </div>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
        >
          Tambah Jasa
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
                  "Nama Jasa",
                  "Kategori",
                  "Harga",
                  "Est. Waktu",
                  "Status",
                  "Aksi",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${
                      header === "Harga" ? "text-end" : "text-start"
                    }`}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredItems.map((jasa, index) => (
                <TableRow key={jasa.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {jasa.kode}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {jasa.nama}
                    </p>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {jasa.deskripsi || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge size="sm" color="light">
                      {jasa.kategori || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">
                    Rp {jasa.harga.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {jasa.estimasiMenit ? `${jasa.estimasiMenit} menit` : "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={jasa.status === "AKTIF" ? "success" : "light"}>
                      {statusLabel(jasa.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openEdit(jasa)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                        <PencilIcon className="size-5" />
                      </button>
                      <button type="button" onClick={() => setDeleteItem(jasa)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400">
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
        title={selectedItem ? "Edit Jasa Servis" : "Tambah Jasa Servis"}
        description="Data jasa ini akan dipakai pada work order dan paket servis."
        fields={fields}
        initialValues={initialValues}
        hiddenFields={selectedItem ? { id: selectedItem.id } : undefined}
        formAction={selectedItem ? updateJasaServisAction : createJasaServisAction}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.nama}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deleteJasaServisAction}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}

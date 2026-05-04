"use client";

import { useMemo, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";
import { Modal } from "@/components/ui/modal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";

type MasterOptionFormAction = (formData: FormData) => void | Promise<void>;
type MasterOptionStatus = "AKTIF" | "TIDAK_AKTIF";

export interface MasterOptionItem {
  id: string;
  kode: string;
  nama: string;
  kategori?: string;
  deskripsi?: string;
  status: MasterOptionStatus;
}

interface MasterOptionListProps {
  title: string;
  description: string;
  addLabel: string;
  searchPlaceholder: string;
  initialData: MasterOptionItem[];
  categoryLabel?: string;
  categoryOptions?: string[];
  codePlaceholder?: string;
  nextCode?: string;
  namePlaceholder?: string;
  descriptionPlaceholder?: string;
  createAction: MasterOptionFormAction;
  updateAction: MasterOptionFormAction;
  deleteAction: MasterOptionFormAction;
}

const statusOptions = [
  { value: "AKTIF", label: "Aktif" },
  { value: "TIDAK_AKTIF", label: "Tidak Aktif" },
];

const statusLabel = (status: MasterOptionStatus) =>
  status === "AKTIF" ? "Aktif" : "Tidak Aktif";

export default function MasterOptionList({
  title,
  description,
  addLabel,
  searchPlaceholder,
  initialData,
  categoryLabel,
  categoryOptions = [],
  codePlaceholder = "Kode",
  nextCode,
  namePlaceholder = "Nama",
  descriptionPlaceholder = "Catatan",
  createAction,
  updateAction,
  deleteAction,
}: MasterOptionListProps) {
  const items = initialData;
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterOptionItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MasterOptionItem | null>(null);
  const [formCategory, setFormCategory] = useState("");
  const [formStatus, setFormStatus] = useState<MasterOptionStatus>("AKTIF");

  const filterOptions = [
    { value: "", label: `Semua ${categoryLabel || "Kategori"}` },
    ...categoryOptions.map((item) => ({ value: item, label: item })),
  ];

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const text = `${item.kode} ${item.nama} ${item.kategori || ""} ${item.deskripsi || ""}`.toLowerCase();
      const matchQuery = !keyword || text.includes(keyword);
      const matchCategory = !selectedCategory || item.kategori === selectedCategory;
      return matchQuery && matchCategory;
    });
  }, [items, query, selectedCategory]);

  const openCreate = () => {
    setSelectedItem(null);
    setFormCategory("");
    setFormStatus("AKTIF");
    setIsFormOpen(true);
  };

  const openEdit = (item: MasterOptionItem) => {
    setSelectedItem(item);
    setFormCategory(item.kategori || "");
    setFormStatus(item.status);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
    setFormCategory("");
    setFormStatus("AKTIF");
  };

  const codeValue = selectedItem?.kode ?? nextCode ?? codePlaceholder;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-4 dark:border-white/[0.05] sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        <Button size="md" variant="primary" className="w-full lg:w-auto" onClick={openCreate}>
          {addLabel}
        </Button>
      </div>

      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-white/[0.05] sm:flex-row sm:items-center sm:p-6">
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {categoryLabel && (
          <div className="w-full sm:w-56">
            <Select
              options={filterOptions}
              placeholder={categoryLabel}
              defaultValue={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        )}
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[860px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  No
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Kode
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Nama
                </TableCell>
                {categoryLabel && (
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                    {categoryLabel}
                  </TableCell>
                )}
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Catatan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {item.kode}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {item.nama}
                  </TableCell>
                  {categoryLabel && (
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color="light">
                        {item.kategori || "-"}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="max-w-[280px] truncate px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {item.deskripsi || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={item.status === "AKTIF" ? "success" : "light"}>
                      {statusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                      >
                        <PencilIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteItem(item)}
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
          Menampilkan {filteredItems.length} dari {items.length} data
        </p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>

      <Modal
        key={`${selectedItem?.id || "new"}-${codeValue}`}
        isOpen={isFormOpen}
        onClose={closeForm}
        showCloseButton={false}
        className="mx-4 w-full max-w-2xl max-h-[90vh] overflow-hidden p-0"
      >
        <form
          action={selectedItem ? updateAction : createAction}
          onSubmit={closeForm}
          className="flex max-h-[90vh] flex-col"
        >
          {selectedItem && <input type="hidden" name="id" value={selectedItem.id} />}
          {categoryLabel && <input type="hidden" name="kategori" value={formCategory} />}
          <input type="hidden" name="status" value={formStatus} />

          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {selectedItem ? `Edit ${title}` : addLabel}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Form master ini dipakai sebagai sumber pilihan dropdown.
            </p>
          </div>

          <div className="overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Kode
                </label>
                <Input
                  name="kode"
                  placeholder={codePlaceholder}
                  defaultValue={codeValue}
                  readOnly
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Nama
                </label>
                <Input name="nama" placeholder={namePlaceholder} defaultValue={selectedItem?.nama} />
              </div>
              {categoryLabel && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {categoryLabel}
                  </label>
                  <Select
                    options={categoryOptions.map((item) => ({ value: item, label: item }))}
                    placeholder={`Pilih ${categoryLabel.toLowerCase()}`}
                    defaultValue={formCategory}
                    onChange={setFormCategory}
                  />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Status
                </label>
                <Select
                  options={statusOptions}
                  placeholder="Pilih status"
                  defaultValue={formStatus}
                  onChange={(value) => setFormStatus(value as MasterOptionStatus)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Catatan
                </label>
                <Input
                  name="deskripsi"
                  placeholder={descriptionPlaceholder}
                  defaultValue={selectedItem?.deskripsi}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <Button variant="outline" onClick={closeForm}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.nama}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deleteAction}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}

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
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";
import { PencilIcon, TrashBinIcon, EyeIcon } from "@/icons";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import MasterRecordModal, {
  type MasterRecordData,
  type MasterRecordField,
} from "./MasterRecordModal";
import {
  createKendaraanAction,
  deleteKendaraanAction,
  updateKendaraanAction,
} from "@/lib/masters/actions";

export interface MasterOption {
  value: string;
  label: string;
}

export interface KendaraanRow {
  id: string;
  platNomor: string;
  merkId: string;
  merk: string;
  tipe: string;
  tahun: string;
  warna: string;
  noRangka: string;
  noMesin: string;
  pelangganId: string;
  pemilik: string;
  totalServis: number;
}

interface KendaraanListProps {
  kendaraan: KendaraanRow[];
  pelangganOptions: MasterOption[];
  merkOptions: MasterOption[];
}

export default function KendaraanList({
  kendaraan,
  pelangganOptions,
  merkOptions,
}: KendaraanListProps) {
  const items = kendaraan;
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMerk, setSelectedMerk] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KendaraanRow | null>(null);
  const [deleteItem, setDeleteItem] = useState<KendaraanRow | null>(null);

  const filterMerkOptions = useMemo(
    () => [{ value: "", label: "Semua Merk" }, ...merkOptions],
    [merkOptions]
  );

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const text = `${item.platNomor} ${item.merk} ${item.tipe} ${item.warna} ${item.noRangka} ${item.noMesin} ${item.pemilik}`.toLowerCase();
      const matchKeyword = !keyword || text.includes(keyword);
      const matchMerk = !selectedMerk || item.merkId === selectedMerk;
      return matchKeyword && matchMerk;
    });
  }, [items, query, selectedMerk]);

  const fields: MasterRecordField[] = [
    { name: "platNomor", label: "Plat Nomor", placeholder: "B 1234 ABC" },
    {
      name: "merkId",
      label: "Merk",
      type: "select",
      options: merkOptions,
    },
    { name: "tipe", label: "Tipe / Model", placeholder: "Beat / Avanza" },
    { name: "tahun", label: "Tahun", type: "number", placeholder: "2024" },
    { name: "warna", label: "Warna", placeholder: "Hitam" },
    {
      name: "pelangganId",
      label: "Pemilik",
      type: "select",
      options: pelangganOptions,
    },
    { name: "noRangka", label: "No. Rangka", placeholder: "Nomor rangka" },
    { name: "noMesin", label: "No. Mesin", placeholder: "Nomor mesin" },
  ];

  const initialValues = selectedItem
    ? ({
        ...selectedItem,
        tahun: selectedItem.tahun ? Number(selectedItem.tahun) : undefined,
      } satisfies MasterRecordData)
    : ({} satisfies MasterRecordData);

  const openEdit = (item: KendaraanRow) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari kendaraan..."
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={filterMerkOptions}
              placeholder="Merk"
              onChange={setSelectedMerk}
              defaultValue={selectedMerk}
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
          Tambah Kendaraan
        </Button>
      </div>

      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {item.platNomor}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.merk || "-"} {item.tipe}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.tahun || "-"}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Warna</span>
                  <span className="text-gray-800 dark:text-white/90">{item.warna || "-"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Pemilik</span>
                  <span className="text-gray-800 dark:text-white/90">{item.pemilik}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Total Servis</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">{item.totalServis}x</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">No. Rangka</span>
                  <p className="mt-1 font-mono text-xs text-gray-800 dark:text-white/90">
                    {item.noRangka || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                <Link href={`/master/kendaraan/${item.id}`} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
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
                  "Plat Nomor",
                  "Merk / Tipe",
                  "Tahun",
                  "Warna",
                  "No. Rangka",
                  "Pemilik",
                  "Total Servis",
                  "Aksi",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${
                      header === "Total Servis" ? "text-center" : "text-start"
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
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">{item.platNomor}</TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {item.merk || "-"} {item.tipe}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.tahun || "-"}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.warna || "-"}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start font-mono text-theme-xs dark:text-gray-400">{item.noRangka || "-"}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">{item.pemilik}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm dark:text-white/90">{item.totalServis}</TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <Link href={`/master/kendaraan/${item.id}`} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
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
        title={selectedItem ? "Edit Kendaraan" : "Tambah Kendaraan"}
        description="Data kendaraan dipakai pada work order, riwayat servis, dan reminder."
        fields={fields}
        initialValues={initialValues}
        hiddenFields={selectedItem ? { id: selectedItem.id } : undefined}
        formAction={selectedItem ? updateKendaraanAction : createKendaraanAction}
        onClose={closeForm}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.platNomor}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deleteKendaraanAction}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}

"use client";

import { useMemo, useState, type ReactNode } from "react";
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
import { Modal } from "@/components/ui/modal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { PencilIcon, EyeIcon, TrashBinIcon } from "@/icons";
import {
  createSparepartAction,
  deleteSparepartAction,
  updateSparepartAction,
} from "@/lib/masters/actions";

export interface MasterOption {
  value: string;
  label: string;
}

export interface SparepartRow {
  id: string;
  kode: string;
  nama: string;
  kategoriId: string;
  kategori: string;
  supplierId: string;
  supplier: string;
  stok: number;
  satuanId: string;
  satuan: string;
  minStok: number;
  hargaBeli: number;
  hargaJual: number;
  lokasiId: string;
  lokasi: string;
  mutasiTerakhir: {
    tanggal: string;
    tipe: "Masuk" | "Keluar";
    qty: number;
    keterangan: string;
  }[];
}

interface SparepartListProps {
  spareparts: SparepartRow[];
  kategoriOptions: MasterOption[];
  supplierOptions: MasterOption[];
  satuanOptions: MasterOption[];
  lokasiOptions: MasterOption[];
  nextCode: string;
}

const statusStokOptions = [
  { value: "", label: "Semua Status" },
  { value: "Aman", label: "Aman" },
  { value: "Menipis", label: "Menipis" },
  { value: "Habis", label: "Habis" },
];

const selectClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

const getStokStatus = (stok: number, minStok: number) => {
  if (stok === 0) return { label: "Habis", color: "error" as const };
  if (stok < minStok) return { label: "Menipis", color: "warning" as const };
  return { label: "Aman", color: "success" as const };
};

export default function SparepartList({
  spareparts,
  kategoriOptions,
  supplierOptions,
  satuanOptions,
  lokasiOptions,
  nextCode,
}: SparepartListProps) {
  const items = spareparts;
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedStatusStok, setSelectedStatusStok] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SparepartRow | null>(null);
  const [deleteItem, setDeleteItem] = useState<SparepartRow | null>(null);

  const kategoriFilterOptions = useMemo(
    () => [{ value: "", label: "Semua Kategori" }, ...kategoriOptions],
    [kategoriOptions]
  );

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const status = getStokStatus(item.stok, item.minStok).label;
      const matchKeyword =
        !keyword ||
        `${item.kode} ${item.nama} ${item.kategori} ${item.supplier} ${item.lokasi}`
          .toLowerCase()
          .includes(keyword);
      const matchKategori = !selectedKategori || item.kategoriId === selectedKategori;
      const matchStatus = !selectedStatusStok || status === selectedStatusStok;
      return matchKeyword && matchKategori && matchStatus;
    });
  }, [items, query, selectedKategori, selectedStatusStok]);

  const totalItem = items.length;
  const stokAman = items.filter((item) => item.stok >= item.minStok).length;
  const stokMenipis = items.filter((item) => item.stok > 0 && item.stok < item.minStok).length;
  const stokHabis = items.filter((item) => item.stok === 0).length;

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const openCreate = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: SparepartRow) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const openDetail = (item: SparepartRow) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Total Item" value={totalItem} />
        <SummaryCard label="Stok Aman" value={stokAman} valueClassName="text-success-500" />
        <SummaryCard label="Stok Menipis" value={stokMenipis} valueClassName="text-warning-500" />
        <SummaryCard label="Stok Habis" value={stokHabis} valueClassName="text-error-500" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-64">
              <Input
                type="text"
                placeholder="Cari sparepart..."
                className="w-full"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Button size="md" variant="primary" className="w-full sm:w-auto" onClick={openCreate}>
              Tambah Sparepart
            </Button>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 sm:w-40 sm:flex-none">
              <Select
                options={kategoriFilterOptions}
                placeholder="Kategori"
                onChange={setSelectedKategori}
                defaultValue={selectedKategori}
              />
            </div>
            <div className="flex-1 sm:w-40 sm:flex-none">
              <Select
                options={statusStokOptions}
                placeholder="Status Stok"
                onChange={setSelectedStatusStok}
                defaultValue={selectedStatusStok}
              />
            </div>
          </div>
        </div>

        <div className="block lg:hidden">
          <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredItems.map((item) => {
              const status = getStokStatus(item.stok, item.minStok);
              return (
                <div key={item.id} className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90">{item.nama}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.kode} - {item.lokasi || "-"}
                      </p>
                    </div>
                    <Badge size="sm" color={status.color}>{status.label}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Kategori</span>
                      <Badge size="sm" color="light">{item.kategori || "-"}</Badge>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Supplier</span>
                      <span className="text-gray-800 dark:text-white/90">{item.supplier || "-"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Stok</span>
                      <span className={`font-medium ${status.color === "error" ? "text-error-500" : status.color === "warning" ? "text-warning-600" : "text-gray-800 dark:text-white/90"}`}>
                        {item.stok} {item.satuan}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Min. Stok</span>
                      <span className="text-gray-800 dark:text-white/90">{item.minStok} {item.satuan}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Harga Beli</span>
                      <span className="text-gray-800 dark:text-white/90">Rp {item.hargaBeli.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500 dark:text-gray-400">Harga Jual</span>
                      <span className="font-medium text-gray-800 dark:text-white/90">Rp {item.hargaJual.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                    <button type="button" onClick={() => openDetail(item)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
                      <EyeIcon className="size-5" />
                    </button>
                    <button type="button" onClick={() => openEdit(item)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
                      <PencilIcon className="size-5" />
                    </button>
                    <button type="button" onClick={() => setDeleteItem(item)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400">
                      <TrashBinIcon className="size-5" />
                    </button>
                  </div>
                </div>
              );
            })}
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
                    "Nama Barang",
                    "Kategori",
                    "Supplier",
                    "Stok",
                    "Min. Stok",
                    "Harga Beli",
                    "Harga Jual",
                    "Status",
                    "Aksi",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${
                        ["Stok", "Min. Stok"].includes(header)
                          ? "text-center"
                          : ["Harga Beli", "Harga Jual"].includes(header)
                          ? "text-end"
                          : "text-start"
                      }`}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredItems.map((item, index) => {
                  const status = getStokStatus(item.stok, item.minStok);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{index + 1}</TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">{item.kode}</TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <p className="text-gray-800 text-theme-sm dark:text-white/90">{item.nama}</p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">{item.lokasi || "-"}</p>
                      </TableCell>
                      <TableCell className="px-5 py-4"><Badge size="sm" color="light">{item.kategori || "-"}</Badge></TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.supplier || "-"}</TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <span className={`text-theme-sm font-medium ${status.color === "error" ? "text-error-500" : status.color === "warning" ? "text-warning-600" : "text-gray-800 dark:text-white/90"}`}>
                          {item.stok}
                        </span>
                        <span className="ml-1 text-gray-500 text-theme-xs dark:text-gray-400">{item.satuan}</span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">{item.minStok}</TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm dark:text-white/90">Rp {item.hargaBeli.toLocaleString("id-ID")}</TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">Rp {item.hargaJual.toLocaleString("id-ID")}</TableCell>
                      <TableCell className="px-5 py-4 text-start"><Badge size="sm" color={status.color}>{status.label}</Badge></TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => openDetail(item)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                            <EyeIcon className="size-5" />
                          </button>
                          <button type="button" onClick={() => openEdit(item)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                            <PencilIcon className="size-5" />
                          </button>
                          <button type="button" onClick={() => setDeleteItem(item)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400">
                            <TrashBinIcon className="size-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
      </div>

      <SparepartFormModal
        isOpen={isFormOpen}
        item={selectedItem}
        nextCode={nextCode}
        kategoriOptions={kategoriOptions}
        supplierOptions={supplierOptions}
        satuanOptions={satuanOptions}
        lokasiOptions={lokasiOptions}
        onClose={closeForm}
      />

      <SparepartDetailModal
        isOpen={isDetailOpen}
        item={selectedItem}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedItem(null);
        }}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.nama}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deleteSparepartAction}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  valueClassName = "text-gray-800 dark:text-white/90",
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}

function SparepartFormModal({
  isOpen,
  item,
  nextCode,
  kategoriOptions,
  supplierOptions,
  satuanOptions,
  lokasiOptions,
  onClose,
}: {
  isOpen: boolean;
  item: SparepartRow | null;
  nextCode: string;
  kategoriOptions: MasterOption[];
  supplierOptions: MasterOption[];
  satuanOptions: MasterOption[];
  lokasiOptions: MasterOption[];
  onClose: () => void;
}) {
  const isEdit = !!item;

  return (
    <Modal
      key={`${isEdit ? "edit" : "create"}-${item?.id || "new"}`}
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="mx-4 w-full max-w-4xl max-h-[90vh] overflow-hidden p-0"
    >
      <form
        action={isEdit ? updateSparepartAction : createSparepartAction}
        onSubmit={onClose}
        className="flex max-h-[90vh] flex-col"
      >
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit Sparepart" : "Tambah Sparepart"}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lengkapi data sparepart untuk kebutuhan inventory bengkel.
          </p>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Kode">
              <Input name="kode" placeholder={nextCode} defaultValue={item?.kode ?? nextCode} readOnly />
            </FormField>
            <FormField label="Nama Sparepart">
              <Input name="nama" placeholder="Nama sparepart" defaultValue={item?.nama} />
            </FormField>
            <FormField label="Kategori">
              <select name="kategoriId" defaultValue={item?.kategoriId ?? ""} className={selectClass}>
                <option value="">Pilih kategori</option>
                {kategoriOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Supplier">
              <select name="supplierId" defaultValue={item?.supplierId ?? ""} className={selectClass}>
                <option value="">Pilih supplier</option>
                {supplierOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Stok">
              <Input name="stok" type="number" placeholder="0" defaultValue={item?.stok ?? 0} min="0" />
            </FormField>
            <FormField label="Satuan">
              <select name="satuanId" defaultValue={item?.satuanId ?? ""} className={selectClass}>
                <option value="">Pilih satuan</option>
                {satuanOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Minimum Stok">
              <Input name="minStok" type="number" placeholder="0" defaultValue={item?.minStok ?? 0} min="0" />
            </FormField>
            <FormField label="Lokasi Rak">
              <select name="lokasiId" defaultValue={item?.lokasiId ?? ""} className={selectClass}>
                <option value="">Pilih lokasi</option>
                {lokasiOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Harga Beli">
              <Input name="hargaBeli" type="number" placeholder="0" defaultValue={item?.hargaBeli ?? 0} min="0" />
            </FormField>
            <FormField label="Harga Jual">
              <Input name="hargaJual" type="number" placeholder="0" defaultValue={item?.hargaJual ?? 0} min="0" />
            </FormField>
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

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function SparepartDetailModal({
  isOpen,
  item,
  onClose,
}: {
  isOpen: boolean;
  item: SparepartRow | null;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 lg:p-8"
    >
      {item && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Detail Sparepart
            </h2>
            <Badge size="sm" color={getStokStatus(item.stok, item.minStok).color}>
              {getStokStatus(item.stok, item.minStok).label}
            </Badge>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Kode" value={item.kode} />
              <DetailItem label="Nama" value={item.nama} />
              <DetailItem label="Kategori" value={item.kategori || "-"} />
              <DetailItem label="Supplier" value={item.supplier || "-"} />
              <DetailItem label="Lokasi" value={item.lokasi || "-"} />
              <DetailItem label="Satuan" value={item.satuan || "-"} />
            </div>

            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <div className="grid grid-cols-2 gap-4">
                <StockMetric label="Stok Saat Ini" value={`${item.stok} ${item.satuan}`} />
                <StockMetric label="Minimum Stok" value={`${item.minStok} ${item.satuan}`} />
                <StockMetric label="Harga Beli" value={`Rp ${item.hargaBeli.toLocaleString("id-ID")}`} small />
                <StockMetric label="Harga Jual" value={`Rp ${item.hargaJual.toLocaleString("id-ID")}`} small accent />
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">
                Histori Mutasi Terakhir
              </h4>
              {item.mutasiTerakhir.length > 0 ? (
                <div className="space-y-2">
                  {item.mutasiTerakhir.map((mutasi, index) => (
                    <div key={`${mutasi.tanggal}-${index}`} className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-800">
                      <div>
                        <p className="text-sm text-gray-800 dark:text-white/90">{mutasi.keterangan}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(mutasi.tanggal).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <Badge size="sm" color={mutasi.tipe === "Masuk" ? "success" : "error"}>
                        {mutasi.tipe === "Masuk" ? "+" : "-"}{mutasi.qty}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Belum ada histori mutasi
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>Tutup</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 dark:text-white/90">{value}</p>
    </div>
  );
}

function StockMetric({
  label,
  value,
  small,
  accent,
}: {
  label: string;
  value: string;
  small?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`${small ? "text-lg" : "text-2xl"} font-bold ${
          accent ? "text-success-600" : "text-gray-800 dark:text-white/90"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

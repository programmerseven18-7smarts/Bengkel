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
import Pagination from "@/components/tables/Pagination";
import { Modal } from "@/components/ui/modal";
import { PlusIcon, PencilIcon, EyeIcon } from "@/icons";

interface Sparepart {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  supplier: string;
  stok: number;
  satuan: string;
  minStok: number;
  hargaBeli: number;
  hargaJual: number;
  lokasi: string;
  mutasiTerakhir: {
    tanggal: string;
    tipe: "Masuk" | "Keluar";
    qty: number;
    keterangan: string;
  }[];
}

const sparepartData: Sparepart[] = [
  {
    id: "1",
    kode: "SPR-001",
    nama: "Oli Mesin MPX2 1L",
    kategori: "Oli",
    supplier: "PT Sumber Sparepart",
    stok: 25,
    satuan: "Liter",
    minStok: 10,
    hargaBeli: 65000,
    hargaJual: 85000,
    lokasi: "Rak A-01",
    mutasiTerakhir: [
      { tanggal: "2024-01-10", tipe: "Keluar", qty: 1, keterangan: "WO-2024-045 - Budi Santoso" },
      { tanggal: "2024-01-08", tipe: "Masuk", qty: 20, keterangan: "PO-2024-012" },
    ],
  },
  {
    id: "2",
    kode: "SPR-002",
    nama: "Kampas Rem Depan Honda",
    kategori: "Rem",
    supplier: "CV Mandiri Motor",
    stok: 8,
    satuan: "Set",
    minStok: 5,
    hargaBeli: 45000,
    hargaJual: 65000,
    lokasi: "Rak B-03",
    mutasiTerakhir: [
      { tanggal: "2024-01-03", tipe: "Keluar", qty: 1, keterangan: "WO-2024-028 - Siti Rahma" },
    ],
  },
  {
    id: "3",
    kode: "SPR-003",
    nama: "Busi NGK Standard",
    kategori: "Kelistrikan",
    supplier: "Aneka Onderdil",
    stok: 5,
    satuan: "Pcs",
    minStok: 15,
    hargaBeli: 18000,
    hargaJual: 25000,
    lokasi: "Rak C-02",
    mutasiTerakhir: [
      { tanggal: "2024-01-05", tipe: "Keluar", qty: 2, keterangan: "WO-2024-030" },
    ],
  },
  {
    id: "4",
    kode: "SPR-004",
    nama: "Filter Udara Beat",
    kategori: "Filter",
    supplier: "CV Mandiri Motor",
    stok: 2,
    satuan: "Pcs",
    minStok: 8,
    hargaBeli: 35000,
    hargaJual: 45000,
    lokasi: "Rak A-05",
    mutasiTerakhir: [],
  },
  {
    id: "5",
    kode: "SPR-005",
    nama: "Aki GS 12V 5A",
    kategori: "Kelistrikan",
    supplier: "PT Sumber Sparepart",
    stok: 0,
    satuan: "Pcs",
    minStok: 3,
    hargaBeli: 280000,
    hargaJual: 350000,
    lokasi: "Rak D-01",
    mutasiTerakhir: [
      { tanggal: "2024-01-02", tipe: "Keluar", qty: 1, keterangan: "WO-2024-025 - Raka Pratama" },
    ],
  },
  {
    id: "6",
    kode: "SPR-006",
    nama: "Ban Tubeless 90/80",
    kategori: "Ban",
    supplier: "Aneka Onderdil",
    stok: 6,
    satuan: "Pcs",
    minStok: 4,
    hargaBeli: 180000,
    hargaJual: 220000,
    lokasi: "Rak E-02",
    mutasiTerakhir: [],
  },
  {
    id: "7",
    kode: "SPR-007",
    nama: "V-Belt Vario",
    kategori: "Transmisi",
    supplier: "CV Mandiri Motor",
    stok: 12,
    satuan: "Pcs",
    minStok: 5,
    hargaBeli: 120000,
    hargaJual: 150000,
    lokasi: "Rak B-01",
    mutasiTerakhir: [],
  },
];

const kategoriOptions = [
  { value: "", label: "Semua Kategori" },
  { value: "Oli", label: "Oli" },
  { value: "Rem", label: "Rem" },
  { value: "Kelistrikan", label: "Kelistrikan" },
  { value: "Filter", label: "Filter" },
  { value: "Transmisi", label: "Transmisi" },
  { value: "Ban", label: "Ban" },
];

const statusStokOptions = [
  { value: "", label: "Semua Status" },
  { value: "Aman", label: "Aman" },
  { value: "Menipis", label: "Menipis" },
  { value: "Habis", label: "Habis" },
];

const getStokStatus = (stok: number, minStok: number) => {
  if (stok === 0) return { label: "Habis", color: "error" as const };
  if (stok < minStok) return { label: "Menipis", color: "warning" as const };
  return { label: "Aman", color: "success" as const };
};

export default function SparepartList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedStatusStok, setSelectedStatusStok] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Sparepart | null>(null);

  const openDetail = (item: Sparepart) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  // Count summary
  const totalItem = sparepartData.length;
  const stokAman = sparepartData.filter((i) => i.stok >= i.minStok).length;
  const stokMenipis = sparepartData.filter((i) => i.stok > 0 && i.stok < i.minStok).length;
  const stokHabis = sparepartData.filter((i) => i.stok === 0).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Item</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-1">{totalItem}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Stok Aman</p>
          <p className="text-2xl font-bold text-success-500 mt-1">{stokAman}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Stok Menipis</p>
          <p className="text-2xl font-bold text-warning-500 mt-1">{stokMenipis}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Stok Habis</p>
          <p className="text-2xl font-bold text-error-500 mt-1">{stokHabis}</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-64">
              <Input type="text" placeholder="Cari sparepart..." className="w-full" />
            </div>
            <Button size="md" variant="primary" startIcon={<PlusIcon className="size-5" />} className="w-full sm:w-auto">
              Tambah Sparepart
            </Button>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 sm:w-40 sm:flex-none">
              <Select options={kategoriOptions} placeholder="Kategori" onChange={setSelectedKategori} defaultValue={selectedKategori} />
            </div>
            <div className="flex-1 sm:w-40 sm:flex-none">
              <Select options={statusStokOptions} placeholder="Status Stok" onChange={setSelectedStatusStok} defaultValue={selectedStatusStok} />
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {sparepartData.map((item) => {
              const status = getStokStatus(item.stok, item.minStok);
              return (
                <div key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90">{item.nama}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.kode} - {item.lokasi}</p>
                    </div>
                    <Badge size="sm" color={status.color}>{status.label}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Kategori</span>
                      <Badge size="sm" color="light">{item.kategori}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Supplier</span>
                      <span className="text-gray-800 dark:text-white/90">{item.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Stok</span>
                      <span className={`font-medium ${status.color === "error" ? "text-error-500" : status.color === "warning" ? "text-warning-600" : "text-gray-800 dark:text-white/90"}`}>
                        {item.stok} {item.satuan}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Min. Stok</span>
                      <span className="text-gray-800 dark:text-white/90">{item.minStok} {item.satuan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Harga Beli</span>
                      <span className="text-gray-800 dark:text-white/90">Rp {item.hargaBeli.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Harga Jual</span>
                      <span className="font-medium text-gray-800 dark:text-white/90">Rp {item.hargaJual.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.05]">
                    <button onClick={() => openDetail(item)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
                      <EyeIcon className="size-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400">
                      <PencilIcon className="size-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kode</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama Barang</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kategori</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Supplier</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Stok</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Min. Stok</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">Harga Beli</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">Harga Jual</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Aksi</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {sparepartData.map((item) => {
                  const status = getStokStatus(item.stok, item.minStok);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">{item.kode}</TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <p className="text-gray-800 text-theme-sm dark:text-white/90">{item.nama}</p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">{item.lokasi}</p>
                      </TableCell>
                      <TableCell className="px-5 py-4"><Badge size="sm" color="light">{item.kategori}</Badge></TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.supplier}</TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <span className={`text-theme-sm font-medium ${status.color === "error" ? "text-error-500" : status.color === "warning" ? "text-warning-600" : "text-gray-800 dark:text-white/90"}`}>
                          {item.stok}
                        </span>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400 ml-1">{item.satuan}</span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">{item.minStok}</TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm dark:text-white/90">Rp {item.hargaBeli.toLocaleString("id-ID")}</TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">Rp {item.hargaJual.toLocaleString("id-ID")}</TableCell>
                      <TableCell className="px-5 py-4 text-start"><Badge size="sm" color={status.color}>{status.label}</Badge></TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openDetail(item)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                            <EyeIcon className="size-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                            <PencilIcon className="size-5" />
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

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-white/[0.05] sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Menampilkan 1-7 dari 7 data</p>
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} className="max-w-xl p-6 lg:p-8">
        {selectedItem && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Detail Sparepart</h2>
              <Badge size="sm" color={getStokStatus(selectedItem.stok, selectedItem.minStok).color}>
                {getStokStatus(selectedItem.stok, selectedItem.minStok).label}
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kode</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedItem.kode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nama</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedItem.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kategori</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedItem.kategori}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Supplier</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedItem.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lokasi</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedItem.lokasi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Satuan</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedItem.satuan}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stok Saat Ini</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{selectedItem.stok} {selectedItem.satuan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Minimum Stok</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{selectedItem.minStok} {selectedItem.satuan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Harga Beli</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">Rp {selectedItem.hargaBeli.toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Harga Jual</p>
                    <p className="text-lg font-semibold text-success-600">Rp {selectedItem.hargaJual.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">Histori Mutasi Terakhir</h4>
                {selectedItem.mutasiTerakhir.length > 0 ? (
                  <div className="space-y-2">
                    {selectedItem.mutasiTerakhir.map((mutasi, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <div>
                          <p className="text-sm text-gray-800 dark:text-white/90">{mutasi.keterangan}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(mutasi.tanggal).toLocaleDateString("id-ID")}</p>
                        </div>
                        <Badge size="sm" color={mutasi.tipe === "Masuk" ? "success" : "error"}>
                          {mutasi.tipe === "Masuk" ? "+" : "-"}{mutasi.qty}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada histori mutasi</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
              <Button variant="primary">Tambah Stok</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

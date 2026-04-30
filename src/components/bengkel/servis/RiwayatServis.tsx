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
import { EyeIcon } from "@/icons";
import Link from "next/link";

interface RiwayatItem {
  id: string;
  noWorkOrder: string;
  tanggal: string;
  pelanggan: string;
  pelangganId: string;
  kendaraan: string;
  kendaraanId: string;
  platNomor: string;
  jenisServis: string;
  keluhan: string;
  diagnosa: string;
  tindakan: string;
  mekanik: string;
  totalJasa: number;
  totalSparepart: number;
  totalBiaya: number;
  status: "Selesai" | "Batal";
  statusBayar: "Lunas" | "Belum Lunas" | "Sebagian";
  jasaList: { nama: string; harga: number }[];
  sparepartList: { nama: string; qty: number; harga: number }[];
}

const riwayatData: RiwayatItem[] = [
  {
    id: "1",
    noWorkOrder: "WO-2024-045",
    tanggal: "2024-01-10",
    pelanggan: "Budi Santoso",
    pelangganId: "1",
    kendaraan: "Honda Beat",
    kendaraanId: "1",
    platNomor: "B 1234 ABC",
    jenisServis: "Ganti Oli + Tune Up",
    keluhan: "Mesin terasa kurang bertenaga dan suara kasar",
    diagnosa: "Oli sudah hitam pekat, perlu diganti. Busi aus perlu tune up.",
    tindakan: "Ganti oli mesin dengan MPX2, tune up ringan, bersihkan filter udara",
    mekanik: "Rudi",
    totalJasa: 100000,
    totalSparepart: 85000,
    totalBiaya: 185000,
    status: "Selesai",
    statusBayar: "Lunas",
    jasaList: [
      { nama: "Ganti Oli", harga: 25000 },
      { nama: "Tune Up Ringan", harga: 75000 },
    ],
    sparepartList: [
      { nama: "Oli Mesin MPX2 1L", qty: 1, harga: 85000 },
    ],
  },
  {
    id: "2",
    noWorkOrder: "WO-2024-032",
    tanggal: "2024-01-05",
    pelanggan: "Andi Wijaya",
    pelangganId: "2",
    kendaraan: "Toyota Avanza",
    kendaraanId: "2",
    platNomor: "D 7788 KA",
    jenisServis: "Servis AC",
    keluhan: "AC tidak dingin",
    diagnosa: "Freon habis, perlu refill dan cek kebocoran",
    tindakan: "Refill freon, cek kebocoran, bersihkan filter AC",
    mekanik: "Dimas",
    totalJasa: 150000,
    totalSparepart: 300000,
    totalBiaya: 450000,
    status: "Selesai",
    statusBayar: "Belum Lunas",
    jasaList: [
      { nama: "Servis AC Mobil", harga: 150000 },
    ],
    sparepartList: [
      { nama: "Freon R134a", qty: 2, harga: 150000 },
    ],
  },
  {
    id: "3",
    noWorkOrder: "WO-2024-028",
    tanggal: "2024-01-03",
    pelanggan: "Siti Rahma",
    pelangganId: "3",
    kendaraan: "Yamaha NMAX",
    kendaraanId: "3",
    platNomor: "F 9921 ZZ",
    jenisServis: "Servis Rem",
    keluhan: "Rem berdecit dan kurang pakem",
    diagnosa: "Kampas rem depan sudah tipis",
    tindakan: "Ganti kampas rem depan",
    mekanik: "Ahmad",
    totalJasa: 35000,
    totalSparepart: 65000,
    totalBiaya: 100000,
    status: "Selesai",
    statusBayar: "Lunas",
    jasaList: [
      { nama: "Ganti Kampas Rem", harga: 35000 },
    ],
    sparepartList: [
      { nama: "Kampas Rem Depan Honda", qty: 1, harga: 65000 },
    ],
  },
  {
    id: "4",
    noWorkOrder: "WO-2024-025",
    tanggal: "2024-01-02",
    pelanggan: "Raka Pratama",
    pelangganId: "4",
    kendaraan: "Honda Brio",
    kendaraanId: "4",
    platNomor: "B 8812 KJ",
    jenisServis: "Ganti Aki",
    keluhan: "Mesin susah dinyalakan, aki soak",
    diagnosa: "Aki sudah tidak bisa menyimpan daya",
    tindakan: "Ganti aki baru",
    mekanik: "Fajar",
    totalJasa: 25000,
    totalSparepart: 350000,
    totalBiaya: 375000,
    status: "Selesai",
    statusBayar: "Sebagian",
    jasaList: [
      { nama: "Pasang Aki", harga: 25000 },
    ],
    sparepartList: [
      { nama: "Aki GS 12V 5A", qty: 1, harga: 350000 },
    ],
  },
];

const pelangganOptions = [
  { value: "", label: "Semua Pelanggan" },
  { value: "1", label: "Budi Santoso" },
  { value: "2", label: "Andi Wijaya" },
  { value: "3", label: "Siti Rahma" },
  { value: "4", label: "Raka Pratama" },
];

const jenisServisOptions = [
  { value: "", label: "Semua Jenis Servis" },
  { value: "Ganti Oli", label: "Ganti Oli" },
  { value: "Tune Up", label: "Tune Up" },
  { value: "Servis Rem", label: "Servis Rem" },
  { value: "Servis AC", label: "Servis AC" },
  { value: "Ganti Aki", label: "Ganti Aki" },
];

const getStatusBayarColor = (status: RiwayatItem["statusBayar"]) => {
  switch (status) {
    case "Lunas":
      return "success";
    case "Belum Lunas":
      return "error";
    case "Sebagian":
      return "warning";
    default:
      return "light";
  }
};

export default function RiwayatServis() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPelanggan, setSelectedPelanggan] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RiwayatItem | null>(null);

  const openDetail = (item: RiwayatItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header with Filters */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
          <div className="flex gap-2 items-center">
            <Input type="date" className="w-36" />
            <span className="text-gray-500">-</span>
            <Input type="date" className="w-36" />
          </div>
          <div className="w-44">
            <Select
              options={pelangganOptions}
              placeholder="Pelanggan"
              onChange={setSelectedPelanggan}
              defaultValue={selectedPelanggan}
            />
          </div>
          <div className="w-44">
            <Select
              options={jenisServisOptions}
              placeholder="Jenis Servis"
              onChange={setSelectedJenis}
              defaultValue={selectedJenis}
            />
          </div>
        </div>
        <Button size="md" variant="outline">
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  No. Work Order
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Tanggal
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Pelanggan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Kendaraan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Jenis Servis
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Mekanik
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                  Total Biaya
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status Bayar
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {riwayatData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href={`/servis/work-order/${item.id}`}
                      className="text-brand-500 hover:text-brand-600 font-medium text-theme-sm"
                    >
                      {item.noWorkOrder}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href={`/master/pelanggan/${item.pelangganId}`}
                      className="text-gray-800 hover:text-brand-500 text-theme-sm dark:text-white/90"
                    >
                      {item.pelanggan}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href={`/master/kendaraan/${item.kendaraanId}`}
                      className="text-gray-800 hover:text-brand-500 text-theme-sm dark:text-white/90"
                    >
                      {item.kendaraan}
                    </Link>
                    <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {item.platNomor}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {item.jenisServis}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {item.mekanik}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">
                    Rp {item.totalBiaya.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge size="sm" color={getStatusBayarColor(item.statusBayar)}>
                      {item.statusBayar}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <button
                      onClick={() => openDetail(item)}
                      className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                    >
                      <EyeIcon className="size-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan 1-4 dari 4 data
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        className="max-w-2xl p-6 lg:p-8"
      >
        {selectedItem && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Detail Servis - {selectedItem.noWorkOrder}
              </h2>
              <Badge size="sm" color={getStatusBayarColor(selectedItem.statusBayar)}>
                {selectedItem.statusBayar}
              </Badge>
            </div>

            <div className="space-y-6">
              {/* Info Umum */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {new Date(selectedItem.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mekanik</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedItem.mekanik}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pelanggan</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedItem.pelanggan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kendaraan</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {selectedItem.kendaraan} - {selectedItem.platNomor}
                  </p>
                </div>
              </div>

              {/* Keluhan, Diagnosa, Tindakan */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Keluhan</p>
                  <p className="text-gray-800 dark:text-white/90">{selectedItem.keluhan}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Diagnosa</p>
                  <p className="text-gray-800 dark:text-white/90">{selectedItem.diagnosa}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tindakan</p>
                  <p className="text-gray-800 dark:text-white/90">{selectedItem.tindakan}</p>
                </div>
              </div>

              {/* Jasa */}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">Jasa Servis</h4>
                <div className="space-y-2">
                  {selectedItem.jasaList.map((jasa, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-300">{jasa.nama}</span>
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        Rp {jasa.harga.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium text-gray-800 dark:text-white/90">Subtotal Jasa</span>
                    <span className="font-semibold text-gray-800 dark:text-white/90">
                      Rp {selectedItem.totalJasa.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparepart */}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">Sparepart</h4>
                <div className="space-y-2">
                  {selectedItem.sparepartList.map((part, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-300">
                        {part.nama} x {part.qty}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        Rp {(part.harga * part.qty).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium text-gray-800 dark:text-white/90">Subtotal Sparepart</span>
                    <span className="font-semibold text-gray-800 dark:text-white/90">
                      Rp {selectedItem.totalSparepart.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
                <span className="text-lg font-semibold text-brand-700 dark:text-brand-400">Total Biaya</span>
                <span className="text-xl font-bold text-brand-700 dark:text-brand-400">
                  Rp {selectedItem.totalBiaya.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Tutup
              </Button>
              <Button variant="primary">
                Cetak Invoice
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

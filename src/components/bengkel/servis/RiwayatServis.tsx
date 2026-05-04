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
import { Modal } from "@/components/ui/modal";
import { EyeIcon } from "@/icons";
import Link from "next/link";

export interface RiwayatItem {
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
  invoiceId: string | null;
  jasaList: { nama: string; harga: number }[];
  sparepartList: { nama: string; qty: number; harga: number }[];
}

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

interface RiwayatServisProps {
  items: RiwayatItem[];
}

export default function RiwayatServis({ items }: RiwayatServisProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPelanggan, setSelectedPelanggan] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RiwayatItem | null>(null);

  const openDetail = (item: RiwayatItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const pelangganOptions = useMemo(() => {
    const options = new Map<string, string>();
    items.forEach((item) => options.set(item.pelangganId, item.pelanggan));

    return [
      { value: "", label: "Semua Pelanggan" },
      ...Array.from(options.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [items]);

  const jenisServisOptions = useMemo(() => {
    const options = Array.from(new Set(items.map((item) => item.jenisServis).filter(Boolean)));

    return [
      { value: "", label: "Semua Jenis Servis" },
      ...options.map((item) => ({ value: item, label: item })),
    ];
  }, [items]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchPelanggan = !selectedPelanggan || item.pelangganId === selectedPelanggan;
        const matchJenis = !selectedJenis || item.jenisServis === selectedJenis;

        return matchPelanggan && matchJenis;
      }),
    [items, selectedJenis, selectedPelanggan]
  );

  const exportCsv = () => {
    const rows = [
      ["No WO", "Tanggal", "Pelanggan", "Kendaraan", "Plat", "Jenis Servis", "Mekanik", "Total", "Status Bayar"],
      ...filteredItems.map((item) => [
        item.noWorkOrder,
        new Date(item.tanggal).toLocaleDateString("id-ID"),
        item.pelanggan,
        item.kendaraan,
        item.platNomor,
        item.jenisServis,
        item.mekanik,
        String(item.totalBiaya),
        item.statusBayar,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "riwayat-servis.csv";
    link.click();
    URL.revokeObjectURL(url);
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
        <Button size="md" variant="outline" onClick={exportCsv}>
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
                  No
                </TableCell>
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
              {filteredItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
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
                      type="button"
                      onClick={() => openDetail(item)}
                      className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                    >
                      <EyeIcon className="size-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Belum ada riwayat servis sesuai filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {filteredItems.length} dari {items.length} data
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
              {selectedItem.invoiceId ? (
                <Link href={`/keuangan/invoice/${selectedItem.invoiceId}`}>
                  <Button variant="primary">Buka Invoice</Button>
                </Link>
              ) : (
                <Link href="/keuangan/invoice/create">
                  <Button variant="primary">Buat Invoice</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

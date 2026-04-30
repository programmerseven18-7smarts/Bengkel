"use client";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, TrashBinIcon } from "@/icons";

interface WorkOrderDetailProps {
  id: string;
}

const workOrderData = {
  noWorkOrder: "WO-2024-001",
  tanggal: "30 April 2024",
  status: "Dikerjakan" as const,
  pelanggan: {
    nama: "Budi Santoso",
    noHp: "081234567890",
    alamat: "Jl. Merdeka No. 123, Jakarta Selatan",
  },
  kendaraan: {
    merk: "Honda",
    tipe: "Beat",
    tahun: "2022",
    platNomor: "B 1234 ABC",
    warna: "Merah",
    odometer: "15.250 km",
  },
  keluhan: "Mesin brebet saat dingin, tarikan kurang responsif",
  mekanik: "Rudi",
  jasaServis: [
    { id: "1", nama: "Tune Up Mesin", harga: 150000 },
    { id: "2", nama: "Ganti Oli Mesin", harga: 50000 },
    { id: "3", nama: "Cek Kelistrikan", harga: 75000 },
  ],
  sparepart: [
    { id: "1", kode: "SPR-001", nama: "Oli Mesin MPX2 1L", qty: 1, harga: 85000 },
    { id: "2", kode: "SPR-003", nama: "Busi NGK", qty: 1, harga: 25000 },
    { id: "3", kode: "SPR-004", nama: "Filter Udara", qty: 1, harga: 45000 },
  ],
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Antri":
      return "light";
    case "Dikerjakan":
      return "primary";
    case "Menunggu Part":
      return "warning";
    case "Selesai":
      return "success";
    case "Batal":
      return "error";
    default:
      return "light";
  }
};

export default function WorkOrderDetail({ id }: WorkOrderDetailProps) {
  const totalJasa = workOrderData.jasaServis.reduce((acc, jasa) => acc + jasa.harga, 0);
  const totalSparepart = workOrderData.sparepart.reduce((acc, part) => acc + (part.harga * part.qty), 0);
  const grandTotal = totalJasa + totalSparepart;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Header Info */}
      <div className="col-span-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                  {workOrderData.noWorkOrder}
                </h2>
                <Badge color={getStatusColor(workOrderData.status)}>
                  {workOrderData.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tanggal: {workOrderData.tanggal} | Mekanik: {workOrderData.mekanik}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                Cetak Invoice
              </Button>
              <Button variant="primary" size="sm">
                Proses Servis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Pelanggan */}
      <div className="col-span-12 lg:col-span-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Informasi Pelanggan
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Nama</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {workOrderData.pelanggan.nama}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">No. HP</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {workOrderData.pelanggan.noHp}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Alamat</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white/90 text-right max-w-[200px]">
                {workOrderData.pelanggan.alamat}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Kendaraan */}
      <div className="col-span-12 lg:col-span-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Informasi Kendaraan
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">Merk/Tipe</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {workOrderData.kendaraan.merk} {workOrderData.kendaraan.tipe}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">Tahun</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {workOrderData.kendaraan.tahun}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">Plat Nomor</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {workOrderData.kendaraan.platNomor}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">Warna</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {workOrderData.kendaraan.warna}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 block">Odometer</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                {workOrderData.kendaraan.odometer}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Keluhan */}
      <div className="col-span-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Keluhan Pelanggan
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {workOrderData.keluhan}
          </p>
        </div>
      </div>

      {/* Jasa Servis */}
      <div className="col-span-12">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Jasa Servis
            </h3>
            <Button variant="outline" size="sm" startIcon={<PlusIcon className="size-4" />}>
              Tambah Jasa
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    No
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Nama Jasa
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Harga
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {workOrderData.jasaServis.map((jasa, index) => (
                  <TableRow key={jasa.id}>
                    <TableCell className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                      {jasa.nama}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90 text-end">
                      Rp {jasa.harga.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      <button className="p-1 text-gray-500 hover:text-error-500 dark:text-gray-400">
                        <TrashBinIcon className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-5 md:p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-end">
              <div className="text-right">
                <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal Jasa: </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  Rp {totalJasa.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sparepart */}
      <div className="col-span-12">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Sparepart
            </h3>
            <Button variant="outline" size="sm" startIcon={<PlusIcon className="size-4" />}>
              Tambah Sparepart
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Kode
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Nama Barang
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    Qty
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Harga
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Subtotal
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {workOrderData.sparepart.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                      {part.kode}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                      {part.nama}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90 text-center">
                      {part.qty}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90 text-end">
                      Rp {part.harga.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-800 text-theme-sm dark:text-white/90 text-end">
                      Rp {(part.harga * part.qty).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      <button className="p-1 text-gray-500 hover:text-error-500 dark:text-gray-400">
                        <TrashBinIcon className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-5 md:p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-end">
              <div className="text-right">
                <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal Sparepart: </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  Rp {totalSparepart.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="col-span-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex gap-8">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">Total Jasa</span>
                  <span className="text-base font-medium text-gray-800 dark:text-white/90">
                    Rp {totalJasa.toLocaleString("id-ID")}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">Total Sparepart</span>
                  <span className="text-base font-medium text-gray-800 dark:text-white/90">
                    Rp {totalSparepart.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500 dark:text-gray-400 block">Grand Total</span>
              <span className="text-2xl font-bold text-brand-500 dark:text-brand-400">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="col-span-12">
        <div className="flex flex-wrap gap-3 justify-end">
          <Button variant="outline" size="md">
            Simpan Draft
          </Button>
          <Button variant="outline" size="md" className="text-warning-600 border-warning-300 hover:bg-warning-50">
            Menunggu Part
          </Button>
          <Button variant="primary" size="md">
            Selesaikan Servis
          </Button>
        </div>
      </div>
    </div>
  );
}

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
import { PencilIcon } from "@/icons";
import Link from "next/link";

interface KendaraanDetailProps {
  id: string;
}

// Mock data
const kendaraanData = {
  id: "1",
  platNomor: "B 1234 ABC",
  merk: "Honda",
  tipe: "Beat",
  tahun: "2022",
  warna: "Merah",
  noRangka: "MH1JFZ11XNK123456",
  noMesin: "JFZ1E-1234567",
  noBPKB: "K-12345678",
  noSTNK: "12345678",
  masaBerlakuSTNK: "2025-05-15",
  odometerTerakhir: 15420,
  tanggalOdometer: "2024-01-10",
  pemilik: {
    id: "1",
    nama: "Budi Santoso",
    noHp: "081234567890",
  },
  reminderServisBerikutnya: {
    tanggal: "2024-02-10",
    jenisServis: "Ganti Oli",
    odometer: 17000,
  },
};

const riwayatServis = [
  {
    id: "1",
    noWorkOrder: "WO-2024-045",
    tanggal: "2024-01-10",
    odometer: 15420,
    jenisServis: "Ganti Oli + Tune Up",
    mekanik: "Rudi",
    totalBiaya: 185000,
    status: "Selesai",
    catatan: "Kondisi mesin baik, oli diganti dengan MPX2",
  },
  {
    id: "2",
    noWorkOrder: "WO-2023-198",
    tanggal: "2023-12-20",
    odometer: 14200,
    jenisServis: "Ganti Kampas Rem",
    mekanik: "Dimas",
    totalBiaya: 125000,
    status: "Selesai",
    catatan: "Kampas rem depan dan belakang diganti",
  },
  {
    id: "3",
    noWorkOrder: "WO-2023-156",
    tanggal: "2023-11-05",
    odometer: 12800,
    jenisServis: "Ganti Oli",
    mekanik: "Rudi",
    totalBiaya: 85000,
    status: "Selesai",
    catatan: "Servis rutin ganti oli",
  },
  {
    id: "4",
    noWorkOrder: "WO-2023-089",
    tanggal: "2023-09-15",
    odometer: 11200,
    jenisServis: "Tune Up + Ganti Busi",
    mekanik: "Ahmad",
    totalBiaya: 150000,
    status: "Selesai",
    catatan: "Busi diganti karena sudah aus",
  },
];

const sparepartDiganti = [
  {
    id: "1",
    tanggal: "2024-01-10",
    noWorkOrder: "WO-2024-045",
    sparepart: "Oli Mesin MPX2 1L",
    qty: 1,
    harga: 85000,
  },
  {
    id: "2",
    tanggal: "2023-12-20",
    noWorkOrder: "WO-2023-198",
    sparepart: "Kampas Rem Depan Honda",
    qty: 1,
    harga: 65000,
  },
  {
    id: "3",
    tanggal: "2023-12-20",
    noWorkOrder: "WO-2023-198",
    sparepart: "Kampas Rem Belakang Honda",
    qty: 1,
    harga: 60000,
  },
  {
    id: "4",
    tanggal: "2023-11-05",
    noWorkOrder: "WO-2023-156",
    sparepart: "Oli Mesin MPX2 1L",
    qty: 1,
    harga: 85000,
  },
  {
    id: "5",
    tanggal: "2023-09-15",
    noWorkOrder: "WO-2023-089",
    sparepart: "Busi NGK Standard",
    qty: 1,
    harga: 25000,
  },
];

const catatanMekanik = [
  {
    id: "1",
    tanggal: "2024-01-10",
    mekanik: "Rudi",
    catatan: "Kondisi V-belt sudah mulai aus, disarankan ganti di servis berikutnya.",
  },
  {
    id: "2",
    tanggal: "2023-12-20",
    mekanik: "Dimas",
    catatan: "Ban depan sudah tipis, perlu diganti dalam waktu dekat.",
  },
];

export default function KendaraanDetail({ id }: KendaraanDetailProps) {
  const isSTNKExpiringSoon = () => {
    const expiry = new Date(kendaraanData.masaBerlakuSTNK);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Info Card */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                  {kendaraanData.merk} {kendaraanData.tipe}
                </h2>
                <p className="text-lg font-semibold text-brand-500">
                  {kendaraanData.platNomor}
                </p>
              </div>
            </div>
            <Button
              size="md"
              variant="outline"
              startIcon={<PencilIcon className="size-4" />}
            >
              Edit Data
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tahun</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">{kendaraanData.tahun}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Warna</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">{kendaraanData.warna}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No. Rangka</p>
              <p className="text-gray-800 dark:text-white/90 font-medium font-mono text-sm">{kendaraanData.noRangka}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No. Mesin</p>
              <p className="text-gray-800 dark:text-white/90 font-medium font-mono text-sm">{kendaraanData.noMesin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No. BPKB</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">{kendaraanData.noBPKB}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No. STNK</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">{kendaraanData.noSTNK}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Masa Berlaku STNK</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-800 dark:text-white/90 font-medium">
                  {new Date(kendaraanData.masaBerlakuSTNK).toLocaleDateString("id-ID")}
                </p>
                {isSTNKExpiringSoon() && (
                  <Badge size="sm" color="warning">Segera Habis</Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Odometer Terakhir</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">
                {kendaraanData.odometerTerakhir.toLocaleString("id-ID")} km
                <span className="text-xs text-gray-500 ml-1">
                  ({new Date(kendaraanData.tanggalOdometer).toLocaleDateString("id-ID")})
                </span>
              </p>
            </div>
          </div>

          {/* Owner Info */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Pemilik</p>
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/master/pelanggan/${kendaraanData.pemilik.id}`}
                  className="text-brand-500 hover:text-brand-600 font-medium"
                >
                  {kendaraanData.pemilik.nama}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">{kendaraanData.pemilik.noHp}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Card */}
      <div className="rounded-xl border border-warning-200 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/10 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100 dark:bg-warning-500/20">
            <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-warning-800 dark:text-warning-300">
              Reminder Servis Berikutnya
            </h4>
            <p className="text-sm text-warning-700 dark:text-warning-400 mt-1">
              {kendaraanData.reminderServisBerikutnya.jenisServis} - 
              Tanggal: {new Date(kendaraanData.reminderServisBerikutnya.tanggal).toLocaleDateString("id-ID")} atau 
              Odometer: {kendaraanData.reminderServisBerikutnya.odometer.toLocaleString("id-ID")} km
            </p>
          </div>
          <Button size="sm" variant="outline">
            Buat Booking
          </Button>
        </div>
      </div>

      {/* Riwayat Servis */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Riwayat Servis Lengkap
          </h3>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  No. WO
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Tanggal
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                  Odometer
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
                  Catatan
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {riwayatServis.map((servis) => (
                <TableRow key={servis.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href={`/servis/work-order/${servis.id}`}
                      className="text-brand-500 hover:text-brand-600 font-medium text-theme-sm"
                    >
                      {servis.noWorkOrder}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(servis.tanggal).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm dark:text-white/90">
                    {servis.odometer.toLocaleString("id-ID")} km
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {servis.jenisServis}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {servis.mekanik}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">
                    Rp {servis.totalBiaya.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-xs dark:text-gray-400 max-w-[200px]">
                    {servis.catatan}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sparepart yang Pernah Diganti */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Sparepart yang Pernah Diganti
            </h3>
          </div>
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tanggal
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Sparepart
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    Qty
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {sparepartDiganti.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {item.sparepart}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-800 text-center text-theme-sm dark:text-white/90">
                      {item.qty}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Catatan Mekanik */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Catatan Mekanik
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {catatanMekanik.map((item) => (
              <div key={item.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {item.mekanik}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {item.catatan}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

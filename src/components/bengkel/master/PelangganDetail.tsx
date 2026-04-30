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

interface PelangganDetailProps {
  id: string;
}

// Mock data - akan diganti dengan data dari API
const pelangganData = {
  id: "1",
  kode: "PLG-001",
  nama: "Budi Santoso",
  noHp: "081234567890",
  email: "budi.santoso@email.com",
  alamat: "Jl. Merdeka No. 123, RT 05/RW 02, Kelurahan Menteng, Kecamatan Menteng, Jakarta Pusat 10310",
  nik: "3171234567890001",
  tanggalLahir: "1985-05-15",
  jenisKelamin: "Laki-laki",
  totalKunjungan: 12,
  totalTransaksi: 4850000,
  piutang: 350000,
  tanggalDaftar: "2023-06-15",
  status: "Aktif" as const,
};

const kendaraanList = [
  {
    id: "1",
    platNomor: "B 1234 ABC",
    merk: "Honda",
    tipe: "Beat",
    tahun: "2022",
    warna: "Merah",
    totalServis: 8,
  },
  {
    id: "2",
    platNomor: "B 5678 XYZ",
    merk: "Toyota",
    tipe: "Avanza",
    tahun: "2020",
    warna: "Putih",
    totalServis: 4,
  },
];

const riwayatServisTerbaru = [
  {
    id: "1",
    noWorkOrder: "WO-2024-045",
    tanggal: "2024-01-10",
    kendaraan: "Honda Beat - B 1234 ABC",
    jenisServis: "Ganti Oli + Tune Up",
    totalBiaya: 185000,
    status: "Selesai",
    statusBayar: "Lunas",
  },
  {
    id: "2",
    noWorkOrder: "WO-2024-032",
    tanggal: "2024-01-05",
    kendaraan: "Toyota Avanza - B 5678 XYZ",
    jenisServis: "Servis AC",
    totalBiaya: 450000,
    status: "Selesai",
    statusBayar: "Belum Lunas",
  },
  {
    id: "3",
    noWorkOrder: "WO-2023-198",
    tanggal: "2023-12-20",
    kendaraan: "Honda Beat - B 1234 ABC",
    jenisServis: "Ganti Kampas Rem",
    totalBiaya: 125000,
    status: "Selesai",
    statusBayar: "Lunas",
  },
];

export default function PelangganDetail({ id }: PelangganDetailProps) {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20">
                <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {pelangganData.nama.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    {pelangganData.nama}
                  </h2>
                  <Badge size="sm" color={pelangganData.status === "Aktif" ? "success" : "light"}>
                    {pelangganData.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pelangganData.kode} | Member sejak {new Date(pelangganData.tanggalDaftar).toLocaleDateString("id-ID", { year: "numeric", month: "long" })}
                </p>
              </div>
            </div>
            <Button
              size="md"
              variant="outline"
              startIcon={<PencilIcon className="size-4" />}
            >
              Edit Profil
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">No. HP</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">{pelangganData.noHp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">{pelangganData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">NIK</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">{pelangganData.nik}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tanggal Lahir</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">
                {new Date(pelangganData.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Jenis Kelamin</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">{pelangganData.jenisKelamin}</p>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Alamat</p>
              <p className="text-gray-800 dark:text-white/90 font-medium">{pelangganData.alamat}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Kunjungan</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mt-1">
            {pelangganData.totalKunjungan} kali
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Transaksi</p>
          <p className="text-2xl font-bold text-success-500 mt-1">
            Rp {pelangganData.totalTransaksi.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Piutang</p>
          <p className={`text-2xl font-bold mt-1 ${pelangganData.piutang > 0 ? "text-error-500" : "text-gray-800 dark:text-white/90"}`}>
            Rp {pelangganData.piutang.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Kendaraan List */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Daftar Kendaraan ({kendaraanList.length})
            </h3>
            <Button size="sm" variant="outline">
              Tambah Kendaraan
            </Button>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Plat Nomor
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Merk / Tipe
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Tahun
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Warna
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                  Total Servis
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {kendaraanList.map((kendaraan) => (
                <TableRow key={kendaraan.id}>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm font-medium dark:text-white/90">
                    {kendaraan.platNomor}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {kendaraan.merk} {kendaraan.tipe}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {kendaraan.tahun}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {kendaraan.warna}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-center text-theme-sm dark:text-white/90">
                    {kendaraan.totalServis}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Link
                      href={`/master/kendaraan/${kendaraan.id}`}
                      className="text-brand-500 hover:text-brand-600 text-sm font-medium"
                    >
                      Lihat Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Riwayat Servis Terbaru */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Riwayat Servis Terbaru
            </h3>
            <Link
              href="/servis/riwayat"
              className="text-brand-500 hover:text-brand-600 text-sm font-medium"
            >
              Lihat Semua
            </Link>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
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
                  Kendaraan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Jenis Servis
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                  Total Biaya
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status Bayar
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {riwayatServisTerbaru.map((servis) => (
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
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {servis.kendaraan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {servis.jenisServis}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm font-medium dark:text-white/90">
                    Rp {servis.totalBiaya.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge
                      size="sm"
                      color={servis.statusBayar === "Lunas" ? "success" : "warning"}
                    >
                      {servis.statusBayar}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

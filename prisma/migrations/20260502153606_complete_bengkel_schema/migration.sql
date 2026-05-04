/*
  Warnings:

  - You are about to drop the `JasaServis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kendaraan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mekanik` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pelanggan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Produk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WOJasa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WOPart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusData" AS ENUM ('AKTIF', 'TIDAK_AKTIF');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "MekanikStatus" AS ENUM ('AKTIF', 'CUTI', 'TIDAK_AKTIF');

-- CreateEnum
CREATE TYPE "JadwalServisStatus" AS ENUM ('TERJADWAL', 'DATANG', 'BATAL', 'SELESAI');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('DRAFT', 'ANTRI', 'DIKERJAKAN', 'MENUNGGU_PART', 'SELESAI', 'BATAL');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'DIKIRIM', 'DITERIMA', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "PenerimaanBarangStatus" AS ENUM ('DRAFT', 'PARSIAL', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "ReturPembelianStatus" AS ENUM ('DRAFT', 'DIKIRIM', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "StokKeluarTipe" AS ENUM ('SERVIS', 'PENJUALAN', 'RETUR', 'LAINNYA');

-- CreateEnum
CREATE TYPE "StokMovementType" AS ENUM ('MASUK', 'KELUAR', 'MUTASI');

-- CreateEnum
CREATE TYPE "InvoiceItemTipe" AS ENUM ('JASA', 'SPAREPART', 'LAINNYA');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'BELUM_LUNAS', 'SEBAGIAN', 'LUNAS', 'BATAL');

-- CreateEnum
CREATE TYPE "PembayaranStatus" AS ENUM ('DRAFT', 'SELESAI', 'BATAL');

-- CreateEnum
CREATE TYPE "PiutangStatus" AS ENUM ('BELUM_LUNAS', 'SEBAGIAN', 'JATUH_TEMPO', 'LUNAS');

-- CreateEnum
CREATE TYPE "KasBankJenis" AS ENUM ('MASUK', 'KELUAR');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('TERJADWAL', 'DIKIRIM', 'SELESAI', 'LEWAT');

-- DropForeignKey
ALTER TABLE "Kendaraan" DROP CONSTRAINT "Kendaraan_pelangganId_fkey";

-- DropForeignKey
ALTER TABLE "WOJasa" DROP CONSTRAINT "WOJasa_jasaId_fkey";

-- DropForeignKey
ALTER TABLE "WOJasa" DROP CONSTRAINT "WOJasa_woId_fkey";

-- DropForeignKey
ALTER TABLE "WOPart" DROP CONSTRAINT "WOPart_produkId_fkey";

-- DropForeignKey
ALTER TABLE "WOPart" DROP CONSTRAINT "WOPart_woId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_kendaraanId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_mekanikId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_pelangganId_fkey";

-- DropTable
DROP TABLE "JasaServis";

-- DropTable
DROP TABLE "Kendaraan";

-- DropTable
DROP TABLE "Mekanik";

-- DropTable
DROP TABLE "Pelanggan";

-- DropTable
DROP TABLE "Produk";

-- DropTable
DROP TABLE "WOJasa";

-- DropTable
DROP TABLE "WOPart";

-- DropTable
DROP TABLE "WorkOrder";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT,
    "no_hp" VARCHAR(30),
    "status" "UserStatus" NOT NULL DEFAULT 'AKTIF',
    "terakhir_login" TIMESTAMP(3),
    "role_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(80) NOT NULL,
    "deskripsi" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(120) NOT NULL,
    "module" VARCHAR(80) NOT NULL,
    "resource" VARCHAR(120) NOT NULL,
    "action" VARCHAR(40) NOT NULL,
    "deskripsi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_pelanggan" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "no_hp" VARCHAR(30),
    "email" VARCHAR(150),
    "alamat" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_pelanggan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_merk_kendaraan" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "jenis_kendaraan" VARCHAR(50),
    "deskripsi" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_merk_kendaraan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_kendaraan" (
    "id" TEXT NOT NULL,
    "pelanggan_id" TEXT NOT NULL,
    "merk_id" TEXT,
    "plat_nomor" VARCHAR(24) NOT NULL,
    "tipe" VARCHAR(100) NOT NULL,
    "tahun" INTEGER,
    "warna" VARCHAR(60),
    "no_rangka" VARCHAR(100),
    "no_mesin" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_kendaraan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_mekanik" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "no_hp" VARCHAR(30),
    "spesialisasi" VARCHAR(150),
    "tanggal_bergabung" TIMESTAMP(3),
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "status" "MekanikStatus" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_mekanik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_supplier" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "no_hp" VARCHAR(30),
    "email" VARCHAR(150),
    "alamat" TEXT,
    "produk_utama" VARCHAR(150),
    "total_transaksi" INTEGER NOT NULL DEFAULT 0,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_kategori_sparepart" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "deskripsi" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_kategori_sparepart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_kategori_jasa_servis" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "deskripsi" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_kategori_jasa_servis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_satuan" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(80) NOT NULL,
    "jenis" VARCHAR(80),
    "deskripsi" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_satuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_lokasi_stok" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "tipe" VARCHAR(80),
    "deskripsi" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_lokasi_stok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_sparepart" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(180) NOT NULL,
    "kategori_id" TEXT,
    "supplier_id" TEXT,
    "satuan_id" TEXT,
    "lokasi_id" TEXT,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "min_stok" INTEGER NOT NULL DEFAULT 0,
    "harga_beli" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "harga_jual" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_sparepart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_jasa_servis" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "kategori_id" TEXT,
    "harga" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "estimasi_menit" INTEGER,
    "deskripsi" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_jasa_servis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_paket_servis" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "jenis_kendaraan" VARCHAR(80),
    "estimasi_menit" INTEGER,
    "harga_paket" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "catatan" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_paket_servis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_paket_servis_jasa" (
    "id" TEXT NOT NULL,
    "paket_servis_id" TEXT NOT NULL,
    "jasa_servis_id" TEXT NOT NULL,
    "estimasi_menit" INTEGER,
    "harga_normal" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "m_paket_servis_jasa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_paket_servis_sparepart" (
    "id" TEXT NOT NULL,
    "paket_servis_id" TEXT NOT NULL,
    "sparepart_id" TEXT NOT NULL,
    "qty" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "harga_normal" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "m_paket_servis_sparepart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_alasan_retur" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "jenis" VARCHAR(80),
    "deskripsi" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_alasan_retur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_kondisi_barang" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "kelompok" VARCHAR(80),
    "deskripsi" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_kondisi_barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_metode_pembayaran" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "tipe" VARCHAR(80),
    "deskripsi" TEXT,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_metode_pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_akun_kas_bank" (
    "id" TEXT NOT NULL,
    "kode" VARCHAR(32) NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "tipe" VARCHAR(80) NOT NULL,
    "nama_bank" VARCHAR(120),
    "no_rekening" VARCHAR(80),
    "saldo_awal" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "status" "StatusData" NOT NULL DEFAULT 'AKTIF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_akun_kas_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_jadwal_servis" (
    "id" TEXT NOT NULL,
    "no_jadwal" VARCHAR(40) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jam" VARCHAR(20),
    "pelanggan_id" TEXT NOT NULL,
    "kendaraan_id" TEXT NOT NULL,
    "jasa_servis_id" TEXT,
    "mekanik_id" TEXT,
    "keluhan" TEXT,
    "status" "JadwalServisStatus" NOT NULL DEFAULT 'TERJADWAL',
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_jadwal_servis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_work_order" (
    "id" TEXT NOT NULL,
    "no_work_order" VARCHAR(40) NOT NULL,
    "tanggal_masuk" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimasi_selesai" TIMESTAMP(3),
    "pelanggan_id" TEXT NOT NULL,
    "kendaraan_id" TEXT NOT NULL,
    "mekanik_id" TEXT,
    "paket_servis_id" TEXT,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "keluhan" TEXT,
    "catatan" TEXT,
    "odometer" INTEGER,
    "total_jasa" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_sparepart" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grand_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_work_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_work_order_jasa" (
    "id" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "jasa_servis_id" TEXT,
    "nama_jasa" VARCHAR(150) NOT NULL,
    "kategori" VARCHAR(100),
    "estimasi_menit" INTEGER,
    "harga" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "catatan_mekanik" TEXT,

    CONSTRAINT "t_work_order_jasa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_work_order_sparepart" (
    "id" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "sparepart_id" TEXT,
    "nama_sparepart" VARCHAR(180) NOT NULL,
    "stok_saat_itu" INTEGER,
    "qty" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "satuan" VARCHAR(40),
    "harga_jual" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "catatan" TEXT,

    CONSTRAINT "t_work_order_sparepart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_reminder_servis" (
    "id" TEXT NOT NULL,
    "pelanggan_id" TEXT NOT NULL,
    "kendaraan_id" TEXT NOT NULL,
    "jenis_reminder" VARCHAR(150) NOT NULL,
    "jatuh_tempo" TIMESTAMP(3) NOT NULL,
    "kanal" VARCHAR(40) NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'TERJADWAL',
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_reminder_servis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_purchase_order" (
    "id" TEXT NOT NULL,
    "no_purchase_order" VARCHAR(40) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "estimasi_datang" TIMESTAMP(3),
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "catatan" TEXT,
    "total_item" INTEGER NOT NULL DEFAULT 0,
    "total_nilai" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_purchase_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_purchase_order_item" (
    "id" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "sparepart_id" TEXT,
    "nama_sparepart" VARCHAR(180) NOT NULL,
    "stok_saat_ini" INTEGER,
    "qty_pesan" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "qty_diterima" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "satuan" VARCHAR(40),
    "harga_beli" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "catatan" TEXT,

    CONSTRAINT "t_purchase_order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_penerimaan_barang" (
    "id" TEXT NOT NULL,
    "no_penerimaan" VARCHAR(40) NOT NULL,
    "purchase_order_id" TEXT,
    "supplier_id" TEXT NOT NULL,
    "tanggal_terima" TIMESTAMP(3) NOT NULL,
    "diterima_oleh_id" TEXT,
    "status" "PenerimaanBarangStatus" NOT NULL DEFAULT 'DRAFT',
    "catatan" TEXT,
    "total_item" INTEGER NOT NULL DEFAULT 0,
    "total_nilai" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_penerimaan_barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_penerimaan_barang_item" (
    "id" TEXT NOT NULL,
    "penerimaan_barang_id" TEXT NOT NULL,
    "purchase_order_item_id" TEXT,
    "sparepart_id" TEXT,
    "kondisi_barang_id" TEXT,
    "nama_sparepart" VARCHAR(180) NOT NULL,
    "qty_po" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "qty_terima" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "satuan" VARCHAR(40),
    "harga_beli" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "catatan" TEXT,

    CONSTRAINT "t_penerimaan_barang_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_retur_pembelian" (
    "id" TEXT NOT NULL,
    "no_retur" VARCHAR(40) NOT NULL,
    "penerimaan_barang_id" TEXT,
    "supplier_id" TEXT NOT NULL,
    "alasan_retur_id" TEXT,
    "tanggal_retur" TIMESTAMP(3) NOT NULL,
    "status" "ReturPembelianStatus" NOT NULL DEFAULT 'DRAFT',
    "catatan" TEXT,
    "total_item" INTEGER NOT NULL DEFAULT 0,
    "total_nilai" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_retur_pembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_retur_pembelian_item" (
    "id" TEXT NOT NULL,
    "retur_pembelian_id" TEXT NOT NULL,
    "penerimaan_barang_item_id" TEXT,
    "sparepart_id" TEXT,
    "alasan_retur_id" TEXT,
    "nama_sparepart" VARCHAR(180) NOT NULL,
    "qty_diterima" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "qty_retur" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "satuan" VARCHAR(40),
    "harga_beli" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(16,2) NOT NULL DEFAULT 0,

    CONSTRAINT "t_retur_pembelian_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_stok_masuk" (
    "id" TEXT NOT NULL,
    "no_transaksi" VARCHAR(40) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "sumber" VARCHAR(80) NOT NULL,
    "supplier_id" TEXT,
    "referensi" VARCHAR(80),
    "catatan" TEXT,
    "total_item" INTEGER NOT NULL DEFAULT 0,
    "total_nilai" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_stok_masuk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_stok_masuk_item" (
    "id" TEXT NOT NULL,
    "stok_masuk_id" TEXT NOT NULL,
    "sparepart_id" TEXT,
    "nama_sparepart" VARCHAR(180) NOT NULL,
    "qty_masuk" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "satuan" VARCHAR(40),
    "harga_modal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "catatan" TEXT,

    CONSTRAINT "t_stok_masuk_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_stok_keluar" (
    "id" TEXT NOT NULL,
    "no_transaksi" VARCHAR(40) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "tipe" "StokKeluarTipe" NOT NULL,
    "referensi" VARCHAR(80),
    "diminta_oleh" VARCHAR(150),
    "work_order_id" TEXT,
    "catatan" TEXT,
    "total_item" INTEGER NOT NULL DEFAULT 0,
    "total_nilai" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_stok_keluar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_stok_keluar_item" (
    "id" TEXT NOT NULL,
    "stok_keluar_id" TEXT NOT NULL,
    "sparepart_id" TEXT,
    "nama_sparepart" VARCHAR(180) NOT NULL,
    "stok_saat_itu" INTEGER,
    "qty_keluar" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "satuan" VARCHAR(40),
    "harga_modal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "catatan" TEXT,

    CONSTRAINT "t_stok_keluar_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_mutasi_stok" (
    "id" TEXT NOT NULL,
    "no_mutasi" VARCHAR(40) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "lokasi_asal_id" TEXT NOT NULL,
    "lokasi_tujuan_id" TEXT NOT NULL,
    "penanggung_jawab_id" TEXT,
    "catatan" TEXT,
    "total_qty" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_mutasi_stok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_mutasi_stok_item" (
    "id" TEXT NOT NULL,
    "mutasi_stok_id" TEXT NOT NULL,
    "sparepart_id" TEXT,
    "nama_sparepart" VARCHAR(180) NOT NULL,
    "stok_asal" INTEGER,
    "qty_mutasi" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "satuan" VARCHAR(40),
    "catatan" TEXT,

    CONSTRAINT "t_mutasi_stok_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_stok_ledger" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sparepart_id" TEXT NOT NULL,
    "lokasi_id" TEXT,
    "tipe" "StokMovementType" NOT NULL,
    "qty_masuk" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "qty_keluar" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "stok_sebelum" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "stok_sesudah" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "satuan" VARCHAR(40),
    "harga_modal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "ref_tipe" VARCHAR(80),
    "ref_id" TEXT,
    "ref_no" VARCHAR(80),
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_stok_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_invoice" (
    "id" TEXT NOT NULL,
    "no_invoice" VARCHAR(40) NOT NULL,
    "work_order_id" TEXT,
    "pelanggan_id" TEXT NOT NULL,
    "kendaraan_id" TEXT,
    "tanggal_invoice" TIMESTAMP(3) NOT NULL,
    "jatuh_tempo" TIMESTAMP(3),
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "total_jasa" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "total_sparepart" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "total_lainnya" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "grand_total" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "terbayar" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "sisa_tagihan" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_invoice_item" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "tipe" "InvoiceItemTipe" NOT NULL,
    "deskripsi" VARCHAR(180) NOT NULL,
    "jasa_servis_id" TEXT,
    "sparepart_id" TEXT,
    "qty" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "harga" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(16,2) NOT NULL DEFAULT 0,

    CONSTRAINT "t_invoice_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_pembayaran" (
    "id" TEXT NOT NULL,
    "no_pembayaran" VARCHAR(40) NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "pelanggan_id" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "metode_pembayaran_id" TEXT,
    "akun_kas_bank_id" TEXT,
    "jumlah_bayar" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "nomor_referensi" VARCHAR(120),
    "kasir_id" TEXT,
    "status" "PembayaranStatus" NOT NULL DEFAULT 'SELESAI',
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_piutang" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "pelanggan_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jatuh_tempo" TIMESTAMP(3),
    "total_tagihan" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "terbayar" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "sisa_piutang" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "status" "PiutangStatus" NOT NULL DEFAULT 'BELUM_LUNAS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_piutang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_kas_bank" (
    "id" TEXT NOT NULL,
    "no_transaksi" VARCHAR(40) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jenis" "KasBankJenis" NOT NULL,
    "kategori" VARCHAR(120) NOT NULL,
    "deskripsi" TEXT,
    "jumlah" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "akun_kas_bank_id" TEXT NOT NULL,
    "saldo_akhir" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "ref_tipe" VARCHAR(80),
    "ref_id" TEXT,
    "ref_no" VARCHAR(80),
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_kas_bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nama_key" ON "roles"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_kode_key" ON "permissions"("kode");

-- CreateIndex
CREATE INDEX "permissions_module_resource_idx" ON "permissions"("module", "resource");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_pelanggan_kode_key" ON "m_pelanggan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_pelanggan_email_key" ON "m_pelanggan"("email");

-- CreateIndex
CREATE UNIQUE INDEX "m_merk_kendaraan_kode_key" ON "m_merk_kendaraan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_kendaraan_plat_nomor_key" ON "m_kendaraan"("plat_nomor");

-- CreateIndex
CREATE UNIQUE INDEX "m_kendaraan_no_rangka_key" ON "m_kendaraan"("no_rangka");

-- CreateIndex
CREATE UNIQUE INDEX "m_kendaraan_no_mesin_key" ON "m_kendaraan"("no_mesin");

-- CreateIndex
CREATE INDEX "m_kendaraan_pelanggan_id_idx" ON "m_kendaraan"("pelanggan_id");

-- CreateIndex
CREATE INDEX "m_kendaraan_merk_id_idx" ON "m_kendaraan"("merk_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_mekanik_kode_key" ON "m_mekanik"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_supplier_kode_key" ON "m_supplier"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_kategori_sparepart_kode_key" ON "m_kategori_sparepart"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_kategori_sparepart_nama_key" ON "m_kategori_sparepart"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "m_kategori_jasa_servis_kode_key" ON "m_kategori_jasa_servis"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_kategori_jasa_servis_nama_key" ON "m_kategori_jasa_servis"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "m_satuan_kode_key" ON "m_satuan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_lokasi_stok_kode_key" ON "m_lokasi_stok"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_sparepart_kode_key" ON "m_sparepart"("kode");

-- CreateIndex
CREATE INDEX "m_sparepart_kategori_id_idx" ON "m_sparepart"("kategori_id");

-- CreateIndex
CREATE INDEX "m_sparepart_supplier_id_idx" ON "m_sparepart"("supplier_id");

-- CreateIndex
CREATE INDEX "m_sparepart_satuan_id_idx" ON "m_sparepart"("satuan_id");

-- CreateIndex
CREATE INDEX "m_sparepart_lokasi_id_idx" ON "m_sparepart"("lokasi_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_jasa_servis_kode_key" ON "m_jasa_servis"("kode");

-- CreateIndex
CREATE INDEX "m_jasa_servis_kategori_id_idx" ON "m_jasa_servis"("kategori_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_paket_servis_kode_key" ON "m_paket_servis"("kode");

-- CreateIndex
CREATE INDEX "m_paket_servis_jasa_jasa_servis_id_idx" ON "m_paket_servis_jasa"("jasa_servis_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_paket_servis_jasa_paket_servis_id_jasa_servis_id_key" ON "m_paket_servis_jasa"("paket_servis_id", "jasa_servis_id");

-- CreateIndex
CREATE INDEX "m_paket_servis_sparepart_sparepart_id_idx" ON "m_paket_servis_sparepart"("sparepart_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_paket_servis_sparepart_paket_servis_id_sparepart_id_key" ON "m_paket_servis_sparepart"("paket_servis_id", "sparepart_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_alasan_retur_kode_key" ON "m_alasan_retur"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_kondisi_barang_kode_key" ON "m_kondisi_barang"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_metode_pembayaran_kode_key" ON "m_metode_pembayaran"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "m_akun_kas_bank_kode_key" ON "m_akun_kas_bank"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "t_jadwal_servis_no_jadwal_key" ON "t_jadwal_servis"("no_jadwal");

-- CreateIndex
CREATE INDEX "t_jadwal_servis_pelanggan_id_idx" ON "t_jadwal_servis"("pelanggan_id");

-- CreateIndex
CREATE INDEX "t_jadwal_servis_kendaraan_id_idx" ON "t_jadwal_servis"("kendaraan_id");

-- CreateIndex
CREATE INDEX "t_jadwal_servis_jasa_servis_id_idx" ON "t_jadwal_servis"("jasa_servis_id");

-- CreateIndex
CREATE INDEX "t_jadwal_servis_mekanik_id_idx" ON "t_jadwal_servis"("mekanik_id");

-- CreateIndex
CREATE INDEX "t_jadwal_servis_created_by_id_idx" ON "t_jadwal_servis"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_work_order_no_work_order_key" ON "t_work_order"("no_work_order");

-- CreateIndex
CREATE INDEX "t_work_order_pelanggan_id_idx" ON "t_work_order"("pelanggan_id");

-- CreateIndex
CREATE INDEX "t_work_order_kendaraan_id_idx" ON "t_work_order"("kendaraan_id");

-- CreateIndex
CREATE INDEX "t_work_order_mekanik_id_idx" ON "t_work_order"("mekanik_id");

-- CreateIndex
CREATE INDEX "t_work_order_paket_servis_id_idx" ON "t_work_order"("paket_servis_id");

-- CreateIndex
CREATE INDEX "t_work_order_created_by_id_idx" ON "t_work_order"("created_by_id");

-- CreateIndex
CREATE INDEX "t_work_order_jasa_work_order_id_idx" ON "t_work_order_jasa"("work_order_id");

-- CreateIndex
CREATE INDEX "t_work_order_jasa_jasa_servis_id_idx" ON "t_work_order_jasa"("jasa_servis_id");

-- CreateIndex
CREATE INDEX "t_work_order_sparepart_work_order_id_idx" ON "t_work_order_sparepart"("work_order_id");

-- CreateIndex
CREATE INDEX "t_work_order_sparepart_sparepart_id_idx" ON "t_work_order_sparepart"("sparepart_id");

-- CreateIndex
CREATE INDEX "t_reminder_servis_pelanggan_id_idx" ON "t_reminder_servis"("pelanggan_id");

-- CreateIndex
CREATE INDEX "t_reminder_servis_kendaraan_id_idx" ON "t_reminder_servis"("kendaraan_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_purchase_order_no_purchase_order_key" ON "t_purchase_order"("no_purchase_order");

-- CreateIndex
CREATE INDEX "t_purchase_order_supplier_id_idx" ON "t_purchase_order"("supplier_id");

-- CreateIndex
CREATE INDEX "t_purchase_order_item_purchase_order_id_idx" ON "t_purchase_order_item"("purchase_order_id");

-- CreateIndex
CREATE INDEX "t_purchase_order_item_sparepart_id_idx" ON "t_purchase_order_item"("sparepart_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_penerimaan_barang_no_penerimaan_key" ON "t_penerimaan_barang"("no_penerimaan");

-- CreateIndex
CREATE INDEX "t_penerimaan_barang_purchase_order_id_idx" ON "t_penerimaan_barang"("purchase_order_id");

-- CreateIndex
CREATE INDEX "t_penerimaan_barang_supplier_id_idx" ON "t_penerimaan_barang"("supplier_id");

-- CreateIndex
CREATE INDEX "t_penerimaan_barang_diterima_oleh_id_idx" ON "t_penerimaan_barang"("diterima_oleh_id");

-- CreateIndex
CREATE INDEX "t_penerimaan_barang_item_penerimaan_barang_id_idx" ON "t_penerimaan_barang_item"("penerimaan_barang_id");

-- CreateIndex
CREATE INDEX "t_penerimaan_barang_item_purchase_order_item_id_idx" ON "t_penerimaan_barang_item"("purchase_order_item_id");

-- CreateIndex
CREATE INDEX "t_penerimaan_barang_item_sparepart_id_idx" ON "t_penerimaan_barang_item"("sparepart_id");

-- CreateIndex
CREATE INDEX "t_penerimaan_barang_item_kondisi_barang_id_idx" ON "t_penerimaan_barang_item"("kondisi_barang_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_retur_pembelian_no_retur_key" ON "t_retur_pembelian"("no_retur");

-- CreateIndex
CREATE INDEX "t_retur_pembelian_penerimaan_barang_id_idx" ON "t_retur_pembelian"("penerimaan_barang_id");

-- CreateIndex
CREATE INDEX "t_retur_pembelian_supplier_id_idx" ON "t_retur_pembelian"("supplier_id");

-- CreateIndex
CREATE INDEX "t_retur_pembelian_alasan_retur_id_idx" ON "t_retur_pembelian"("alasan_retur_id");

-- CreateIndex
CREATE INDEX "t_retur_pembelian_item_retur_pembelian_id_idx" ON "t_retur_pembelian_item"("retur_pembelian_id");

-- CreateIndex
CREATE INDEX "t_retur_pembelian_item_penerimaan_barang_item_id_idx" ON "t_retur_pembelian_item"("penerimaan_barang_item_id");

-- CreateIndex
CREATE INDEX "t_retur_pembelian_item_sparepart_id_idx" ON "t_retur_pembelian_item"("sparepart_id");

-- CreateIndex
CREATE INDEX "t_retur_pembelian_item_alasan_retur_id_idx" ON "t_retur_pembelian_item"("alasan_retur_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_stok_masuk_no_transaksi_key" ON "t_stok_masuk"("no_transaksi");

-- CreateIndex
CREATE INDEX "t_stok_masuk_supplier_id_idx" ON "t_stok_masuk"("supplier_id");

-- CreateIndex
CREATE INDEX "t_stok_masuk_item_stok_masuk_id_idx" ON "t_stok_masuk_item"("stok_masuk_id");

-- CreateIndex
CREATE INDEX "t_stok_masuk_item_sparepart_id_idx" ON "t_stok_masuk_item"("sparepart_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_stok_keluar_no_transaksi_key" ON "t_stok_keluar"("no_transaksi");

-- CreateIndex
CREATE INDEX "t_stok_keluar_work_order_id_idx" ON "t_stok_keluar"("work_order_id");

-- CreateIndex
CREATE INDEX "t_stok_keluar_item_stok_keluar_id_idx" ON "t_stok_keluar_item"("stok_keluar_id");

-- CreateIndex
CREATE INDEX "t_stok_keluar_item_sparepart_id_idx" ON "t_stok_keluar_item"("sparepart_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_mutasi_stok_no_mutasi_key" ON "t_mutasi_stok"("no_mutasi");

-- CreateIndex
CREATE INDEX "t_mutasi_stok_lokasi_asal_id_idx" ON "t_mutasi_stok"("lokasi_asal_id");

-- CreateIndex
CREATE INDEX "t_mutasi_stok_lokasi_tujuan_id_idx" ON "t_mutasi_stok"("lokasi_tujuan_id");

-- CreateIndex
CREATE INDEX "t_mutasi_stok_penanggung_jawab_id_idx" ON "t_mutasi_stok"("penanggung_jawab_id");

-- CreateIndex
CREATE INDEX "t_mutasi_stok_item_mutasi_stok_id_idx" ON "t_mutasi_stok_item"("mutasi_stok_id");

-- CreateIndex
CREATE INDEX "t_mutasi_stok_item_sparepart_id_idx" ON "t_mutasi_stok_item"("sparepart_id");

-- CreateIndex
CREATE INDEX "t_stok_ledger_sparepart_id_idx" ON "t_stok_ledger"("sparepart_id");

-- CreateIndex
CREATE INDEX "t_stok_ledger_lokasi_id_idx" ON "t_stok_ledger"("lokasi_id");

-- CreateIndex
CREATE INDEX "t_stok_ledger_ref_tipe_ref_id_idx" ON "t_stok_ledger"("ref_tipe", "ref_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_invoice_no_invoice_key" ON "t_invoice"("no_invoice");

-- CreateIndex
CREATE UNIQUE INDEX "t_invoice_work_order_id_key" ON "t_invoice"("work_order_id");

-- CreateIndex
CREATE INDEX "t_invoice_pelanggan_id_idx" ON "t_invoice"("pelanggan_id");

-- CreateIndex
CREATE INDEX "t_invoice_kendaraan_id_idx" ON "t_invoice"("kendaraan_id");

-- CreateIndex
CREATE INDEX "t_invoice_item_invoice_id_idx" ON "t_invoice_item"("invoice_id");

-- CreateIndex
CREATE INDEX "t_invoice_item_jasa_servis_id_idx" ON "t_invoice_item"("jasa_servis_id");

-- CreateIndex
CREATE INDEX "t_invoice_item_sparepart_id_idx" ON "t_invoice_item"("sparepart_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_pembayaran_no_pembayaran_key" ON "t_pembayaran"("no_pembayaran");

-- CreateIndex
CREATE INDEX "t_pembayaran_invoice_id_idx" ON "t_pembayaran"("invoice_id");

-- CreateIndex
CREATE INDEX "t_pembayaran_pelanggan_id_idx" ON "t_pembayaran"("pelanggan_id");

-- CreateIndex
CREATE INDEX "t_pembayaran_metode_pembayaran_id_idx" ON "t_pembayaran"("metode_pembayaran_id");

-- CreateIndex
CREATE INDEX "t_pembayaran_akun_kas_bank_id_idx" ON "t_pembayaran"("akun_kas_bank_id");

-- CreateIndex
CREATE INDEX "t_pembayaran_kasir_id_idx" ON "t_pembayaran"("kasir_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_piutang_invoice_id_key" ON "t_piutang"("invoice_id");

-- CreateIndex
CREATE INDEX "t_piutang_pelanggan_id_idx" ON "t_piutang"("pelanggan_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_kas_bank_no_transaksi_key" ON "t_kas_bank"("no_transaksi");

-- CreateIndex
CREATE INDEX "t_kas_bank_akun_kas_bank_id_idx" ON "t_kas_bank"("akun_kas_bank_id");

-- CreateIndex
CREATE INDEX "t_kas_bank_created_by_id_idx" ON "t_kas_bank"("created_by_id");

-- CreateIndex
CREATE INDEX "t_kas_bank_ref_tipe_ref_id_idx" ON "t_kas_bank"("ref_tipe", "ref_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_kendaraan" ADD CONSTRAINT "m_kendaraan_pelanggan_id_fkey" FOREIGN KEY ("pelanggan_id") REFERENCES "m_pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_kendaraan" ADD CONSTRAINT "m_kendaraan_merk_id_fkey" FOREIGN KEY ("merk_id") REFERENCES "m_merk_kendaraan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_sparepart" ADD CONSTRAINT "m_sparepart_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "m_kategori_sparepart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_sparepart" ADD CONSTRAINT "m_sparepart_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "m_supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_sparepart" ADD CONSTRAINT "m_sparepart_satuan_id_fkey" FOREIGN KEY ("satuan_id") REFERENCES "m_satuan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_sparepart" ADD CONSTRAINT "m_sparepart_lokasi_id_fkey" FOREIGN KEY ("lokasi_id") REFERENCES "m_lokasi_stok"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_jasa_servis" ADD CONSTRAINT "m_jasa_servis_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "m_kategori_jasa_servis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_paket_servis_jasa" ADD CONSTRAINT "m_paket_servis_jasa_paket_servis_id_fkey" FOREIGN KEY ("paket_servis_id") REFERENCES "m_paket_servis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_paket_servis_jasa" ADD CONSTRAINT "m_paket_servis_jasa_jasa_servis_id_fkey" FOREIGN KEY ("jasa_servis_id") REFERENCES "m_jasa_servis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_paket_servis_sparepart" ADD CONSTRAINT "m_paket_servis_sparepart_paket_servis_id_fkey" FOREIGN KEY ("paket_servis_id") REFERENCES "m_paket_servis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_paket_servis_sparepart" ADD CONSTRAINT "m_paket_servis_sparepart_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_jadwal_servis" ADD CONSTRAINT "t_jadwal_servis_pelanggan_id_fkey" FOREIGN KEY ("pelanggan_id") REFERENCES "m_pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_jadwal_servis" ADD CONSTRAINT "t_jadwal_servis_kendaraan_id_fkey" FOREIGN KEY ("kendaraan_id") REFERENCES "m_kendaraan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_jadwal_servis" ADD CONSTRAINT "t_jadwal_servis_jasa_servis_id_fkey" FOREIGN KEY ("jasa_servis_id") REFERENCES "m_jasa_servis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_jadwal_servis" ADD CONSTRAINT "t_jadwal_servis_mekanik_id_fkey" FOREIGN KEY ("mekanik_id") REFERENCES "m_mekanik"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_jadwal_servis" ADD CONSTRAINT "t_jadwal_servis_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_work_order" ADD CONSTRAINT "t_work_order_pelanggan_id_fkey" FOREIGN KEY ("pelanggan_id") REFERENCES "m_pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_work_order" ADD CONSTRAINT "t_work_order_kendaraan_id_fkey" FOREIGN KEY ("kendaraan_id") REFERENCES "m_kendaraan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_work_order" ADD CONSTRAINT "t_work_order_mekanik_id_fkey" FOREIGN KEY ("mekanik_id") REFERENCES "m_mekanik"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_work_order" ADD CONSTRAINT "t_work_order_paket_servis_id_fkey" FOREIGN KEY ("paket_servis_id") REFERENCES "m_paket_servis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_work_order" ADD CONSTRAINT "t_work_order_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_work_order_jasa" ADD CONSTRAINT "t_work_order_jasa_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "t_work_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_work_order_jasa" ADD CONSTRAINT "t_work_order_jasa_jasa_servis_id_fkey" FOREIGN KEY ("jasa_servis_id") REFERENCES "m_jasa_servis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_work_order_sparepart" ADD CONSTRAINT "t_work_order_sparepart_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "t_work_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_work_order_sparepart" ADD CONSTRAINT "t_work_order_sparepart_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_reminder_servis" ADD CONSTRAINT "t_reminder_servis_pelanggan_id_fkey" FOREIGN KEY ("pelanggan_id") REFERENCES "m_pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_reminder_servis" ADD CONSTRAINT "t_reminder_servis_kendaraan_id_fkey" FOREIGN KEY ("kendaraan_id") REFERENCES "m_kendaraan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_purchase_order" ADD CONSTRAINT "t_purchase_order_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "m_supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_purchase_order_item" ADD CONSTRAINT "t_purchase_order_item_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "t_purchase_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_purchase_order_item" ADD CONSTRAINT "t_purchase_order_item_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_penerimaan_barang" ADD CONSTRAINT "t_penerimaan_barang_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "t_purchase_order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_penerimaan_barang" ADD CONSTRAINT "t_penerimaan_barang_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "m_supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_penerimaan_barang" ADD CONSTRAINT "t_penerimaan_barang_diterima_oleh_id_fkey" FOREIGN KEY ("diterima_oleh_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_penerimaan_barang_item" ADD CONSTRAINT "t_penerimaan_barang_item_penerimaan_barang_id_fkey" FOREIGN KEY ("penerimaan_barang_id") REFERENCES "t_penerimaan_barang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_penerimaan_barang_item" ADD CONSTRAINT "t_penerimaan_barang_item_purchase_order_item_id_fkey" FOREIGN KEY ("purchase_order_item_id") REFERENCES "t_purchase_order_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_penerimaan_barang_item" ADD CONSTRAINT "t_penerimaan_barang_item_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_penerimaan_barang_item" ADD CONSTRAINT "t_penerimaan_barang_item_kondisi_barang_id_fkey" FOREIGN KEY ("kondisi_barang_id") REFERENCES "m_kondisi_barang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_retur_pembelian" ADD CONSTRAINT "t_retur_pembelian_penerimaan_barang_id_fkey" FOREIGN KEY ("penerimaan_barang_id") REFERENCES "t_penerimaan_barang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_retur_pembelian" ADD CONSTRAINT "t_retur_pembelian_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "m_supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_retur_pembelian" ADD CONSTRAINT "t_retur_pembelian_alasan_retur_id_fkey" FOREIGN KEY ("alasan_retur_id") REFERENCES "m_alasan_retur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_retur_pembelian_item" ADD CONSTRAINT "t_retur_pembelian_item_retur_pembelian_id_fkey" FOREIGN KEY ("retur_pembelian_id") REFERENCES "t_retur_pembelian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_retur_pembelian_item" ADD CONSTRAINT "t_retur_pembelian_item_penerimaan_barang_item_id_fkey" FOREIGN KEY ("penerimaan_barang_item_id") REFERENCES "t_penerimaan_barang_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_retur_pembelian_item" ADD CONSTRAINT "t_retur_pembelian_item_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_retur_pembelian_item" ADD CONSTRAINT "t_retur_pembelian_item_alasan_retur_id_fkey" FOREIGN KEY ("alasan_retur_id") REFERENCES "m_alasan_retur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_stok_masuk" ADD CONSTRAINT "t_stok_masuk_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "m_supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_stok_masuk_item" ADD CONSTRAINT "t_stok_masuk_item_stok_masuk_id_fkey" FOREIGN KEY ("stok_masuk_id") REFERENCES "t_stok_masuk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_stok_masuk_item" ADD CONSTRAINT "t_stok_masuk_item_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_stok_keluar" ADD CONSTRAINT "t_stok_keluar_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "t_work_order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_stok_keluar_item" ADD CONSTRAINT "t_stok_keluar_item_stok_keluar_id_fkey" FOREIGN KEY ("stok_keluar_id") REFERENCES "t_stok_keluar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_stok_keluar_item" ADD CONSTRAINT "t_stok_keluar_item_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_mutasi_stok" ADD CONSTRAINT "t_mutasi_stok_lokasi_asal_id_fkey" FOREIGN KEY ("lokasi_asal_id") REFERENCES "m_lokasi_stok"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_mutasi_stok" ADD CONSTRAINT "t_mutasi_stok_lokasi_tujuan_id_fkey" FOREIGN KEY ("lokasi_tujuan_id") REFERENCES "m_lokasi_stok"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_mutasi_stok" ADD CONSTRAINT "t_mutasi_stok_penanggung_jawab_id_fkey" FOREIGN KEY ("penanggung_jawab_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_mutasi_stok_item" ADD CONSTRAINT "t_mutasi_stok_item_mutasi_stok_id_fkey" FOREIGN KEY ("mutasi_stok_id") REFERENCES "t_mutasi_stok"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_mutasi_stok_item" ADD CONSTRAINT "t_mutasi_stok_item_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_stok_ledger" ADD CONSTRAINT "t_stok_ledger_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_stok_ledger" ADD CONSTRAINT "t_stok_ledger_lokasi_id_fkey" FOREIGN KEY ("lokasi_id") REFERENCES "m_lokasi_stok"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_invoice" ADD CONSTRAINT "t_invoice_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "t_work_order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_invoice" ADD CONSTRAINT "t_invoice_pelanggan_id_fkey" FOREIGN KEY ("pelanggan_id") REFERENCES "m_pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_invoice" ADD CONSTRAINT "t_invoice_kendaraan_id_fkey" FOREIGN KEY ("kendaraan_id") REFERENCES "m_kendaraan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_invoice_item" ADD /*  */CONSTRAINT "t_invoice_item_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "t_invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_invoice_item" ADD CONSTRAINT "t_invoice_item_jasa_servis_id_fkey" FOREIGN KEY ("jasa_servis_id") REFERENCES "m_jasa_servis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_invoice_item" ADD CONSTRAINT "t_invoice_item_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "m_sparepart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_pembayaran" ADD CONSTRAINT "t_pembayaran_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "t_invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_pembayaran" ADD CONSTRAINT "t_pembayaran_pelanggan_id_fkey" FOREIGN KEY ("pelanggan_id") REFERENCES "m_pelanggan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_pembayaran" ADD CONSTRAINT "t_pembayaran_metode_pembayaran_id_fkey" FOREIGN KEY ("metode_pembayaran_id") REFERENCES "m_metode_pembayaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_pembayaran" ADD CONSTRAINT "t_pembayaran_akun_kas_bank_id_fkey" FOREIGN KEY ("akun_kas_bank_id") REFERENCES "m_akun_kas_bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_pembayaran" ADD CONSTRAINT "t_pembayaran_kasir_id_fkey" FOREIGN KEY ("kasir_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_piutang" ADD CONSTRAINT "t_piutang_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "t_invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_piutang" ADD CONSTRAINT "t_piutang_pelanggan_id_fkey" FOREIGN KEY ("pelanggan_id") REFERENCES "m_pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_kas_bank" ADD CONSTRAINT "t_kas_bank_akun_kas_bank_id_fkey" FOREIGN KEY ("akun_kas_bank_id") REFERENCES "m_akun_kas_bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_kas_bank" ADD CONSTRAINT "t_kas_bank_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SparepartList from "@/components/bengkel/inventory/SparepartList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";

export const metadata: Metadata = {
  title: "Daftar Sparepart | Auto7",
  description: "Daftar sparepart inventory bengkel",
};

export default async function SparepartPage() {
  const [spareparts, kategori, suppliers, satuan, lokasi] = await Promise.all([
    prisma.sparepart.findMany({
      orderBy: {
        kode: "asc",
      },
      select: {
        id: true,
        kode: true,
        nama: true,
        kategoriId: true,
        supplierId: true,
        satuanId: true,
        lokasiId: true,
        stok: true,
        minStok: true,
        hargaBeli: true,
        hargaJual: true,
        kategori: {
          select: {
            nama: true,
          },
        },
        supplier: {
          select: {
            nama: true,
          },
        },
        satuan: {
          select: {
            nama: true,
          },
        },
        lokasi: {
          select: {
            nama: true,
          },
        },
        stokLedger: {
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            tanggal: true,
            tipe: true,
            qtyMasuk: true,
            qtyKeluar: true,
            refNo: true,
            catatan: true,
          },
        },
      },
    }),
    prisma.kategoriSparepart.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
      },
    }),
    prisma.supplier.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
      },
    }),
    prisma.satuan.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
      },
    }),
    prisma.lokasiStok.findMany({
      where: {
        status: "AKTIF",
      },
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
      },
    }),
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Sparepart" />
      <SparepartList
        nextCode={getNextSystemCode(
          spareparts.map((item) => item.kode),
          "SPR"
        )}
        kategoriOptions={kategori.map((item) => ({ value: item.id, label: item.nama }))}
        supplierOptions={suppliers.map((item) => ({ value: item.id, label: item.nama }))}
        satuanOptions={satuan.map((item) => ({ value: item.id, label: item.nama }))}
        lokasiOptions={lokasi.map((item) => ({ value: item.id, label: item.nama }))}
        spareparts={spareparts.map((item) => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          kategoriId: item.kategoriId ?? "",
          kategori: item.kategori?.nama ?? "",
          supplierId: item.supplierId ?? "",
          supplier: item.supplier?.nama ?? "",
          stok: item.stok,
          satuanId: item.satuanId ?? "",
          satuan: item.satuan?.nama ?? "",
          minStok: item.minStok,
          hargaBeli: Number(item.hargaBeli),
          hargaJual: Number(item.hargaJual),
          lokasiId: item.lokasiId ?? "",
          lokasi: item.lokasi?.nama ?? "",
          mutasiTerakhir: item.stokLedger.map((ledger) => ({
            tanggal: ledger.tanggal.toISOString(),
            tipe: ledger.tipe === "MASUK" ? "Masuk" : "Keluar",
            qty: Number(ledger.tipe === "MASUK" ? ledger.qtyMasuk : ledger.qtyKeluar),
            keterangan: ledger.refNo ?? ledger.catatan ?? "-",
          })),
        }))}
      />
    </div>
  );
}

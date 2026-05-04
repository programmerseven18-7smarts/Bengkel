"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { createStokKeluarManualAction } from "@/lib/inventory/actions";

type SparepartOption = {
  value: string;
  label: string;
  nama: string;
  stok: number;
  satuan: string;
  hargaModal: number;
};

interface StokKeluarItem {
  id: number;
  sparepartId: string;
  namaSparepart: string;
  stok: number;
  qtyKeluar: number;
  satuan: string;
  hargaModal: number;
  catatan: string;
}

type StokKeluarCreateFormProps = {
  nextNumber: string;
  today: string;
  spareparts: SparepartOption[];
};

const tipeOptions = [
  { value: "SERVIS", label: "Servis" },
  { value: "PENJUALAN", label: "Penjualan" },
  { value: "RETUR", label: "Retur" },
  { value: "LAINNYA", label: "Lainnya" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyRow = (): StokKeluarItem => ({
  id: Date.now(),
  sparepartId: "",
  namaSparepart: "",
  stok: 0,
  qtyKeluar: 1,
  satuan: "",
  hargaModal: 0,
  catatan: "",
});

export default function StokKeluarCreateForm({
  nextNumber,
  today,
  spareparts,
}: StokKeluarCreateFormProps) {
  const [tipe, setTipe] = useState("SERVIS");
  const [rows, setRows] = useState<StokKeluarItem[]>([{ ...emptyRow(), id: 1 }]);

  const sparepartMap = useMemo(
    () => new Map(spareparts.map((item) => [item.value, item])),
    [spareparts]
  );
  const itemPayload = useMemo(
    () =>
      rows.map((row) => ({
        sparepartId: row.sparepartId,
        namaSparepart: row.namaSparepart,
        stok: row.stok,
        qtyKeluar: row.qtyKeluar,
        satuan: row.satuan,
        hargaModal: row.hargaModal,
        catatan: row.catatan,
      })),
    [rows]
  );
  const total = useMemo(
    () => rows.reduce((sum, item) => sum + item.qtyKeluar * item.hargaModal, 0),
    [rows]
  );

  const updateRow = (id: number, patch: Partial<StokKeluarItem>) => {
    setRows((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const selectSparepart = (id: number, value: string) => {
    const sparepart = sparepartMap.get(value);
    if (!sparepart) return;

    updateRow(id, {
      sparepartId: sparepart.value,
      namaSparepart: sparepart.nama,
      stok: sparepart.stok,
      satuan: sparepart.satuan,
      hargaModal: sparepart.hargaModal,
    });
  };

  return (
    <form action={createStokKeluarManualAction} className="min-w-0 space-y-6">
      <input type="hidden" name="tipe" value={tipe} />
      <input type="hidden" name="items" value={JSON.stringify(itemPayload)} />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informasi Stok Keluar
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Catat sparepart yang keluar dari stok bengkel.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="No. Transaksi">
            <Input defaultValue={nextNumber} readOnly />
          </Field>
          <Field label="Tanggal">
            <Input name="tanggal" type="date" defaultValue={today} readOnly />
          </Field>
          <Field label="Tipe Keluar">
            <Select
              options={tipeOptions}
              placeholder="Pilih tipe"
              defaultValue={tipe}
              onChange={setTipe}
            />
          </Field>
          <Field label="Referensi">
            <Input name="referensi" placeholder="WO / invoice / dokumen" />
          </Field>
          <Field label="Diminta Oleh">
            <Input name="dimintaOleh" placeholder="Nama peminta" />
          </Field>
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Catatan">
              <Input name="catatan" placeholder="Catatan stok keluar" />
            </Field>
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Detail Stok Keluar
          </h2>
        </div>
        <div className="w-full overflow-x-auto p-5">
          <table className="w-full min-w-[980px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr>
                <Th className="w-16">No</Th>
                <Th className="w-28">Aksi</Th>
                <Th className="w-[320px]">Sparepart</Th>
                <Th className="w-28">Stok</Th>
                <Th className="w-32">Qty Keluar</Th>
                <Th className="w-28">Satuan</Th>
                <Th className="w-40">Harga Modal</Th>
                <Th className="w-40">Subtotal</Th>
                <Th className="w-56">Catatan</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-transparent"
                >
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setRows((items) => items.filter((item) => item.id !== row.id))
                      }
                      className="rounded-lg border border-error-300 px-4 py-2 text-sm font-medium text-error-500 hover:bg-error-50 dark:border-error-500/40 dark:hover:bg-error-500/10"
                    >
                      Hapus
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      options={spareparts}
                      placeholder="Pilih sparepart"
                      defaultValue={row.sparepartId}
                      onChange={(value) => selectSparepart(row.id, value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.stok} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="1"
                      max={`${row.stok}`}
                      value={row.qtyKeluar}
                      onChange={(event) =>
                        updateRow(row.id, { qtyKeluar: Number(event.target.value) })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.satuan} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.hargaModal} readOnly />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(row.qtyKeluar * row.hargaModal)}
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={row.catatan}
                      placeholder="Catatan item"
                      onChange={(event) =>
                        updateRow(row.id, { catatan: event.target.value })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => setRows((items) => [...items, emptyRow()])}
            className="mt-4 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-white/90"
          >
            + Tambah Sparepart Keluar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Nilai Stok Keluar
            </span>
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/inventory/stok-keluar">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Batalkan
              </Button>
            </Link>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Simpan Stok Keluar
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th className={`${className} px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400`}>
      {children}
    </th>
  );
}

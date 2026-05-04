"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { createStokMasukAction } from "@/lib/inventory/actions";

type Option = {
  value: string;
  label: string;
};

type SparepartOption = {
  value: string;
  label: string;
  nama: string;
  satuan: string;
  hargaModal: number;
};

interface StokMasukItem {
  id: number;
  sparepartId: string;
  namaSparepart: string;
  qtyMasuk: number;
  satuan: string;
  hargaModal: number;
  catatan: string;
}

type StokMasukCreateFormProps = {
  nextNumber: string;
  today: string;
  suppliers: Option[];
  spareparts: SparepartOption[];
};

const sumberOptions = [
  { value: "Pembelian", label: "Pembelian" },
  { value: "Penyesuaian Stok", label: "Penyesuaian Stok" },
  { value: "Stok Awal", label: "Stok Awal" },
  { value: "Retur Servis", label: "Retur Servis" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyRow = (): StokMasukItem => ({
  id: Date.now(),
  sparepartId: "",
  namaSparepart: "",
  qtyMasuk: 1,
  satuan: "",
  hargaModal: 0,
  catatan: "",
});

export default function StokMasukCreateForm({
  nextNumber,
  today,
  suppliers,
  spareparts,
}: StokMasukCreateFormProps) {
  const [sumber, setSumber] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [rows, setRows] = useState<StokMasukItem[]>([{ ...emptyRow(), id: 1 }]);

  const sparepartMap = useMemo(
    () => new Map(spareparts.map((item) => [item.value, item])),
    [spareparts]
  );
  const itemPayload = useMemo(
    () =>
      rows.map((row) => ({
        sparepartId: row.sparepartId,
        namaSparepart: row.namaSparepart,
        qtyMasuk: row.qtyMasuk,
        satuan: row.satuan,
        hargaModal: row.hargaModal,
        catatan: row.catatan,
      })),
    [rows]
  );
  const total = useMemo(
    () => rows.reduce((sum, item) => sum + item.qtyMasuk * item.hargaModal, 0),
    [rows]
  );

  const updateRow = (id: number, patch: Partial<StokMasukItem>) => {
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
      satuan: sparepart.satuan,
      hargaModal: sparepart.hargaModal,
    });
  };

  return (
    <form action={createStokMasukAction} className="min-w-0 space-y-6">
      <input type="hidden" name="sumber" value={sumber} />
      <input type="hidden" name="supplierId" value={supplierId} />
      <input type="hidden" name="items" value={JSON.stringify(itemPayload)} />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informasi Stok Masuk
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Catat penambahan stok sparepart ke inventory bengkel.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="No. Transaksi">
            <Input defaultValue={nextNumber} readOnly />
          </Field>
          <Field label="Tanggal">
            <Input name="tanggal" type="date" defaultValue={today} readOnly />
          </Field>
          <Field label="Sumber Masuk">
            <Select
              options={sumberOptions}
              placeholder="Pilih sumber"
              defaultValue={sumber}
              onChange={setSumber}
            />
          </Field>
          <Field label="Supplier">
            <Select
              options={suppliers}
              placeholder="Pilih supplier"
              defaultValue={supplierId}
              onChange={setSupplierId}
            />
          </Field>
          <Field label="Referensi">
            <Input name="referensi" placeholder="No. PO / dokumen sumber" />
          </Field>
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Catatan">
              <Input name="catatan" placeholder="Catatan stok masuk" />
            </Field>
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Detail Stok Masuk
          </h2>
        </div>
        <div className="w-full overflow-x-auto p-5">
          <table className="w-full min-w-[900px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr>
                <Th className="w-16">No</Th>
                <Th className="w-28">Aksi</Th>
                <Th className="w-[320px]">Sparepart</Th>
                <Th className="w-32">Qty Masuk</Th>
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
                    <Input
                      type="number"
                      min="1"
                      value={row.qtyMasuk}
                      onChange={(event) =>
                        updateRow(row.id, { qtyMasuk: Number(event.target.value) })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.satuan} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="0"
                      value={row.hargaModal}
                      onChange={(event) =>
                        updateRow(row.id, { hargaModal: Number(event.target.value) })
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(row.qtyMasuk * row.hargaModal)}
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
            + Tambah Sparepart Masuk
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Nilai Stok Masuk
            </span>
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/inventory/stok-masuk">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Batalkan
              </Button>
            </Link>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Simpan Stok Masuk
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

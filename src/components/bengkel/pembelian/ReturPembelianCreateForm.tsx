"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import {
  createReturPembelianAction,
  updateReturPembelianDraftAction,
} from "@/lib/pembelian/actions";

interface ReturItem {
  id: number;
  penerimaanBarangItemId: string;
  sparepartId: string;
  alasanReturId: string;
  namaSparepart: string;
  qtyDiterima: number;
  qtyRetur: number;
  satuan: string;
  hargaBeli: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface PenerimaanReturOption extends SelectOption {
  supplier: string;
  items: {
    penerimaanBarangItemId: string;
    sparepartId: string;
    namaSparepart: string;
    qtyDiterima: number;
    satuan: string;
    hargaBeli: number;
  }[];
}

interface ReturPembelianCreateFormProps {
  mode?: "create" | "edit";
  initialData?: {
    id: string;
    penerimaanBarangId: string;
    supplier: string;
    alasanReturId: string;
    catatan: string;
    rows: ReturItem[];
  };
  nextNumber: string;
  tanggalRetur: string;
  initialPenerimaanId?: string;
  penerimaanOptions: PenerimaanReturOption[];
  alasanOptions: SelectOption[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyRow = (alasanReturId = ""): ReturItem => ({
  id: Date.now(),
  penerimaanBarangItemId: "",
  sparepartId: "",
  alasanReturId,
  namaSparepart: "",
  qtyDiterima: 0,
  qtyRetur: 1,
  satuan: "",
  hargaBeli: 0,
});

const rowsFromPenerimaan = (
  penerimaan: PenerimaanReturOption | undefined,
  alasanReturId: string
) => {
  if (!penerimaan) return [emptyRow(alasanReturId)];

  return penerimaan.items.map((item, index) => ({
    id: index + 1,
    penerimaanBarangItemId: item.penerimaanBarangItemId,
    sparepartId: item.sparepartId,
    alasanReturId,
    namaSparepart: item.namaSparepart,
    qtyDiterima: item.qtyDiterima,
    qtyRetur: 1,
    satuan: item.satuan,
    hargaBeli: item.hargaBeli,
  }));
};

export default function ReturPembelianCreateForm({
  mode = "create",
  initialData,
  nextNumber,
  tanggalRetur,
  initialPenerimaanId = "",
  penerimaanOptions,
  alasanOptions,
}: ReturPembelianCreateFormProps) {
  const defaultAlasanId = alasanOptions[0]?.value ?? "";
  const initialPenerimaan = penerimaanOptions.find(
    (item) => item.value === (initialData?.penerimaanBarangId ?? initialPenerimaanId)
  );
  const [penerimaanBarangId, setPenerimaanBarangId] = useState(
    initialData?.penerimaanBarangId ?? initialPenerimaan?.value ?? ""
  );
  const [supplier, setSupplier] = useState(
    initialData?.supplier ?? initialPenerimaan?.supplier ?? ""
  );
  const [alasanReturId, setAlasanReturId] = useState(
    initialData?.alasanReturId ?? defaultAlasanId
  );
  const [rows, setRows] = useState<ReturItem[]>(
    initialData?.rows?.length
      ? initialData.rows
      : rowsFromPenerimaan(initialPenerimaan, initialData?.alasanReturId ?? defaultAlasanId)
  );

  const total = useMemo(
    () => rows.reduce((sum, item) => sum + item.qtyRetur * item.hargaBeli, 0),
    [rows]
  );
  const itemPayload = useMemo(
    () =>
      rows.map((item) => ({
        penerimaanBarangItemId: item.penerimaanBarangItemId,
        sparepartId: item.sparepartId,
        alasanReturId: item.alasanReturId || alasanReturId,
        namaSparepart: item.namaSparepart,
        qtyDiterima: item.qtyDiterima,
        qtyRetur: item.qtyRetur,
        satuan: item.satuan,
        hargaBeli: item.hargaBeli,
      })),
    [alasanReturId, rows]
  );
  const penerimaanMap = useMemo(
    () => new Map(penerimaanOptions.map((item) => [item.value, item])),
    [penerimaanOptions]
  );
  const selectedPenerimaan = penerimaanMap.get(penerimaanBarangId);
  const selectableItems = selectedPenerimaan?.items.map((item) => ({
    value: item.penerimaanBarangItemId,
    label: item.namaSparepart,
  })) ?? [];

  const updateRow = (id: number, patch: Partial<ReturItem>) => {
    setRows((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const selectPenerimaan = (value: string) => {
    const selected = penerimaanMap.get(value);
    setPenerimaanBarangId(value);
    setSupplier(selected?.supplier ?? "");
    setRows(rowsFromPenerimaan(selected, alasanReturId));
  };

  const selectPenerimaanItem = (id: number, value: string) => {
    const item = selectedPenerimaan?.items.find(
      (option) => option.penerimaanBarangItemId === value
    );
    if (!item) return;

    updateRow(id, {
      penerimaanBarangItemId: item.penerimaanBarangItemId,
      sparepartId: item.sparepartId,
      namaSparepart: item.namaSparepart,
      qtyDiterima: item.qtyDiterima,
      satuan: item.satuan,
      hargaBeli: item.hargaBeli,
    });
  };

  const updateDefaultAlasan = (value: string) => {
    setAlasanReturId(value);
    setRows((items) =>
      items.map((item) => ({
        ...item,
        alasanReturId: item.alasanReturId || value,
      }))
    );
  };

  return (
    <form
      action={
        mode === "edit" ? updateReturPembelianDraftAction : createReturPembelianAction
      }
      className="min-w-0 space-y-6"
    >
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="penerimaanBarangId" value={penerimaanBarangId} />
      <input type="hidden" name="alasanReturId" value={alasanReturId} />
      <input type="hidden" name="items" value={JSON.stringify(itemPayload)} />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informasi Retur Pembelian
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Catat sparepart yang dikembalikan ke supplier dari penerimaan barang.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              No. Retur
            </label>
            <Input defaultValue={nextNumber} readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tanggal Retur
            </label>
            <Input name="tanggalRetur" type="date" defaultValue={tanggalRetur} readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Referensi Penerimaan
            </label>
            <Select
              options={penerimaanOptions}
              placeholder="Pilih penerimaan"
              defaultValue={penerimaanBarangId}
              onChange={selectPenerimaan}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Supplier
            </label>
            <Input value={supplier} placeholder="Otomatis dari penerimaan" readOnly />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Alasan Utama
            </label>
            <Select
              options={alasanOptions}
              placeholder="Pilih alasan"
              defaultValue={alasanReturId}
              onChange={updateDefaultAlasan}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Catatan
            </label>
            <Input
              name="catatan"
              placeholder="Catatan retur untuk supplier"
              defaultValue={initialData?.catatan}
            />
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Detail Barang Diretur
          </h2>
        </div>
        <div className="w-full overflow-x-auto p-5">
          <table className="w-full min-w-[980px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr>
                <th className="w-16 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">No</th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Aksi</th>
                <th className="w-[320px] px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Sparepart</th>
                <th className="w-32 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Qty Terima</th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Qty Retur</th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Satuan</th>
                <th className="w-40 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Harga Beli</th>
                <th className="w-44 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Alasan Item</th>
                <th className="w-40 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-transparent">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setRows((items) => items.filter((item) => item.id !== row.id))}
                      className="rounded-lg border border-error-300 px-4 py-2 text-sm font-medium text-error-500 hover:bg-error-50 dark:border-error-500/40 dark:hover:bg-error-500/10"
                    >
                      Hapus
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {row.penerimaanBarangItemId ? (
                      <Input value={row.namaSparepart} readOnly />
                    ) : (
                      <Select
                        options={selectableItems}
                        placeholder="Pilih sparepart"
                        defaultValue={row.penerimaanBarangItemId}
                        onChange={(value) => selectPenerimaanItem(row.id, value)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.qtyDiterima} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="1"
                      max={`${row.qtyDiterima}`}
                      value={row.qtyRetur}
                      onChange={(event) =>
                        updateRow(row.id, {
                          qtyRetur: Number(event.target.value),
                        })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.satuan} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.hargaBeli} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      options={alasanOptions}
                      placeholder="Alasan"
                      defaultValue={row.alasanReturId}
                      onChange={(value) =>
                        updateRow(row.id, {
                          alasanReturId: value,
                        })
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(row.qtyRetur * row.hargaBeli)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => setRows((items) => [...items, emptyRow(alasanReturId)])}
            className="mt-4 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-white/90"
          >
            + Tambah Barang Retur
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Nilai Retur</span>
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">{formatCurrency(total)}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/pembelian/retur-pembelian">
              <Button type="button" variant="outline" className="w-full sm:w-auto">Batalkan</Button>
            </Link>
            <Button
              type="submit"
              name="intent"
              value="draft"
              variant="outline"
              className="w-full border-warning-300 text-warning-600 sm:w-auto"
            >
              Simpan Draft
            </Button>
            <Button
              type="submit"
              name="intent"
              value="post"
              variant="primary"
              className="w-full sm:w-auto"
            >
              {mode === "edit" ? "Post Retur" : "Kirim Retur"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

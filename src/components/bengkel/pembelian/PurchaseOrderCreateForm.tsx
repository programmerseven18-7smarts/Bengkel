"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import {
  createPurchaseOrderAction,
  updatePurchaseOrderDraftAction,
} from "@/lib/pembelian/actions";

interface PurchaseOrderItem {
  id: number;
  sparepartId: string;
  namaSparepart: string;
  stokSaatIni: number;
  qtyPesan: number;
  satuan: string;
  hargaBeli: number;
  catatan: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SparepartOption extends SelectOption {
  nama: string;
  stok: number;
  satuan: string;
  hargaBeli: number;
}

interface PurchaseOrderCreateFormProps {
  mode?: "create" | "edit";
  initialData?: {
    id: string;
    supplierId: string;
    catatan: string;
    rows: PurchaseOrderItem[];
  };
  nextNumber: string;
  tanggal: string;
  estimasiDatang: string;
  supplierOptions: SelectOption[];
  sparepartOptions: SparepartOption[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyRow = (): PurchaseOrderItem => ({
  id: Date.now(),
  sparepartId: "",
  namaSparepart: "",
  stokSaatIni: 0,
  qtyPesan: 1,
  satuan: "",
  hargaBeli: 0,
  catatan: "",
});

export default function PurchaseOrderCreateForm({
  mode = "create",
  initialData,
  nextNumber,
  tanggal,
  estimasiDatang,
  supplierOptions,
  sparepartOptions,
}: PurchaseOrderCreateFormProps) {
  const [supplierId, setSupplierId] = useState(initialData?.supplierId ?? "");
  const [rows, setRows] = useState<PurchaseOrderItem[]>([
    ...(initialData?.rows?.length ? initialData.rows : [{ ...emptyRow(), id: 1 }]),
  ]);

  const total = useMemo(
    () => rows.reduce((amount, row) => amount + row.qtyPesan * row.hargaBeli, 0),
    [rows]
  );
  const itemPayload = useMemo(
    () =>
      rows.map((item) => ({
        sparepartId: item.sparepartId,
        namaSparepart: item.namaSparepart,
        stokSaatIni: item.stokSaatIni,
        qtyPesan: item.qtyPesan,
        satuan: item.satuan,
        hargaBeli: item.hargaBeli,
        catatan: item.catatan,
      })),
    [rows]
  );
  const sparepartMap = useMemo(
    () => new Map(sparepartOptions.map((item) => [item.value, item])),
    [sparepartOptions]
  );

  const updateRow = (id: number, patch: Partial<PurchaseOrderItem>) => {
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
      stokSaatIni: sparepart.stok,
      satuan: sparepart.satuan,
      hargaBeli: sparepart.hargaBeli,
    });
  };

  return (
    <form
      action={
        mode === "edit" ? updatePurchaseOrderDraftAction : createPurchaseOrderAction
      }
      className="min-w-0 space-y-6"
    >
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="supplierId" value={supplierId} />
      <input type="hidden" name="items" value={JSON.stringify(itemPayload)} />

      <div className="min-w-0 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Informasi Pembelian Sparepart
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Data pesanan sparepart ke supplier untuk kebutuhan stok bengkel.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-warning-50 px-3 py-1 text-xs font-medium text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">
              {mode === "edit" ? "Edit Draft" : "Draft PO"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              No. PO
            </label>
            <Input defaultValue={nextNumber} readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tanggal PO
            </label>
            <Input name="tanggal" type="date" defaultValue={tanggal} readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Supplier
            </label>
            <Select
              options={supplierOptions}
              placeholder="Pilih supplier"
              defaultValue={supplierId}
              onChange={setSupplierId}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Estimasi Datang
            </label>
            <Input name="estimasiDatang" type="date" defaultValue={estimasiDatang} />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Catatan Pembelian
            </label>
            <Input
              name="catatan"
              placeholder="Catatan untuk supplier atau penerimaan barang"
              defaultValue={initialData?.catatan}
            />
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Sparepart Dipesan
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tambahkan sparepart yang perlu dipesan, jumlah pesanan, dan harga beli.
          </p>
        </div>
        <div className="w-full overflow-x-auto p-5">
          <table className="w-full min-w-[980px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr>
                <th className="w-16 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  No
                </th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Aksi
                </th>
                <th className="w-[360px] px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Sparepart
                </th>
                <th className="w-24 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Stok
                </th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Qty Pesan
                </th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Satuan
                </th>
                <th className="w-40 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Harga Beli
                </th>
                <th className="w-40 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Subtotal
                </th>
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
                      options={sparepartOptions}
                      placeholder="Pilih sparepart"
                      defaultValue={row.sparepartId}
                      onChange={(value) => selectSparepart(row.id, value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.stokSaatIni} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="1"
                      value={row.qtyPesan}
                      onChange={(event) =>
                        updateRow(row.id, {
                          qtyPesan: Number(event.target.value),
                        })
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
                      value={row.hargaBeli}
                      onChange={(event) =>
                        updateRow(row.id, {
                          hargaBeli: Number(event.target.value),
                        })
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(row.qtyPesan * row.hargaBeli)}
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
            + Tambah Sparepart ke PO
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Grand Total
            </span>
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/pembelian/purchase-order">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Batalkan
              </Button>
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
              {mode === "edit" ? "Post Purchase Order" : "Kirim Purchase Order"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

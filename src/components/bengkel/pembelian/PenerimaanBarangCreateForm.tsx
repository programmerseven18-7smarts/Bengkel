"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import {
  createPenerimaanBarangAction,
  updatePenerimaanBarangDraftAction,
} from "@/lib/pembelian/actions";

interface PenerimaanItem {
  id: number;
  purchaseOrderItemId: string;
  sparepartId: string;
  kondisiBarangId: string;
  namaSparepart: string;
  qtyPo: number;
  qtyTerima: number;
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

export interface PurchaseOrderReceiveOption extends SelectOption {
  supplier: string;
  supplierId: string;
  items: {
    purchaseOrderItemId: string;
    sparepartId: string;
    namaSparepart: string;
    qtyPesan: number;
    qtyDiterima: number;
    satuan: string;
    hargaBeli: number;
  }[];
}

interface PenerimaanBarangCreateFormProps {
  mode?: "create" | "edit";
  initialData?: {
    id: string;
    purchaseOrderId: string;
    supplier: string;
    catatan: string;
    rows: PenerimaanItem[];
  };
  nextNumber: string;
  tanggalTerima: string;
  currentUserName: string;
  initialPurchaseOrderId?: string;
  purchaseOrders: PurchaseOrderReceiveOption[];
  sparepartOptions: SparepartOption[];
  kondisiOptions: SelectOption[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyRow = (kondisiBarangId = ""): PenerimaanItem => ({
  id: Date.now(),
  purchaseOrderItemId: "",
  sparepartId: "",
  kondisiBarangId,
  namaSparepart: "",
  qtyPo: 0,
  qtyTerima: 1,
  satuan: "",
  hargaBeli: 0,
  catatan: "",
});

const rowsFromPurchaseOrder = (
  purchaseOrder: PurchaseOrderReceiveOption | undefined,
  kondisiBarangId: string
) => {
  if (!purchaseOrder) return [emptyRow(kondisiBarangId)];

  const rows = purchaseOrder.items
    .map((item, index) => {
      const remaining = Math.max(item.qtyPesan - item.qtyDiterima, 0);

      return {
        id: index + 1,
        purchaseOrderItemId: item.purchaseOrderItemId,
        sparepartId: item.sparepartId,
        kondisiBarangId,
        namaSparepart: item.namaSparepart,
        qtyPo: remaining,
        qtyTerima: remaining || 1,
        satuan: item.satuan,
        hargaBeli: item.hargaBeli,
        catatan: "",
      };
    })
    .filter((item) => item.qtyPo > 0);

  return rows.length > 0 ? rows : [emptyRow(kondisiBarangId)];
};

export default function PenerimaanBarangCreateForm({
  mode = "create",
  initialData,
  nextNumber,
  tanggalTerima,
  currentUserName,
  initialPurchaseOrderId = "",
  purchaseOrders,
  sparepartOptions,
  kondisiOptions,
}: PenerimaanBarangCreateFormProps) {
  const defaultKondisiId = kondisiOptions[0]?.value ?? "";
  const initialPo = purchaseOrders.find(
    (item) => item.value === (initialData?.purchaseOrderId ?? initialPurchaseOrderId)
  );
  const [purchaseOrderId, setPurchaseOrderId] = useState(
    initialData?.purchaseOrderId ?? initialPo?.value ?? ""
  );
  const [supplier, setSupplier] = useState(
    initialData?.supplier ?? initialPo?.supplier ?? ""
  );
  const [rows, setRows] = useState<PenerimaanItem[]>(
    initialData?.rows?.length
      ? initialData.rows
      : rowsFromPurchaseOrder(initialPo, defaultKondisiId)
  );

  const total = useMemo(
    () => rows.reduce((sum, item) => sum + item.qtyTerima * item.hargaBeli, 0),
    [rows]
  );
  const itemPayload = useMemo(
    () =>
      rows.map((item) => ({
        purchaseOrderItemId: item.purchaseOrderItemId,
        sparepartId: item.sparepartId,
        kondisiBarangId: item.kondisiBarangId,
        namaSparepart: item.namaSparepart,
        qtyPo: item.qtyPo,
        qtyTerima: item.qtyTerima,
        satuan: item.satuan,
        hargaBeli: item.hargaBeli,
        catatan: item.catatan,
      })),
    [rows]
  );
  const poMap = useMemo(
    () => new Map(purchaseOrders.map((item) => [item.value, item])),
    [purchaseOrders]
  );
  const sparepartMap = useMemo(
    () => new Map(sparepartOptions.map((item) => [item.value, item])),
    [sparepartOptions]
  );

  const updateRow = (id: number, patch: Partial<PenerimaanItem>) => {
    setRows((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const selectPo = (value: string) => {
    const selectedPo = poMap.get(value);
    setPurchaseOrderId(value);
    setSupplier(selectedPo?.supplier ?? "");
    setRows(rowsFromPurchaseOrder(selectedPo, defaultKondisiId));
  };

  const selectSparepart = (id: number, value: string) => {
    const sparepart = sparepartMap.get(value);
    if (!sparepart) return;

    updateRow(id, {
      sparepartId: sparepart.value,
      namaSparepart: sparepart.nama,
      qtyPo: 0,
      qtyTerima: 1,
      satuan: sparepart.satuan,
      hargaBeli: sparepart.hargaBeli,
    });
  };

  return (
    <form
      action={
        mode === "edit"
          ? updatePenerimaanBarangDraftAction
          : createPenerimaanBarangAction
      }
      className="min-w-0 space-y-6"
    >
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="purchaseOrderId" value={purchaseOrderId} />
      <input type="hidden" name="items" value={JSON.stringify(itemPayload)} />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informasi Penerimaan
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Catat barang yang benar-benar diterima dari supplier.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              No. Penerimaan
            </label>
            <Input defaultValue={nextNumber} readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tanggal Terima
            </label>
            <Input
              name="tanggalTerima"
              type="date"
              defaultValue={tanggalTerima}
              readOnly
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Referensi PO
            </label>
            <Select
              options={purchaseOrders}
              placeholder="Pilih PO"
              defaultValue={purchaseOrderId}
              onChange={selectPo}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Supplier
            </label>
            <Input value={supplier} placeholder="Otomatis dari PO" readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Diterima Oleh
            </label>
            <Input value={currentUserName} placeholder="User login" readOnly />
          </div>
          <div className="md:col-span-2 xl:col-span-3">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Catatan
            </label>
            <Input
              name="catatan"
              placeholder="Catatan penerimaan barang"
              defaultValue={initialData?.catatan}
            />
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Detail Barang Diterima
          </h2>
        </div>
        <div className="w-full overflow-x-auto p-5">
          <table className="w-full min-w-[1120px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr>
                <th className="w-16 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  No
                </th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Aksi
                </th>
                <th className="w-[300px] px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Sparepart
                </th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Sisa PO
                </th>
                <th className="w-32 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Qty Terima
                </th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Satuan
                </th>
                <th className="w-40 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Harga Beli
                </th>
                <th className="w-40 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Kondisi
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
                    {row.purchaseOrderItemId ? (
                      <Input value={row.namaSparepart} readOnly />
                    ) : (
                      <Select
                        options={sparepartOptions}
                        placeholder="Pilih sparepart"
                        defaultValue={row.sparepartId}
                        onChange={(value) => selectSparepart(row.id, value)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.qtyPo} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="0"
                      value={row.qtyTerima}
                      onChange={(event) =>
                        updateRow(row.id, {
                          qtyTerima: Number(event.target.value),
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
                  <td className="px-4 py-3">
                    <Select
                      options={kondisiOptions}
                      placeholder="Kondisi"
                      defaultValue={row.kondisiBarangId}
                      onChange={(value) =>
                        updateRow(row.id, {
                          kondisiBarangId: value,
                        })
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(row.qtyTerima * row.hargaBeli)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() =>
              setRows((items) => [...items, emptyRow(defaultKondisiId)])
            }
            className="mt-4 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-white/90"
          >
            + Tambah Barang Diterima
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Nilai Diterima
            </span>
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/pembelian/penerimaan-barang">
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
              {mode === "edit" ? "Post Penerimaan" : "Simpan Penerimaan"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

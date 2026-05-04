"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { createManualInvoiceAction } from "@/lib/keuangan/actions";

type WorkOrderOption = {
  value: string;
  label: string;
  pelangganId: string;
  pelangganNama: string;
  kendaraanId: string;
  kendaraanNama: string;
};

type ItemOption = {
  value: string;
  label: string;
  sourceType: "JASA" | "SPAREPART";
  sourceId: string;
  deskripsi: string;
  tipe: "JASA" | "SPAREPART" | "LAINNYA";
  harga: number;
};

interface InvoiceItem {
  id: number;
  deskripsi: string;
  tipe: "JASA" | "SPAREPART" | "LAINNYA";
  qty: number;
  harga: number;
  jasaServisId?: string;
  sparepartId?: string;
}

type InvoiceCreateFormProps = {
  nextNumber: string;
  today: string;
  workOrders: WorkOrderOption[];
  itemOptions: ItemOption[];
};

const tipeOptions = [
  { value: "JASA", label: "Jasa" },
  { value: "SPAREPART", label: "Sparepart" },
  { value: "LAINNYA", label: "Lainnya" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyRow = (): InvoiceItem => ({
  id: Date.now(),
  deskripsi: "",
  tipe: "JASA",
  qty: 1,
  harga: 0,
});

export default function InvoiceCreateForm({
  nextNumber,
  today,
  workOrders,
  itemOptions,
}: InvoiceCreateFormProps) {
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState("");
  const [pelangganId, setPelangganId] = useState("");
  const [pelanggan, setPelanggan] = useState("");
  const [kendaraanId, setKendaraanId] = useState("");
  const [kendaraan, setKendaraan] = useState("");
  const [rows, setRows] = useState<InvoiceItem[]>([{ ...emptyRow(), id: 1 }]);

  const workOrderMap = useMemo(
    () => new Map(workOrders.map((item) => [item.value, item])),
    [workOrders]
  );
  const itemMap = useMemo(
    () => new Map(itemOptions.map((item) => [item.value, item])),
    [itemOptions]
  );
  const itemPayload = useMemo(
    () =>
      rows.map((row) => ({
        deskripsi: row.deskripsi,
        tipe: row.tipe,
        qty: row.qty,
        harga: row.harga,
        jasaServisId: row.jasaServisId,
        sparepartId: row.sparepartId,
      })),
    [rows]
  );

  const totalJasa = useMemo(
    () =>
      rows
        .filter((item) => item.tipe === "JASA")
        .reduce((sum, item) => sum + item.qty * item.harga, 0),
    [rows]
  );
  const totalSparepart = useMemo(
    () =>
      rows
        .filter((item) => item.tipe === "SPAREPART")
        .reduce((sum, item) => sum + item.qty * item.harga, 0),
    [rows]
  );
  const totalLainnya = useMemo(
    () =>
      rows
        .filter((item) => item.tipe === "LAINNYA")
        .reduce((sum, item) => sum + item.qty * item.harga, 0),
    [rows]
  );
  const grandTotal = totalJasa + totalSparepart + totalLainnya;

  const updateRow = (id: number, patch: Partial<InvoiceItem>) => {
    setRows((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const selectWorkOrder = (value: string) => {
    const workOrder = workOrderMap.get(value);
    if (!workOrder) return;

    setSelectedWorkOrderId(workOrder.value);
    setPelangganId(workOrder.pelangganId);
    setPelanggan(workOrder.pelangganNama);
    setKendaraanId(workOrder.kendaraanId);
    setKendaraan(workOrder.kendaraanNama);
  };

  const selectItem = (id: number, value: string) => {
    const option = itemMap.get(value);
    if (!option) return;

    updateRow(id, {
      deskripsi: option.deskripsi,
      tipe: option.tipe,
      qty: 1,
      harga: option.harga,
      jasaServisId: option.sourceType === "JASA" ? option.sourceId : undefined,
      sparepartId: option.sourceType === "SPAREPART" ? option.sourceId : undefined,
    });
  };

  return (
    <form action={createManualInvoiceAction} className="min-w-0 space-y-6">
      <input type="hidden" name="workOrderId" value={selectedWorkOrderId} />
      <input type="hidden" name="pelangganId" value={pelangganId} />
      <input type="hidden" name="kendaraanId" value={kendaraanId} />
      <input type="hidden" name="items" value={JSON.stringify(itemPayload)} />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informasi Invoice
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Buat tagihan dari work order yang sudah selesai.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="No. Invoice">
            <Input defaultValue={nextNumber} readOnly />
          </Field>
          <Field label="Tanggal Invoice">
            <Input name="tanggalInvoice" type="date" defaultValue={today} readOnly />
          </Field>
          <Field label="Work Order">
            <Select
              options={workOrders}
              placeholder="Pilih work order"
              defaultValue={selectedWorkOrderId}
              onChange={selectWorkOrder}
            />
          </Field>
          <Field label="Jatuh Tempo">
            <Input name="jatuhTempo" type="date" defaultValue={today} />
          </Field>
          <Field label="Pelanggan">
            <Input value={pelanggan} placeholder="Otomatis dari WO" readOnly />
          </Field>
          <Field label="Kendaraan">
            <Input value={kendaraan} placeholder="Otomatis dari WO" readOnly />
          </Field>
          <div className="md:col-span-2">
            <Field label="Catatan">
              <Input name="catatan" placeholder="Catatan invoice" />
            </Field>
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Detail Tagihan
          </h2>
        </div>
        <div className="w-full overflow-x-auto p-5">
          <table className="w-full min-w-[900px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr>
                <Th className="w-16">No</Th>
                <Th className="w-28">Aksi</Th>
                <Th className="w-[320px]">Item Tagihan</Th>
                <Th className="w-36">Tipe</Th>
                <Th className="w-24">Qty</Th>
                <Th className="w-40">Harga</Th>
                <Th className="w-40">Subtotal</Th>
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
                      options={itemOptions}
                      placeholder="Pilih item"
                      onChange={(value) => selectItem(row.id, value)}
                    />
                    <Input
                      className="mt-2"
                      value={row.deskripsi}
                      placeholder="Deskripsi item"
                      onChange={(event) =>
                        updateRow(row.id, { deskripsi: event.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      options={tipeOptions}
                      placeholder="Tipe"
                      defaultValue={row.tipe}
                      onChange={(value) =>
                        updateRow(row.id, {
                          tipe: value as InvoiceItem["tipe"],
                          jasaServisId: value === "JASA" ? row.jasaServisId : undefined,
                          sparepartId: value === "SPAREPART" ? row.sparepartId : undefined,
                        })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={(event) =>
                        updateRow(row.id, { qty: Number(event.target.value) })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="0"
                      value={row.harga}
                      onChange={(event) =>
                        updateRow(row.id, { harga: Number(event.target.value) })
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(row.qty * row.harga)}
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
            + Tambah Item Tagihan
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <Summary label="Total Jasa" value={formatCurrency(totalJasa)} />
            <Summary label="Total Sparepart" value={formatCurrency(totalSparepart)} />
            <Summary label="Grand Total" value={formatCurrency(grandTotal)} highlight />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/keuangan/invoice">
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
              Buat Invoice
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

function Summary({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <p
        className={`font-semibold ${
          highlight
            ? "text-brand-600 dark:text-brand-400"
            : "text-gray-800 dark:text-white/90"
        }`}
      >
        {value}
      </p>
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

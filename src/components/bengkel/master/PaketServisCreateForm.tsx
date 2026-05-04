"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import {
  createPaketServisAction,
  updatePaketServisAction,
} from "@/lib/masters/actions";

type JasaOption = {
  value: string;
  label: string;
  nama: string;
  estimasiMenit: number;
  harga: number;
};

type SparepartOption = {
  value: string;
  label: string;
  nama: string;
  satuan: string;
  harga: number;
};

type PaketJasaItem = {
  id: number;
  jasaServisId: string;
  nama: string;
  estimasiMenit: number;
  hargaNormal: number;
};

type PaketSparepartItem = {
  id: number;
  sparepartId: string;
  nama: string;
  qty: number;
  satuan: string;
  hargaNormal: number;
};

export type PaketServisInitialData = {
  id: string;
  kode: string;
  nama: string;
  jenisKendaraan: string;
  estimasiMenit: number;
  hargaPaket: number;
  catatan: string;
  status: "AKTIF" | "TIDAK_AKTIF";
  jasaItems: Omit<PaketJasaItem, "id">[];
  sparepartItems: Omit<PaketSparepartItem, "id">[];
};

type PaketServisCreateFormProps = {
  mode?: "create" | "edit";
  nextCode: string;
  jasaOptions: JasaOption[];
  sparepartOptions: SparepartOption[];
  initialData?: PaketServisInitialData;
};

const jenisKendaraanOptions = [
  { value: "Motor", label: "Motor" },
  { value: "Mobil", label: "Mobil" },
  { value: "Motor & Mobil", label: "Motor & Mobil" },
];

const statusOptions = [
  { value: "AKTIF", label: "Aktif" },
  { value: "TIDAK_AKTIF", label: "Tidak Aktif" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyJasa = (): PaketJasaItem => ({
  id: Date.now(),
  jasaServisId: "",
  nama: "",
  estimasiMenit: 0,
  hargaNormal: 0,
});

const emptySparepart = (): PaketSparepartItem => ({
  id: Date.now(),
  sparepartId: "",
  nama: "",
  qty: 1,
  satuan: "",
  hargaNormal: 0,
});

const getInitialJasaRows = (initialData?: PaketServisInitialData) =>
  initialData?.jasaItems.length
    ? initialData.jasaItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }))
    : [{ ...emptyJasa(), id: 1 }];

const getInitialSparepartRows = (initialData?: PaketServisInitialData) =>
  initialData?.sparepartItems.length
    ? initialData.sparepartItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }))
    : [{ ...emptySparepart(), id: 1 }];

export default function PaketServisCreateForm({
  mode = "create",
  nextCode,
  jasaOptions,
  sparepartOptions,
  initialData,
}: PaketServisCreateFormProps) {
  const [jenisKendaraan, setJenisKendaraan] = useState(
    initialData?.jenisKendaraan ?? ""
  );
  const [status, setStatus] = useState(initialData?.status ?? "AKTIF");
  const [jasaRows, setJasaRows] = useState<PaketJasaItem[]>(
    getInitialJasaRows(initialData)
  );
  const [sparepartRows, setSparepartRows] = useState<PaketSparepartItem[]>(
    getInitialSparepartRows(initialData)
  );

  const jasaMap = useMemo(
    () => new Map(jasaOptions.map((item) => [item.value, item])),
    [jasaOptions]
  );
  const sparepartMap = useMemo(
    () => new Map(sparepartOptions.map((item) => [item.value, item])),
    [sparepartOptions]
  );
  const jasaPayload = useMemo(
    () =>
      jasaRows.map((item) => ({
        jasaServisId: item.jasaServisId,
        estimasiMenit: item.estimasiMenit,
        hargaNormal: item.hargaNormal,
      })),
    [jasaRows]
  );
  const sparepartPayload = useMemo(
    () =>
      sparepartRows.map((item) => ({
        sparepartId: item.sparepartId,
        qty: item.qty,
        hargaNormal: item.hargaNormal,
      })),
    [sparepartRows]
  );
  const totalJasa = useMemo(
    () => jasaRows.reduce((sum, item) => sum + item.hargaNormal, 0),
    [jasaRows]
  );
  const totalSparepart = useMemo(
    () =>
      sparepartRows.reduce(
        (sum, item) => sum + item.qty * item.hargaNormal,
        0
      ),
    [sparepartRows]
  );

  const updateJasa = (id: number, patch: Partial<PaketJasaItem>) => {
    setJasaRows((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const updateSparepart = (id: number, patch: Partial<PaketSparepartItem>) => {
    setSparepartRows((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const selectJasa = (id: number, value: string) => {
    const jasa = jasaMap.get(value);
    if (!jasa) return;

    updateJasa(id, {
      jasaServisId: jasa.value,
      nama: jasa.nama,
      estimasiMenit: jasa.estimasiMenit,
      hargaNormal: jasa.harga,
    });
  };

  const selectSparepart = (id: number, value: string) => {
    const sparepart = sparepartMap.get(value);
    if (!sparepart) return;

    updateSparepart(id, {
      sparepartId: sparepart.value,
      nama: sparepart.nama,
      qty: 1,
      satuan: sparepart.satuan,
      hargaNormal: sparepart.harga,
    });
  };

  return (
    <form
      action={mode === "edit" ? updatePaketServisAction : createPaketServisAction}
      className="min-w-0 space-y-6"
    >
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="jenisKendaraan" value={jenisKendaraan} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="jasaItems" value={JSON.stringify(jasaPayload)} />
      <input
        type="hidden"
        name="sparepartItems"
        value={JSON.stringify(sparepartPayload)}
      />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informasi Paket Servis
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Buat paket servis dari kombinasi jasa dan sparepart.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Kode Paket">
            <Input defaultValue={initialData?.kode ?? nextCode} readOnly />
          </Field>
          <Field label="Nama Paket">
            <Input
              name="nama"
              placeholder="Contoh: Paket Servis Ringan Motor"
              defaultValue={initialData?.nama}
            />
          </Field>
          <Field label="Jenis Kendaraan">
            <Select
              options={jenisKendaraanOptions}
              placeholder="Pilih jenis"
              defaultValue={jenisKendaraan}
              onChange={setJenisKendaraan}
            />
          </Field>
          <Field label="Status">
            <Select
              options={statusOptions}
              placeholder="Status"
              defaultValue={status}
              onChange={(value) => setStatus(value as "AKTIF" | "TIDAK_AKTIF")}
            />
          </Field>
          <Field label="Estimasi Menit">
            <Input
              name="estimasiMenit"
              type="number"
              min="0"
              defaultValue={initialData?.estimasiMenit ?? 0}
            />
          </Field>
          <Field label="Harga Paket">
            <Input
              name="hargaPaket"
              type="number"
              min="0"
              defaultValue={initialData?.hargaPaket ?? 0}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Catatan">
              <Input
                name="catatan"
                placeholder="Catatan paket servis"
                defaultValue={initialData?.catatan}
              />
            </Field>
          </div>
        </div>
      </div>

      <DetailCard title="Jasa Dalam Paket">
        <table className="w-full min-w-[760px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
          <thead className="bg-gray-50 dark:bg-white/[0.03]">
            <tr>
              <Th className="w-16">No</Th>
              <Th className="w-28">Aksi</Th>
              <Th className="w-[320px]">Jasa Servis</Th>
              <Th className="w-36">Estimasi</Th>
              <Th className="w-40">Harga Normal</Th>
            </tr>
          </thead>
          <tbody>
            {jasaRows.map((row, index) => (
              <tr
                key={row.id}
                className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-transparent"
              >
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="px-4 py-3">
                  <RemoveButton
                    onClick={() =>
                      setJasaRows((items) => items.filter((item) => item.id !== row.id))
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <Select
                    options={jasaOptions}
                    placeholder="Pilih jasa"
                    defaultValue={row.jasaServisId}
                    onChange={(value) => selectJasa(row.id, value)}
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    min="0"
                    value={row.estimasiMenit}
                    onChange={(event) =>
                      updateJasa(row.id, {
                        estimasiMenit: Number(event.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    min="0"
                    value={row.hargaNormal}
                    onChange={(event) =>
                      updateJasa(row.id, {
                        hargaNormal: Number(event.target.value),
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddRowButton onClick={() => setJasaRows((items) => [...items, emptyJasa()])}>
          + Tambah Jasa
        </AddRowButton>
      </DetailCard>

      <DetailCard title="Sparepart Dalam Paket">
        <table className="w-full min-w-[880px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
          <thead className="bg-gray-50 dark:bg-white/[0.03]">
            <tr>
              <Th className="w-16">No</Th>
              <Th className="w-28">Aksi</Th>
              <Th className="w-[320px]">Sparepart</Th>
              <Th className="w-24">Qty</Th>
              <Th className="w-28">Satuan</Th>
              <Th className="w-40">Harga Normal</Th>
              <Th className="w-40">Subtotal</Th>
            </tr>
          </thead>
          <tbody>
            {sparepartRows.map((row, index) => (
              <tr
                key={row.id}
                className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-transparent"
              >
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="px-4 py-3">
                  <RemoveButton
                    onClick={() =>
                      setSparepartRows((items) =>
                        items.filter((item) => item.id !== row.id)
                      )
                    }
                  />
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
                  <Input
                    type="number"
                    min="1"
                    value={row.qty}
                    onChange={(event) =>
                      updateSparepart(row.id, { qty: Number(event.target.value) })
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
                    value={row.hargaNormal}
                    onChange={(event) =>
                      updateSparepart(row.id, {
                        hargaNormal: Number(event.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">
                  {formatCurrency(row.qty * row.hargaNormal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddRowButton
          onClick={() => setSparepartRows((items) => [...items, emptySparepart()])}
        >
          + Tambah Sparepart
        </AddRowButton>
      </DetailCard>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <Summary label="Total Jasa" value={formatCurrency(totalJasa)} />
            <Summary label="Total Sparepart" value={formatCurrency(totalSparepart)} />
            <Summary
              label="Harga Normal"
              value={formatCurrency(totalJasa + totalSparepart)}
              highlight
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/master/paket-servis">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Batalkan
              </Button>
            </Link>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Simpan Paket
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

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h2>
      </div>
      <div className="w-full overflow-x-auto p-5">{children}</div>
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

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-error-300 px-4 py-2 text-sm font-medium text-error-500 hover:bg-error-50 dark:border-error-500/40 dark:hover:bg-error-500/10"
    >
      Hapus
    </button>
  );
}

function AddRowButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-white/90"
    >
      {children}
    </button>
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

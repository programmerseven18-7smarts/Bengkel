"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { createMutasiStokAction } from "@/lib/inventory/actions";

type Option = {
  value: string;
  label: string;
};

type SparepartOption = {
  value: string;
  label: string;
  nama: string;
  stok: number;
  satuan: string;
};

interface MutasiItem {
  id: number;
  sparepartId: string;
  namaSparepart: string;
  stokAsal: number;
  qtyMutasi: number;
  satuan: string;
  catatan: string;
}

type MutasiStokCreateFormProps = {
  nextNumber: string;
  today: string;
  currentUserName: string;
  lokasiOptions: Option[];
  spareparts: SparepartOption[];
};

const emptyRow = (): MutasiItem => ({
  id: Date.now(),
  sparepartId: "",
  namaSparepart: "",
  stokAsal: 0,
  qtyMutasi: 1,
  satuan: "",
  catatan: "",
});

export default function MutasiStokCreateForm({
  nextNumber,
  today,
  currentUserName,
  lokasiOptions,
  spareparts,
}: MutasiStokCreateFormProps) {
  const [lokasiAsalId, setLokasiAsalId] = useState("");
  const [lokasiTujuanId, setLokasiTujuanId] = useState("");
  const [rows, setRows] = useState<MutasiItem[]>([{ ...emptyRow(), id: 1 }]);

  const sparepartMap = useMemo(
    () => new Map(spareparts.map((item) => [item.value, item])),
    [spareparts]
  );
  const itemPayload = useMemo(
    () =>
      rows.map((row) => ({
        sparepartId: row.sparepartId,
        namaSparepart: row.namaSparepart,
        stokAsal: row.stokAsal,
        qtyMutasi: row.qtyMutasi,
        satuan: row.satuan,
        catatan: row.catatan,
      })),
    [rows]
  );
  const totalQty = rows.reduce((sum, item) => sum + item.qtyMutasi, 0);

  const updateRow = (id: number, patch: Partial<MutasiItem>) => {
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
      stokAsal: sparepart.stok,
      satuan: sparepart.satuan,
    });
  };

  return (
    <form action={createMutasiStokAction} className="min-w-0 space-y-6">
      <input type="hidden" name="lokasiAsalId" value={lokasiAsalId} />
      <input type="hidden" name="lokasiTujuanId" value={lokasiTujuanId} />
      <input type="hidden" name="items" value={JSON.stringify(itemPayload)} />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informasi Mutasi Stok
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pindahkan stok sparepart antar lokasi penyimpanan.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="No. Mutasi">
            <Input defaultValue={nextNumber} readOnly />
          </Field>
          <Field label="Tanggal">
            <Input name="tanggal" type="date" defaultValue={today} readOnly />
          </Field>
          <Field label="Lokasi Asal">
            <Select
              options={lokasiOptions}
              placeholder="Pilih lokasi"
              defaultValue={lokasiAsalId}
              onChange={setLokasiAsalId}
            />
          </Field>
          <Field label="Lokasi Tujuan">
            <Select
              options={lokasiOptions}
              placeholder="Pilih lokasi"
              defaultValue={lokasiTujuanId}
              onChange={setLokasiTujuanId}
            />
          </Field>
          <Field label="Penanggung Jawab">
            <Input defaultValue={currentUserName} readOnly />
          </Field>
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Catatan">
              <Input name="catatan" placeholder="Catatan mutasi stok" />
            </Field>
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Detail Mutasi
          </h2>
        </div>
        <div className="w-full overflow-x-auto p-5">
          <table className="w-full min-w-[820px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr>
                <Th className="w-16">No</Th>
                <Th className="w-28">Aksi</Th>
                <Th className="w-[320px]">Sparepart</Th>
                <Th className="w-28">Stok Asal</Th>
                <Th className="w-32">Qty Mutasi</Th>
                <Th className="w-28">Satuan</Th>
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
                    <Input value={row.stokAsal} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="1"
                      max={`${row.stokAsal}`}
                      value={row.qtyMutasi}
                      onChange={(event) =>
                        updateRow(row.id, { qtyMutasi: Number(event.target.value) })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input value={row.satuan} readOnly />
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
            + Tambah Sparepart Mutasi
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Qty Dimutasi
            </span>
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">
              {totalQty}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/inventory/mutasi">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Batalkan
              </Button>
            </Link>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Simpan Mutasi
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

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import {
  createWorkOrderAction,
  updateWorkOrderDraftAction,
} from "@/lib/work-orders/actions";

interface BaseOption {
  value: string;
  label: string;
}

interface KendaraanOption extends BaseOption {
  pelangganId: string;
}

interface ServiceOption extends BaseOption {
  kode: string;
  nama: string;
  kategori: string;
  estimasiMenit: number;
  harga: number;
}

interface SparepartOption extends BaseOption {
  kode: string;
  nama: string;
  stokTersedia: number;
  satuan: string;
  hargaJual: number;
}

interface ServiceRow {
  id: number;
  jasaServisId: string;
  kodeJasa: string;
  namaJasa: string;
  kategori: string;
  estimasiMenit: number;
  harga: number;
  catatan: string;
}

interface SparepartRow {
  id: number;
  sparepartId: string;
  kode: string;
  nama: string;
  stokTersedia: number;
  satuan: string;
  qty: number;
  hargaJual: number;
  catatan: string;
}

interface WorkOrderCreateFormProps {
  mode?: "create" | "edit";
  initialData?: {
    id: string;
    pelangganId: string;
    kendaraanId: string;
    mekanikId: string;
    estimasiSelesaiTime: string;
    keluhan: string;
    catatan: string;
    services: ServiceRow[];
    spareparts: SparepartRow[];
  };
  nextNumber: string;
  tanggalMasuk: string;
  pelangganOptions: BaseOption[];
  kendaraanOptions: KendaraanOption[];
  mekanikOptions: BaseOption[];
  serviceOptions: ServiceOption[];
  sparepartOptions: SparepartOption[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyServiceRow = (): ServiceRow => ({
  id: Date.now(),
  jasaServisId: "",
  kodeJasa: "",
  namaJasa: "",
  kategori: "",
  estimasiMenit: 0,
  harga: 0,
  catatan: "",
});

const emptySparepartRow = (): SparepartRow => ({
  id: Date.now(),
  sparepartId: "",
  kode: "",
  nama: "",
  stokTersedia: 0,
  satuan: "",
  qty: 1,
  hargaJual: 0,
  catatan: "",
});

export default function WorkOrderCreateForm({
  mode = "create",
  initialData,
  nextNumber,
  tanggalMasuk,
  pelangganOptions,
  kendaraanOptions,
  mekanikOptions,
  serviceOptions,
  sparepartOptions,
}: WorkOrderCreateFormProps) {
  const [pelangganId, setPelangganId] = useState(initialData?.pelangganId ?? "");
  const [kendaraanId, setKendaraanId] = useState(initialData?.kendaraanId ?? "");
  const [mekanikId, setMekanikId] = useState(initialData?.mekanikId ?? "");
  const [services, setServices] = useState<ServiceRow[]>(
    initialData?.services?.length ? initialData.services : [{ ...emptyServiceRow(), id: 1 }]
  );
  const [spareparts, setSpareparts] = useState<SparepartRow[]>(
    initialData?.spareparts?.length
      ? initialData.spareparts
      : [{ ...emptySparepartRow(), id: 1 }]
  );

  const filteredKendaraanOptions = useMemo(() => {
    if (!pelangganId) return kendaraanOptions;
    return kendaraanOptions.filter((item) => item.pelangganId === pelangganId);
  }, [kendaraanOptions, pelangganId]);

  const selectPelanggan = (value: string) => {
    setPelangganId(value);

    if (!kendaraanOptions.some((item) => item.value === kendaraanId && item.pelangganId === value)) {
      setKendaraanId("");
    }
  };

  const serviceTotal = useMemo(
    () => services.reduce((total, item) => total + item.harga, 0),
    [services]
  );
  const sparepartTotal = useMemo(
    () => spareparts.reduce((total, item) => total + item.qty * item.hargaJual, 0),
    [spareparts]
  );

  const updateService = (id: number, patch: Partial<ServiceRow>) => {
    setServices((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const updateSparepart = (id: number, patch: Partial<SparepartRow>) => {
    setSpareparts((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const selectService = (id: number, value: string) => {
    const selected = serviceOptions.find((option) => option.value === value);
    if (!selected) return;

    updateService(id, {
      jasaServisId: selected.value,
      kodeJasa: selected.kode,
      namaJasa: selected.nama,
      kategori: selected.kategori,
      estimasiMenit: selected.estimasiMenit,
      harga: selected.harga,
    });
  };

  const selectSparepart = (id: number, value: string) => {
    const selected = sparepartOptions.find((option) => option.value === value);
    if (!selected) return;

    updateSparepart(id, {
      sparepartId: selected.value,
      kode: selected.kode,
      nama: selected.nama,
      stokTersedia: selected.stokTersedia,
      satuan: selected.satuan,
      hargaJual: selected.hargaJual,
    });
  };

  const jasaPayload = services
    .filter((row) => row.jasaServisId || row.namaJasa)
    .map((row) => ({
      jasaServisId: row.jasaServisId,
      namaJasa: row.namaJasa,
      kategori: row.kategori,
      estimasiMenit: row.estimasiMenit,
      harga: row.harga,
      catatan: row.catatan,
    }));
  const sparepartPayload = spareparts
    .filter((row) => row.sparepartId || row.nama)
    .map((row) => ({
      sparepartId: row.sparepartId,
      nama: row.nama,
      stokTersedia: row.stokTersedia,
      satuan: row.satuan,
      qty: row.qty,
      hargaJual: row.hargaJual,
      catatan: row.catatan,
    }));

  return (
    <form
      action={mode === "edit" ? updateWorkOrderDraftAction : createWorkOrderAction}
      className="space-y-6"
    >
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="tanggalMasuk" value={tanggalMasuk} />
      <input type="hidden" name="pelangganId" value={pelangganId} />
      <input type="hidden" name="kendaraanId" value={kendaraanId} />
      <input type="hidden" name="mekanikId" value={mekanikId} />
      <input type="hidden" name="jasaItems" value={JSON.stringify(jasaPayload)} />
      <input type="hidden" name="sparepartItems" value={JSON.stringify(sparepartPayload)} />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Informasi Servis
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Data pelanggan, kendaraan, dan teknisi yang menangani pekerjaan.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-warning-50 px-3 py-1 text-xs font-medium text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">
              {mode === "edit" ? "Edit Draft" : "Draft Work Order"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              No. Work Order
            </label>
            <Input defaultValue={nextNumber} readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tanggal Masuk
            </label>
            <Input type="date" defaultValue={tanggalMasuk} readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Pelanggan
            </label>
            <Select options={pelangganOptions} placeholder="Pilih pelanggan" defaultValue={pelangganId} onChange={selectPelanggan} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Kendaraan
            </label>
            <Select
              key={`kendaraan-${pelangganId}-${kendaraanId}`}
              options={filteredKendaraanOptions}
              placeholder="Pilih kendaraan"
              defaultValue={kendaraanId}
              onChange={setKendaraanId}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Mekanik
            </label>
            <Select options={mekanikOptions} placeholder="Pilih mekanik" defaultValue={mekanikId} onChange={setMekanikId} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Estimasi Selesai
            </label>
            <Input
              type="time"
              name="estimasiSelesaiTime"
              defaultValue={initialData?.estimasiSelesaiTime || "15:00"}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Keluhan Pelanggan
            </label>
            <Input
              name="keluhan"
              placeholder="Keluhan pelanggan"
              defaultValue={initialData?.keluhan}
            />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Catatan
            </label>
            <Input
              name="catatan"
              placeholder="Catatan work order"
              defaultValue={initialData?.catatan}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pekerjaan Jasa
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tambahkan jasa yang dikerjakan mekanik pada kendaraan.
          </p>
        </div>
        <div className="max-w-full overflow-x-auto p-5">
          <table className="w-full min-w-[1180px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr>
                <th className="w-16 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">No</th>
                <th className="w-32 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Aksi</th>
                <th className="w-36 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Kode Jasa</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Jasa Servis</th>
                <th className="w-44 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Kategori</th>
                <th className="w-36 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Estimasi</th>
                <th className="w-44 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Harga Jasa</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Catatan Mekanik</th>
              </tr>
            </thead>
            <tbody>
              {services.map((row, index) => (
                <tr key={row.id} className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-transparent">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setServices((rows) => rows.filter((item) => item.id !== row.id))}
                      className="rounded-lg border border-error-300 px-4 py-2 text-sm font-medium text-error-500 hover:bg-error-50 dark:border-error-500/40 dark:hover:bg-error-500/10"
                    >
                      Hapus
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Input placeholder="JSV-001" value={row.kodeJasa} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Select options={serviceOptions} placeholder="Pilih jasa servis" defaultValue={row.jasaServisId} onChange={(value) => selectService(row.id, value)} />
                    {row.namaJasa && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{row.namaJasa}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Input placeholder="Kategori" value={row.kategori} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input placeholder="30 menit" value={row.estimasiMenit ? `${row.estimasiMenit} menit` : ""} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input type="number" min="0" value={row.harga} onChange={(event) => updateService(row.id, { harga: Number(event.target.value) })} />
                  </td>
                  <td className="px-4 py-3">
                    <Input placeholder="Catatan" value={row.catatan} onChange={(event) => updateService(row.id, { catatan: event.target.value })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => setServices((rows) => [...rows, emptyServiceRow()])}
            className="mt-4 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-white/90"
          >
            + Tambah Baris Jasa
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pemakaian Sparepart
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Catat sparepart yang dipakai untuk pekerjaan servis ini.
          </p>
        </div>
        <div className="max-w-full overflow-x-auto p-5">
          <table className="w-full min-w-[1220px] overflow-hidden rounded-lg border border-gray-100 text-sm dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr>
                <th className="w-16 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">No</th>
                <th className="w-32 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Aksi</th>
                <th className="w-40 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Kode</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Sparepart</th>
                <th className="w-36 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Stok</th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Qty Pakai</th>
                <th className="w-28 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Satuan</th>
                <th className="w-44 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Harga Jual</th>
                <th className="w-44 px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Subtotal</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Catatan Sparepart</th>
              </tr>
            </thead>
            <tbody>
              {spareparts.map((row, index) => (
                <tr key={row.id} className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-transparent">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSpareparts((rows) => rows.filter((item) => item.id !== row.id))}
                      className="rounded-lg border border-error-300 px-4 py-2 text-sm font-medium text-error-500 hover:bg-error-50 dark:border-error-500/40 dark:hover:bg-error-500/10"
                    >
                      Hapus
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Input placeholder="SPR-001" value={row.kode} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Select options={sparepartOptions} placeholder="Pilih sparepart" defaultValue={row.sparepartId} onChange={(value) => selectSparepart(row.id, value)} />
                    {row.nama && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{row.nama}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Input type="number" min="0" value={row.stokTersedia} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input type="number" min="1" value={row.qty} onChange={(event) => updateSparepart(row.id, { qty: Number(event.target.value) })} />
                  </td>
                  <td className="px-4 py-3">
                    <Input placeholder="Pcs" value={row.satuan} readOnly />
                  </td>
                  <td className="px-4 py-3">
                    <Input type="number" min="0" value={row.hargaJual} onChange={(event) => updateSparepart(row.id, { hargaJual: Number(event.target.value) })} />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(row.qty * row.hargaJual)}
                  </td>
                  <td className="px-4 py-3">
                    <Input placeholder="Catatan" value={row.catatan} onChange={(event) => updateSparepart(row.id, { catatan: event.target.value })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => setSpareparts((rows) => [...rows, emptySparepartRow()])}
            className="mt-4 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-white/90"
          >
            + Tambah Baris Sparepart
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total Jasa</span>
              <p className="font-semibold text-gray-800 dark:text-white/90">{formatCurrency(serviceTotal)}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total Sparepart</span>
              <p className="font-semibold text-gray-800 dark:text-white/90">{formatCurrency(sparepartTotal)}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Grand Total</span>
              <p className="font-semibold text-brand-600 dark:text-brand-400">{formatCurrency(serviceTotal + sparepartTotal)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/servis/work-order">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Batalkan
              </Button>
            </Link>
            <Button
              variant="outline"
              type="submit"
              name="intent"
              value="draft"
              className="w-full border-warning-300 text-warning-600 sm:w-auto"
              disabled={!pelangganId || !kendaraanId}
            >
              Simpan Draft
            </Button>
            <Button
              variant="primary"
              type="submit"
              name="intent"
              value="post"
              className="w-full sm:w-auto"
              disabled={!pelangganId || !kendaraanId}
            >
              {mode === "edit" ? "Post Work Order" : "Buat Work Order"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

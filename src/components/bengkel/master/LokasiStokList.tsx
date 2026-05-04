"use client";

import MasterOptionList, { type MasterOptionItem } from "./MasterOptionList";
import {
  createLokasiStokAction,
  deleteLokasiStokAction,
  updateLokasiStokAction,
} from "@/lib/masters/actions";

export default function LokasiStokList({
  data,
  nextCode,
}: {
  data: MasterOptionItem[];
  nextCode: string;
}) {
  return (
    <MasterOptionList
      title="Lokasi Stok"
      description="Master gudang, rak, dan area penyimpanan sparepart."
      addLabel="Tambah Lokasi"
      searchPlaceholder="Cari lokasi stok..."
      initialData={data}
      categoryLabel="Tipe Lokasi"
      categoryOptions={["Gudang", "Rak", "Area Kerja"]}
      nextCode={nextCode}
      codePlaceholder={nextCode}
      namePlaceholder="Nama lokasi"
      createAction={createLokasiStokAction}
      updateAction={updateLokasiStokAction}
      deleteAction={deleteLokasiStokAction}
    />
  );
}

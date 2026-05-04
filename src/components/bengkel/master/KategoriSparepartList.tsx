"use client";

import MasterOptionList, { type MasterOptionItem } from "./MasterOptionList";
import {
  createKategoriSparepartAction,
  deleteKategoriSparepartAction,
  updateKategoriSparepartAction,
} from "@/lib/masters/actions";

export default function KategoriSparepartList({
  data,
  nextCode,
}: {
  data: MasterOptionItem[];
  nextCode: string;
}) {
  return (
    <MasterOptionList
      title="Kategori Sparepart"
      description="Master kategori untuk pengelompokan sparepart dan filter inventory."
      addLabel="Tambah Kategori"
      searchPlaceholder="Cari kategori sparepart..."
      initialData={data}
      nextCode={nextCode}
      codePlaceholder={nextCode}
      namePlaceholder="Nama kategori"
      createAction={createKategoriSparepartAction}
      updateAction={updateKategoriSparepartAction}
      deleteAction={deleteKategoriSparepartAction}
    />
  );
}

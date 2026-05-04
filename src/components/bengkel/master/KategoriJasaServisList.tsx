"use client";

import MasterOptionList, { type MasterOptionItem } from "./MasterOptionList";
import {
  createKategoriJasaServisAction,
  deleteKategoriJasaServisAction,
  updateKategoriJasaServisAction,
} from "@/lib/masters/actions";

export default function KategoriJasaServisList({
  data,
  nextCode,
}: {
  data: MasterOptionItem[];
  nextCode: string;
}) {
  return (
    <MasterOptionList
      title="Kategori Jasa Servis"
      description="Master kategori untuk jasa servis dan paket servis."
      addLabel="Tambah Kategori"
      searchPlaceholder="Cari kategori jasa..."
      initialData={data}
      nextCode={nextCode}
      codePlaceholder={nextCode}
      namePlaceholder="Nama kategori"
      createAction={createKategoriJasaServisAction}
      updateAction={updateKategoriJasaServisAction}
      deleteAction={deleteKategoriJasaServisAction}
    />
  );
}

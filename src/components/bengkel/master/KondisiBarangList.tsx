"use client";

import MasterOptionList, { type MasterOptionItem } from "./MasterOptionList";
import {
  createKondisiBarangAction,
  deleteKondisiBarangAction,
  updateKondisiBarangAction,
} from "@/lib/masters/actions";

export default function KondisiBarangList({
  data,
  nextCode,
}: {
  data: MasterOptionItem[];
  nextCode: string;
}) {
  return (
    <MasterOptionList
      title="Kondisi Barang"
      description="Master kondisi barang untuk penerimaan dan retur pembelian."
      addLabel="Tambah Kondisi"
      searchPlaceholder="Cari kondisi barang..."
      initialData={data}
      categoryLabel="Kelompok"
      categoryOptions={["Layak Stok", "Tidak Layak", "Perlu Cek"]}
      nextCode={nextCode}
      codePlaceholder={nextCode}
      namePlaceholder="Nama kondisi"
      createAction={createKondisiBarangAction}
      updateAction={updateKondisiBarangAction}
      deleteAction={deleteKondisiBarangAction}
    />
  );
}

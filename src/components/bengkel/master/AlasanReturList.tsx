"use client";

import MasterOptionList, { type MasterOptionItem } from "./MasterOptionList";
import {
  createAlasanReturAction,
  deleteAlasanReturAction,
  updateAlasanReturAction,
} from "@/lib/masters/actions";

export default function AlasanReturList({
  data,
  nextCode,
}: {
  data: MasterOptionItem[];
  nextCode: string;
}) {
  return (
    <MasterOptionList
      title="Alasan Retur"
      description="Master alasan retur untuk retur pembelian dan validasi penerimaan."
      addLabel="Tambah Alasan"
      searchPlaceholder="Cari alasan retur..."
      initialData={data}
      categoryLabel="Jenis Alasan"
      categoryOptions={["Kualitas", "Dokumen", "Jumlah", "Harga"]}
      nextCode={nextCode}
      codePlaceholder={nextCode}
      namePlaceholder="Nama alasan"
      createAction={createAlasanReturAction}
      updateAction={updateAlasanReturAction}
      deleteAction={deleteAlasanReturAction}
    />
  );
}

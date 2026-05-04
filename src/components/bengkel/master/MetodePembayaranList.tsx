"use client";

import MasterOptionList, { type MasterOptionItem } from "./MasterOptionList";
import {
  createMetodePembayaranAction,
  deleteMetodePembayaranAction,
  updateMetodePembayaranAction,
} from "@/lib/masters/actions";

export default function MetodePembayaranList({
  data,
  nextCode,
}: {
  data: MasterOptionItem[];
  nextCode: string;
}) {
  return (
    <MasterOptionList
      title="Metode Pembayaran"
      description="Master metode pembayaran untuk invoice, pembayaran, dan kas bank."
      addLabel="Tambah Metode"
      searchPlaceholder="Cari metode pembayaran..."
      initialData={data}
      categoryLabel="Tipe"
      categoryOptions={["Cash", "Bank Transfer", "Digital", "EDC"]}
      nextCode={nextCode}
      codePlaceholder={nextCode}
      namePlaceholder="Nama metode"
      createAction={createMetodePembayaranAction}
      updateAction={updateMetodePembayaranAction}
      deleteAction={deleteMetodePembayaranAction}
    />
  );
}

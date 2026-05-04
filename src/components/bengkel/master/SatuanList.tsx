"use client";

import MasterOptionList, { type MasterOptionItem } from "./MasterOptionList";
import {
  createSatuanAction,
  deleteSatuanAction,
  updateSatuanAction,
} from "@/lib/masters/actions";

export default function SatuanList({
  data,
  nextCode,
}: {
  data: MasterOptionItem[];
  nextCode: string;
}) {
  return (
    <MasterOptionList
      title="Satuan"
      description="Master satuan untuk sparepart, stok, pembelian, dan pemakaian servis."
      addLabel="Tambah Satuan"
      searchPlaceholder="Cari satuan..."
      initialData={data}
      categoryLabel="Jenis"
      categoryOptions={["Unit", "Volume", "Kemasan", "Panjang"]}
      nextCode={nextCode}
      codePlaceholder={nextCode}
      namePlaceholder="Nama satuan"
      createAction={createSatuanAction}
      updateAction={updateSatuanAction}
      deleteAction={deleteSatuanAction}
    />
  );
}

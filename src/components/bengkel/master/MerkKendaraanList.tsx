"use client";

import MasterOptionList, { type MasterOptionItem } from "./MasterOptionList";
import {
  createMerkKendaraanAction,
  deleteMerkKendaraanAction,
  updateMerkKendaraanAction,
} from "@/lib/masters/actions";

export default function MerkKendaraanList({
  data,
  nextCode,
}: {
  data: MasterOptionItem[];
  nextCode: string;
}) {
  return (
    <MasterOptionList
      title="Merk Kendaraan"
      description="Master merk kendaraan untuk data kendaraan pelanggan."
      addLabel="Tambah Merk"
      searchPlaceholder="Cari merk kendaraan..."
      initialData={data}
      categoryLabel="Jenis Kendaraan"
      categoryOptions={["Motor", "Mobil", "Motor & Mobil"]}
      nextCode={nextCode}
      codePlaceholder={nextCode}
      namePlaceholder="Nama merk"
      createAction={createMerkKendaraanAction}
      updateAction={updateMerkKendaraanAction}
      deleteAction={deleteMerkKendaraanAction}
    />
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Pagination from "@/components/tables/Pagination";
import { PencilIcon, TrashBinIcon } from "@/icons";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { deletePaketServisAction } from "@/lib/masters/actions";

export type PaketServisRow = {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  isiPaket: string;
  hargaNormal: number;
  hargaPaket: number;
  estimasiWaktu: string;
  status: "AKTIF" | "TIDAK_AKTIF";
};

type PaketServisListProps = {
  paketServis: PaketServisRow[];
};

const statusLabel = (status: PaketServisRow["status"]) =>
  status === "AKTIF" ? "Aktif" : "Tidak Aktif";

export default function PaketServisList({ paketServis }: PaketServisListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [deleteItem, setDeleteItem] = useState<PaketServisRow | null>(null);

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return paketServis;

    return paketServis.filter((item) =>
      `${item.kode} ${item.nama} ${item.kategori} ${item.isiPaket}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [paketServis, query]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Cari paket servis..."
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Link href="/master/paket-servis/create">
            <Button size="md" variant="primary" className="w-full sm:w-auto">
              Tambah Paket
            </Button>
          </Link>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[980px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    "No",
                    "Kode",
                    "Paket",
                    "Kategori",
                    "Harga Normal",
                    "Harga Paket",
                    "Est. Waktu",
                    "Status",
                    "Aksi",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredData.map((paket, index) => (
                  <TableRow key={paket.id}>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      {paket.kode}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <p className="font-medium text-theme-sm text-gray-800 dark:text-white/90">
                        {paket.nama}
                      </p>
                      <p className="max-w-[320px] text-theme-xs text-gray-500 dark:text-gray-400">
                        {paket.isiPaket || "-"}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color="light">
                        {paket.kategori || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-end text-theme-sm text-gray-500 line-through dark:text-gray-400">
                      Rp {paket.hargaNormal.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-end text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      Rp {paket.hargaPaket.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {paket.estimasiWaktu}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={paket.status === "AKTIF" ? "success" : "light"}>
                        {statusLabel(paket.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/master/paket-servis/${paket.id}/edit`}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400"
                          aria-label={`Edit ${paket.nama}`}
                        >
                          <PencilIcon className="size-5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteItem(paket)}
                          className="text-gray-500 hover:text-error-500 dark:text-gray-400"
                          aria-label={`Hapus ${paket.nama}`}
                        >
                          <TrashBinIcon className="size-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Belum ada paket servis.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-white/[0.05] sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {filteredData.length} dari {paketServis.length} data
          </p>
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        title="Hapus Paket Servis"
        itemName={deleteItem?.nama}
        hiddenFields={{ id: deleteItem?.id }}
        formAction={deletePaketServisAction}
        onClose={() => setDeleteItem(null)}
      />
    </>
  );
}

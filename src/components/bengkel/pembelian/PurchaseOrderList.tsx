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
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";

type PurchaseOrderStatus = "DRAFT" | "DIKIRIM" | "DITERIMA" | "DIBATALKAN";

export interface PurchaseOrderRow {
  id: string;
  noPurchaseOrder: string;
  tanggal: string;
  supplier: string;
  totalItem: number;
  estimasiDatang: string | null;
  totalNilai: number;
  status: PurchaseOrderStatus;
}

interface PurchaseOrderListProps {
  purchaseOrders: PurchaseOrderRow[];
}

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "DIKIRIM", label: "Dikirim" },
  { value: "DITERIMA", label: "Diterima" },
  { value: "DIBATALKAN", label: "Dibatalkan" },
];

const statusLabel = (status: PurchaseOrderStatus) =>
  statusOptions.find((item) => item.value === status)?.label ?? status;

const getStatusColor = (status: PurchaseOrderStatus) => {
  switch (status) {
    case "DRAFT":
      return "light";
    case "DIKIRIM":
      return "warning";
    case "DITERIMA":
      return "success";
    case "DIBATALKAN":
      return "error";
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function PurchaseOrderList({
  purchaseOrders,
}: PurchaseOrderListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return purchaseOrders.filter((item) => {
      const text = `${item.noPurchaseOrder} ${item.supplier}`.toLowerCase();
      const matchKeyword = !keyword || text.includes(keyword);
      const matchStatus = !selectedStatus || item.status === selectedStatus;
      return matchKeyword && matchStatus;
    });
  }, [purchaseOrders, query, selectedStatus]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Cari purchase order..."
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              options={statusOptions}
              placeholder="Status"
              onChange={setSelectedStatus}
              defaultValue={selectedStatus}
            />
          </div>
        </div>
        <Link href="/pembelian/purchase-order/create">
          <Button size="md" variant="primary" className="w-full sm:w-auto">
            Buat Purchase Order
          </Button>
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "No",
                  "No. PO",
                  "Tanggal",
                  "Supplier",
                  "Item",
                  "Est. Datang",
                  "Total",
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
              {filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm font-medium text-brand-500">
                    <Link href={`/pembelian/purchase-order/${item.id}`}>
                      {item.noPurchaseOrder}
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.tanggal)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.supplier}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-800 dark:text-white/90">
                    {item.totalItem}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.estimasiDatang)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-end text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(item.totalNilai)}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge size="sm" color={getStatusColor(item.status)}>
                      {statusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex gap-2">
                      <Link href={`/pembelian/purchase-order/${item.id}`}>
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      </Link>
                      {item.status === "DIKIRIM" ? (
                        <Link href={`/pembelian/penerimaan-barang/create?po=${item.id}`}>
                          <Button size="sm" variant="outline">
                            Terima
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Terima
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-white/[0.05] sm:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {filteredData.length} dari {purchaseOrders.length} data
        </p>
        <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

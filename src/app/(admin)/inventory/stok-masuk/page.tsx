import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StokMasukList from "@/components/bengkel/inventory/StokMasukList";

export const metadata: Metadata = {
  title: "Stok Masuk | Bengkel ERP",
  description: "Daftar stok masuk inventory bengkel",
};

export default function StokMasukPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Stok Masuk" />
      <StokMasukList />
    </div>
  );
}

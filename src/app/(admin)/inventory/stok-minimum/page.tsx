import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StokMinimumList from "@/components/bengkel/inventory/StokMinimumList";

export const metadata: Metadata = {
  title: "Stok Minimum | Bengkel ERP",
  description: "Daftar barang dengan stok di bawah minimum",
};

export default function StokMinimumPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Alert Stok Minimum" />
      <StokMinimumList />
    </div>
  );
}

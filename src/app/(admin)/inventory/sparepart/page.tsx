import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SparepartList from "@/components/bengkel/inventory/SparepartList";

export const metadata: Metadata = {
  title: "Daftar Sparepart | Bengkel ERP",
  description: "Daftar sparepart inventory bengkel",
};

export default function SparepartPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Sparepart" />
      <SparepartList />
    </div>
  );
}

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierList from "@/components/bengkel/master/SupplierList";

export const metadata: Metadata = {
  title: "Data Supplier | Bengkel ERP",
  description: "Daftar supplier bengkel",
};

export default function SupplierPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Supplier" />
      <SupplierList />
    </div>
  );
}

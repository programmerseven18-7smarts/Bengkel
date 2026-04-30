import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierList from "@/components/bengkel/master/SupplierList";

export const metadata: Metadata = {
  title: "Data Supplier | Auto7",
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

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderList from "@/components/bengkel/servis/WorkOrderList";

export const metadata: Metadata = {
  title: "Work Order | Bengkel ERP",
  description: "Daftar work order servis bengkel",
};

export default function WorkOrderPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Work Order" />
      <WorkOrderList />
    </div>
  );
}

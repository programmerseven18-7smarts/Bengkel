import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderDetail from "@/components/bengkel/servis/WorkOrderDetail";

export const metadata: Metadata = {
  title: "Detail Work Order | Bengkel ERP",
  description: "Detail work order servis bengkel",
};

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Detail Work Order" />
      <WorkOrderDetail id={id} />
    </div>
  );
}

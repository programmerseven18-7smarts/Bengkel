import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RiwayatServis from "@/components/bengkel/servis/RiwayatServis";

export const metadata: Metadata = {
  title: "Riwayat Servis | Bengkel ERP",
  description: "Riwayat servis bengkel",
};

export default function RiwayatServisPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Riwayat Servis" />
      <RiwayatServis />
    </div>
  );
}

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import JasaServisList from "@/components/bengkel/master/JasaServisList";

export const metadata: Metadata = {
  title: "Data Jasa Servis | Bengkel ERP",
  description: "Daftar jasa servis bengkel",
};

export default function JasaServisPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Jasa Servis" />
      <JasaServisList />
    </div>
  );
}

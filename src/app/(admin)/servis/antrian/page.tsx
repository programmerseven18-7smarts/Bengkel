import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AntrianServis from "@/components/bengkel/servis/AntrianServis";

export const metadata: Metadata = {
  title: "Antrian Servis | Bengkel ERP",
  description: "Daftar antrian servis bengkel",
};

export default function AntrianServisPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Antrian Servis" />
      <AntrianServis />
    </div>
  );
}

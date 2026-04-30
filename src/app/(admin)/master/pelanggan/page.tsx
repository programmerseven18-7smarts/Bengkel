import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PelangganList from "@/components/bengkel/master/PelangganList";

export const metadata: Metadata = {
  title: "Data Pelanggan | Auto7",
  description: "Daftar pelanggan bengkel",
};

export default function PelangganPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Pelanggan" />
      <PelangganList />
    </div>
  );
}

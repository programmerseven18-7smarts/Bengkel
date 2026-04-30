import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KendaraanList from "@/components/bengkel/master/KendaraanList";

export const metadata: Metadata = {
  title: "Data Kendaraan | Auto7",
  description: "Daftar kendaraan pelanggan bengkel",
};

export default function KendaraanPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Kendaraan" />
      <KendaraanList />
    </div>
  );
}

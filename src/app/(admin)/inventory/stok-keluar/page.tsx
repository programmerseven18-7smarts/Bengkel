import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StokKeluarList from "@/components/bengkel/inventory/StokKeluarList";

export const metadata: Metadata = {
  title: "Stok Keluar | Auto7",
  description: "Daftar stok keluar inventory bengkel",
};

export default function StokKeluarPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Stok Keluar" />
      <StokKeluarList />
    </div>
  );
}

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MutasiStokList from "@/components/bengkel/inventory/MutasiStokList";

export const metadata: Metadata = {
  title: "Mutasi Stok | Auto7",
  description: "Riwayat mutasi stok inventory bengkel",
};

export default function MutasiStokPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Mutasi Stok" />
      <MutasiStokList />
    </div>
  );
}

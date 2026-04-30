import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LaporanStok from "@/components/bengkel/laporan/LaporanStok";

export default function LaporanStokPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Stok" />
      <div className="space-y-6">
        <LaporanStok />
      </div>
    </div>
  );
}

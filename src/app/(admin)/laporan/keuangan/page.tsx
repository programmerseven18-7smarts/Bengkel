import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LaporanKeuangan from "@/components/bengkel/laporan/LaporanKeuangan";

export default function LaporanKeuanganPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Keuangan" />
      <div className="space-y-6">
        <LaporanKeuangan />
      </div>
    </div>
  );
}

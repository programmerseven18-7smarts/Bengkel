import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LaporanServis from "@/components/bengkel/laporan/LaporanServis";

export default function LaporanServisPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Servis" />
      <div className="space-y-6">
        <LaporanServis />
      </div>
    </div>
  );
}

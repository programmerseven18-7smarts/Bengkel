import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PembayaranList from "@/components/bengkel/keuangan/PembayaranList";

export default function PembayaranPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pembayaran" />
      <div className="space-y-6">
        <PembayaranList />
      </div>
    </div>
  );
}

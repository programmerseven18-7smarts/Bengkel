import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KasBankList from "@/components/bengkel/keuangan/KasBankList";

export default function KasBankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Kas & Bank" />
      <div className="space-y-6">
        <KasBankList />
      </div>
    </div>
  );
}

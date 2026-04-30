import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PiutangList from "@/components/bengkel/keuangan/PiutangList";

export default function PiutangPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Piutang" />
      <PiutangList />
    </div>
  );
}

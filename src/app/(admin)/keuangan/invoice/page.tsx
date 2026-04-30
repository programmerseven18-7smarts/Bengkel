import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InvoiceList from "@/components/bengkel/keuangan/InvoiceList";

export default function InvoicePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Invoice" />
      <div className="space-y-6">
        <InvoiceList />
      </div>
    </div>
  );
}

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PelangganDetail from "@/components/bengkel/master/PelangganDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PelangganDetailPage({ params }: Props) {
  const { id } = await params;
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Detail Pelanggan" />
      <PelangganDetail id={id} />
    </div>
  );
}

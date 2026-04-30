import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KendaraanDetail from "@/components/bengkel/master/KendaraanDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function KendaraanDetailPage({ params }: Props) {
  const { id } = await params;
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Detail Kendaraan" />
      <KendaraanDetail id={id} />
    </div>
  );
}

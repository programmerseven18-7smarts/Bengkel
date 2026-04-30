import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AntrianJadwalServis from "@/components/bengkel/servis/AntrianJadwalServis";

export default function AntrianJadwalPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Antrian & Jadwal Servis" />
      <AntrianJadwalServis />
    </div>
  );
}

import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MekanikList from "@/components/bengkel/master/MekanikList";

export const metadata: Metadata = {
  title: "Data Mekanik | Auto7",
  description: "Daftar mekanik bengkel",
};

export default function MekanikPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Mekanik" />
      <MekanikList />
    </div>
  );
}

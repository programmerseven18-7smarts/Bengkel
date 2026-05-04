import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierList from "@/components/bengkel/master/SupplierList";
import { prisma } from "@/lib/prisma";
import { getNextSystemCode } from "@/lib/numbering";
import { requirePageAccess } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Data Supplier | Auto7",
  description: "Daftar supplier bengkel",
};

export const dynamic = "force-dynamic";

export default async function SupplierPage() {
  await requirePageAccess("supplier");

  const suppliers = await prisma.supplier.findMany({
    orderBy: {
      kode: "asc",
    },
    select: {
      id: true,
      kode: true,
      nama: true,
      noHp: true,
      email: true,
      alamat: true,
      produkUtama: true,
      totalTransaksi: true,
      status: true,
    },
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Supplier" />
      <SupplierList
        nextCode={getNextSystemCode(
          suppliers.map((supplier) => supplier.kode),
          "SUP"
        )}
        suppliers={suppliers.map((supplier) => ({
          id: supplier.id,
          kode: supplier.kode,
          nama: supplier.nama,
          noHp: supplier.noHp ?? "",
          email: supplier.email ?? "",
          alamat: supplier.alamat ?? "",
          produk: supplier.produkUtama ?? "",
          totalTransaksi: supplier.totalTransaksi,
          status: supplier.status,
        }))}
      />
    </div>
  );
}

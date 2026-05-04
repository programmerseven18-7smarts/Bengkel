export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approval"
  | "import"
  | "export";

export type DefaultRoleName = "Owner" | "Admin" | "Mekanik" | "Kasir";
export type DefaultRoleCode = "SUPER_ADMIN" | "ADMIN" | "MEKANIK" | "KASIR";

export type PermissionResource = {
  module: string;
  moduleLabel: string;
  key: string;
  name: string;
  actions: PermissionAction[];
};

export const permissionActions: { key: PermissionAction; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "approval", label: "Approval" },
  { key: "import", label: "Import" },
  { key: "export", label: "Export" },
];

export const permissionResources: PermissionResource[] = [
  {
    module: "DASHBOARD",
    moduleLabel: "Dashboard",
    key: "dashboard",
    name: "Dashboard",
    actions: ["view"],
  },
  {
    module: "SERVIS",
    moduleLabel: "Servis",
    key: "antrian_jadwal",
    name: "Antrian & Jadwal",
    actions: ["view", "create", "edit"],
  },
  {
    module: "SERVIS",
    moduleLabel: "Servis",
    key: "work_order",
    name: "Work Order",
    actions: ["view", "create", "edit", "delete", "approval", "export"],
  },
  {
    module: "SERVIS",
    moduleLabel: "Servis",
    key: "riwayat_servis",
    name: "Riwayat Servis",
    actions: ["view", "export"],
  },
  {
    module: "SERVIS",
    moduleLabel: "Servis",
    key: "reminder_servis",
    name: "Reminder Servis",
    actions: ["view", "create", "edit", "delete", "export"],
  },
  {
    module: "INVENTORY",
    moduleLabel: "Inventory",
    key: "sparepart",
    name: "Sparepart",
    actions: ["view", "create", "edit", "delete", "import", "export"],
  },
  {
    module: "INVENTORY",
    moduleLabel: "Inventory",
    key: "stok_masuk",
    name: "Stok Masuk",
    actions: ["view", "create", "edit", "export"],
  },
  {
    module: "INVENTORY",
    moduleLabel: "Inventory",
    key: "stok_keluar",
    name: "Stok Keluar",
    actions: ["view", "create", "edit", "export"],
  },
  {
    module: "INVENTORY",
    moduleLabel: "Inventory",
    key: "mutasi_stok",
    name: "Mutasi Stok",
    actions: ["view", "create", "export"],
  },
  {
    module: "INVENTORY",
    moduleLabel: "Inventory",
    key: "stok_minimum",
    name: "Stok Minimum",
    actions: ["view", "edit"],
  },
  {
    module: "PEMBELIAN",
    moduleLabel: "Pembelian",
    key: "purchase_order",
    name: "Purchase Order",
    actions: ["view", "create", "edit", "delete", "approval", "export"],
  },
  {
    module: "PEMBELIAN",
    moduleLabel: "Pembelian",
    key: "penerimaan_barang",
    name: "Penerimaan Barang",
    actions: ["view", "create", "edit", "export"],
  },
  {
    module: "PEMBELIAN",
    moduleLabel: "Pembelian",
    key: "retur_pembelian",
    name: "Retur Pembelian",
    actions: ["view", "create", "edit", "export"],
  },
  {
    module: "KEUANGAN",
    moduleLabel: "Keuangan",
    key: "invoice",
    name: "Invoice",
    actions: ["view", "create", "edit", "delete", "export"],
  },
  {
    module: "KEUANGAN",
    moduleLabel: "Keuangan",
    key: "pembayaran",
    name: "Pembayaran",
    actions: ["view", "create", "edit", "export"],
  },
  {
    module: "KEUANGAN",
    moduleLabel: "Keuangan",
    key: "kas_bank",
    name: "Kas & Bank",
    actions: ["view", "create", "edit", "export"],
  },
  {
    module: "KEUANGAN",
    moduleLabel: "Keuangan",
    key: "piutang",
    name: "Piutang",
    actions: ["view", "edit", "export"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "pelanggan",
    name: "Pelanggan",
    actions: ["view", "create", "edit", "delete", "import", "export"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "kendaraan",
    name: "Kendaraan",
    actions: ["view", "create", "edit", "delete", "import", "export"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "mekanik",
    name: "Mekanik",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "supplier",
    name: "Supplier",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "jasa_servis",
    name: "Jasa Servis",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "paket_servis",
    name: "Paket Servis",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "kategori_sparepart",
    name: "Kategori Sparepart",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "kategori_jasa_servis",
    name: "Kategori Jasa",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "satuan",
    name: "Satuan",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "lokasi_stok",
    name: "Lokasi Stok",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "merk_kendaraan",
    name: "Merk Kendaraan",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "alasan_retur",
    name: "Alasan Retur",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "kondisi_barang",
    name: "Kondisi Barang",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "MASTER_DATA",
    moduleLabel: "Master Data",
    key: "metode_pembayaran",
    name: "Metode Pembayaran",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "LAPORAN",
    moduleLabel: "Laporan",
    key: "laporan_servis",
    name: "Laporan Servis",
    actions: ["view", "export"],
  },
  {
    module: "LAPORAN",
    moduleLabel: "Laporan",
    key: "laporan_keuangan",
    name: "Laporan Keuangan",
    actions: ["view", "export"],
  },
  {
    module: "LAPORAN",
    moduleLabel: "Laporan",
    key: "laporan_stok",
    name: "Laporan Stok",
    actions: ["view", "export"],
  },
  {
    module: "PENGATURAN",
    moduleLabel: "Pengaturan",
    key: "pengguna",
    name: "Pengguna",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "PENGATURAN",
    moduleLabel: "Pengaturan",
    key: "role_hak_akses",
    name: "Role & Hak Akses",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    module: "PENGATURAN",
    moduleLabel: "Pengaturan",
    key: "audit_log",
    name: "Audit Log",
    actions: ["view", "export"],
  },
];

export const defaultRoles: {
  code: DefaultRoleCode;
  name: DefaultRoleName;
  description: string;
  isDefault: boolean;
}[] = [
  {
    code: "SUPER_ADMIN",
    name: "Owner",
    description: "Super admin dengan akses penuh ke seluruh fitur bengkel.",
    isDefault: true,
  },
  {
    code: "ADMIN",
    name: "Admin",
    description: "Mengelola operasional bengkel harian.",
    isDefault: false,
  },
  {
    code: "MEKANIK",
    name: "Mekanik",
    description: "Mengakses pekerjaan servis dan data teknis kendaraan.",
    isDefault: false,
  },
  {
    code: "KASIR",
    name: "Kasir",
    description: "Mengelola invoice, pembayaran, piutang, dan kas bengkel.",
    isDefault: false,
  },
];

export const makePermissionCode = (
  resourceKey: string,
  action: PermissionAction
) => {
  const resource = permissionResources.find((item) => item.key === resourceKey);

  if (!resource) {
    throw new Error(`Unknown permission resource: ${resourceKey}`);
  }

  return `${resource.module.toLowerCase()}.${resource.key}.${action}`;
};

export const allPermissionCodes = permissionResources.flatMap((resource) =>
  resource.actions.map((action) => makePermissionCode(resource.key, action))
);

const grant = (
  resourceKey: string,
  actions: PermissionAction[]
) => actions.map((action) => makePermissionCode(resourceKey, action));

export const defaultRolePermissionCodesByCode: Record<DefaultRoleCode, string[]> = {
  SUPER_ADMIN: allPermissionCodes,
  ADMIN: [
    ...grant("dashboard", ["view"]),
    ...grant("antrian_jadwal", ["view", "create", "edit"]),
    ...grant("work_order", ["view", "create", "edit", "export"]),
    ...grant("riwayat_servis", ["view", "export"]),
    ...grant("reminder_servis", ["view", "create", "edit"]),
    ...grant("sparepart", ["view", "create", "edit", "export"]),
    ...grant("stok_masuk", ["view", "create", "edit", "export"]),
    ...grant("stok_keluar", ["view", "create", "edit", "export"]),
    ...grant("mutasi_stok", ["view", "create", "export"]),
    ...grant("stok_minimum", ["view", "edit"]),
    ...grant("purchase_order", ["view", "create", "edit", "export"]),
    ...grant("penerimaan_barang", ["view", "create", "edit", "export"]),
    ...grant("retur_pembelian", ["view", "create", "edit", "export"]),
    ...grant("invoice", ["view", "create", "edit", "export"]),
    ...grant("pembayaran", ["view", "create", "edit", "export"]),
    ...grant("kas_bank", ["view", "create", "edit", "export"]),
    ...grant("piutang", ["view", "edit", "export"]),
    ...grant("pelanggan", ["view", "create", "edit", "export"]),
    ...grant("kendaraan", ["view", "create", "edit", "export"]),
    ...grant("mekanik", ["view", "create", "edit"]),
    ...grant("supplier", ["view", "create", "edit"]),
    ...grant("jasa_servis", ["view", "create", "edit"]),
    ...grant("paket_servis", ["view", "create", "edit"]),
    ...grant("kategori_sparepart", ["view", "create", "edit"]),
    ...grant("kategori_jasa_servis", ["view", "create", "edit"]),
    ...grant("satuan", ["view", "create", "edit"]),
    ...grant("lokasi_stok", ["view", "create", "edit"]),
    ...grant("merk_kendaraan", ["view", "create", "edit"]),
    ...grant("alasan_retur", ["view", "create", "edit"]),
    ...grant("kondisi_barang", ["view", "create", "edit"]),
    ...grant("metode_pembayaran", ["view", "create", "edit"]),
    ...grant("laporan_servis", ["view", "export"]),
    ...grant("laporan_keuangan", ["view", "export"]),
    ...grant("laporan_stok", ["view", "export"]),
  ],
  MEKANIK: [
    ...grant("dashboard", ["view"]),
    ...grant("antrian_jadwal", ["view"]),
    ...grant("work_order", ["view", "edit"]),
    ...grant("riwayat_servis", ["view"]),
    ...grant("reminder_servis", ["view"]),
    ...grant("sparepart", ["view"]),
    ...grant("kendaraan", ["view"]),
    ...grant("jasa_servis", ["view"]),
    ...grant("paket_servis", ["view"]),
  ],
  KASIR: [
    ...grant("dashboard", ["view"]),
    ...grant("work_order", ["view"]),
    ...grant("invoice", ["view", "create", "edit", "export"]),
    ...grant("pembayaran", ["view", "create", "edit", "export"]),
    ...grant("kas_bank", ["view", "create", "edit", "export"]),
    ...grant("piutang", ["view", "edit", "export"]),
    ...grant("pelanggan", ["view"]),
    ...grant("laporan_keuangan", ["view", "export"]),
  ],
};

export const defaultRolePermissionCodes = defaultRoles.reduce(
  (acc, role) => {
    acc[role.name] = defaultRolePermissionCodesByCode[role.code];
    return acc;
  },
  {} as Record<DefaultRoleName, string[]>
);

export const hasPermission = (permissions: string[], permission?: string) => {
  if (!permission) {
    return true;
  }

  return permissions.includes(permission);
};

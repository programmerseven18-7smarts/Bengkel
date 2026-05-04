import "dotenv/config";

import { prisma } from "../src/lib/prisma";
import {
  defaultRolePermissionCodesByCode,
  defaultRoles,
  permissionResources,
} from "../src/lib/access-control";
import { hashPassword } from "../src/lib/auth/password";

const ownerPassword = process.env.SEED_OWNER_PASSWORD ?? "Owner@Auto7";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@Auto7";
const mekanikPassword = process.env.SEED_MEKANIK_PASSWORD ?? "Mekanik@Auto7";
const kasirPassword = process.env.SEED_KASIR_PASSWORD ?? "Kasir@Auto7";

type PermissionLookup = {
  id: string;
  kode: string;
};

type RoleLookup = {
  id: string;
  kode: string;
};

const seedPermissions = async () => {
  const permissionRows = permissionResources.flatMap((resource) =>
    resource.actions.map((action) => ({
      kode: `${resource.module.toLowerCase()}.${resource.key}.${action}`,
      module: resource.module,
      resource: resource.name,
      action,
      deskripsi: `${action} ${resource.name}`,
    }))
  );

  for (const permission of permissionRows) {
    await prisma.permission.upsert({
      where: {
        kode: permission.kode,
      },
      update: {
        module: permission.module,
        resource: permission.resource,
        action: permission.action,
        deskripsi: permission.deskripsi,
      },
      create: permission,
    });
  }
};

const seedRoles = async () => {
  await seedPermissions();

  const permissions = await prisma.permission.findMany({
    select: {
      id: true,
      kode: true,
    },
  });
  const permissionByCode = new Map<string, string>(
    (permissions as PermissionLookup[]).map((permission) => [
      permission.kode,
      permission.id,
    ])
  );

  for (const roleSeed of defaultRoles) {
    const role = await prisma.role.upsert({
      where: {
        kode: roleSeed.code,
      },
      update: {
        nama: roleSeed.name,
        deskripsi: roleSeed.description,
        isDefault: roleSeed.isDefault,
        status: "AKTIF",
      },
      create: {
        kode: roleSeed.code,
        nama: roleSeed.name,
        deskripsi: roleSeed.description,
        isDefault: roleSeed.isDefault,
        status: "AKTIF",
      },
    });

    await prisma.rolePermission.deleteMany({
      where: {
        roleId: role.id,
      },
    });

    const rolePermissions = defaultRolePermissionCodesByCode[roleSeed.code]
      .map((code) => permissionByCode.get(code))
      .filter(Boolean)
      .map((permissionId) => ({
        roleId: role.id,
        permissionId: permissionId as string,
        allowed: true,
      }));

    if (rolePermissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: rolePermissions,
        skipDuplicates: true,
      });
    }
  }
};

const seedUsers = async () => {
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      kode: true,
      nama: true,
    },
  });
  const roleByCode = new Map<string, string>(
    (roles as RoleLookup[]).map((role) => [role.kode, role.id])
  );

  const users = [
    {
      nama: "Owner Auto7",
      email: "owner@auto7.id",
      noHp: "081234567890",
      roleCode: "SUPER_ADMIN",
      password: ownerPassword,
    },
    {
      nama: "Admin Bengkel",
      email: "admin@auto7.id",
      noHp: "082345678901",
      roleCode: "ADMIN",
      password: adminPassword,
    },  
    {
      nama: "Mekanik Bengkel",
      email: "mekanik@auto7.id",
      noHp: "083456789012",
      roleCode: "MEKANIK",
      password: mekanikPassword,
    },
    {
      nama: "Kasir Bengkel",
      email: "kasir@auto7.id",
      noHp: "084567890123",
      roleCode: "KASIR",
      password: kasirPassword,
    },
  ] as const;

  for (const user of users) {
    const roleId = roleByCode.get(user.roleCode);

    if (!roleId) {
      throw new Error(`Role ${user.roleCode} belum tersedia`);
    }

    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        nama: user.nama,
        noHp: user.noHp,
        roleId,
        passwordHash: await hashPassword(user.password),
        status: "AKTIF",
      },
      create: {
        nama: user.nama,
        email: user.email,
        noHp: user.noHp,
        roleId,
        passwordHash: await hashPassword(user.password),
        status: "AKTIF",
      },
    });
  }
};

const seedMasterData = async () => {
  const kategoriPart = await Promise.all(
    [
      ["KSP-001", "Kampas Rem", "Komponen pengereman kendaraan"],
      ["KSP-002", "Oli & Cairan", "Oli mesin, oli gardan, dan cairan servis"],
      ["KSP-003", "Aki & Kelistrikan", "Aki, lampu, dan komponen listrik"],
      ["KSP-004", "Filter", "Filter oli, udara, dan kabin"],
    ].map(([kode, nama, deskripsi]) =>
      prisma.kategoriSparepart.upsert({
        where: { kode },
        update: { nama, deskripsi, status: "AKTIF" },
        create: { kode, nama, deskripsi, status: "AKTIF" },
      })
    )
  );

  const kategoriJasa = await Promise.all(
    [
      ["KJS-001", "Servis Berkala", "Jasa servis rutin kendaraan"],
      ["KJS-002", "Perbaikan Rem", "Pemeriksaan dan perbaikan sistem rem"],
      ["KJS-003", "Kelistrikan", "Pemeriksaan sistem kelistrikan"],
    ].map(([kode, nama, deskripsi]) =>
      prisma.kategoriJasaServis.upsert({
        where: { kode },
        update: { nama, deskripsi, status: "AKTIF" },
        create: { kode, nama, deskripsi, status: "AKTIF" },
      })
    )
  );

  const satuan = await Promise.all(
    [
      ["PCS", "Pcs", "Unit", "Satuan per barang"],
      ["LTR", "Liter", "Volume", "Satuan cairan"],
      ["SET", "Set", "Paket", "Satuan paket"],
    ].map(([kode, nama, jenis, deskripsi]) =>
      prisma.satuan.upsert({
        where: { kode },
        update: { nama, jenis, deskripsi, status: "AKTIF" },
        create: { kode, nama, jenis, deskripsi, status: "AKTIF" },
      })
    )
  );

  const lokasi = await Promise.all(
    [
      ["GUD-UTM", "Gudang Utama", "Gudang", "Penyimpanan utama sparepart"],
      ["RAK-REM", "Rak Rem", "Rak", "Lokasi komponen rem"],
      ["RAK-OLI", "Rak Oli", "Rak", "Lokasi oli dan cairan"],
    ].map(([kode, nama, tipe, deskripsi]) =>
      prisma.lokasiStok.upsert({
        where: { kode },
        update: { nama, tipe, deskripsi, status: "AKTIF" },
        create: { kode, nama, tipe, deskripsi, status: "AKTIF" },
      })
    )
  );

  const merk = await Promise.all(
    [
      ["MRK-001", "Honda", "Mobil"],
      ["MRK-002", "Toyota", "Mobil"],
      ["MRK-003", "Yamaha", "Motor"],
    ].map(([kode, nama, jenisKendaraan]) =>
      prisma.merkKendaraan.upsert({
        where: { kode },
        update: { nama, jenisKendaraan, status: "AKTIF" },
        create: { kode, nama, jenisKendaraan, status: "AKTIF" },
      })
    )
  );

  const supplier = await Promise.all(
    [
      {
        kode: "SUP-001",
        nama: "Sumber Sparepart Jaya",
        noHp: "0215550101",
        email: "sales@sumbersparepart.id",
        alamat: "Jl. Raya Otomotif No. 12",
        produkUtama: "Sparepart umum",
      },
      {
        kode: "SUP-002",
        nama: "Oli Mandiri",
        noHp: "0215550102",
        email: "sales@olimandiri.id",
        alamat: "Jl. Industri No. 21",
        produkUtama: "Oli dan cairan",
      },
    ].map((item) =>
      prisma.supplier.upsert({
        where: { kode: item.kode },
        update: { ...item, status: "AKTIF" },
        create: { ...item, status: "AKTIF" },
      })
    )
  );

  const pelanggan = await prisma.pelanggan.upsert({
    where: { kode: "PLG-001" },
    update: {
      nama: "Budi Santoso",
      noHp: "081111222333",
      email: "budi@example.com",
      alamat: "Jakarta Selatan",
      status: "AKTIF",
    },
    create: {
      kode: "PLG-001",
      nama: "Budi Santoso",
      noHp: "081111222333",
      email: "budi@example.com",
      alamat: "Jakarta Selatan",
      status: "AKTIF",
    },
  });

  await prisma.kendaraan.upsert({
    where: { platNomor: "B 1234 AUTO" },
    update: {
      pelangganId: pelanggan.id,
      merkId: merk[0].id,
      tipe: "Civic",
      tahun: 2021,
      warna: "Hitam",
    },
    create: {
      pelangganId: pelanggan.id,
      merkId: merk[0].id,
      platNomor: "B 1234 AUTO",
      tipe: "Civic",
      tahun: 2021,
      warna: "Hitam",
    },
  });

  await Promise.all(
    [
      {
        kode: "MEK-001",
        nama: "Rizky Maulana",
        noHp: "083456789012",
        spesialisasi: "Servis berkala",
      },
      {
        kode: "MEK-002",
        nama: "Andi Wijaya",
        noHp: "085678901234",
        spesialisasi: "Rem dan kaki-kaki",
      },
    ].map((item) =>
      prisma.mekanik.upsert({
        where: { kode: item.kode },
        update: { ...item, status: "AKTIF" },
        create: { ...item, status: "AKTIF" },
      })
    )
  );

  const jasa = await Promise.all(
    [
      {
        kode: "JS-001",
        nama: "Servis Berkala Ringan",
        kategoriId: kategoriJasa[0].id,
        harga: "150000",
        estimasiMenit: 60,
      },
      {
        kode: "JS-002",
        nama: "Ganti Kampas Rem Depan",
        kategoriId: kategoriJasa[1].id,
        harga: "120000",
        estimasiMenit: 45,
      },
    ].map((item) =>
      prisma.jasaServis.upsert({
        where: { kode: item.kode },
        update: { ...item, status: "AKTIF" },
        create: { ...item, status: "AKTIF" },
      })
    )
  );

  const spareparts = await Promise.all(
    [
      {
        kode: "SPR-001",
        nama: "Kampas Rem Depan Honda",
        kategoriId: kategoriPart[0].id,
        supplierId: supplier[0].id,
        satuanId: satuan[0].id,
        lokasiId: lokasi[1].id,
        stok: 12,
        minStok: 4,
        hargaBeli: "185000",
        hargaJual: "245000",
      },
      {
        kode: "SPR-002",
        nama: "Oli Mesin 10W-40 1L",
        kategoriId: kategoriPart[1].id,
        supplierId: supplier[1].id,
        satuanId: satuan[1].id,
        lokasiId: lokasi[2].id,
        stok: 36,
        minStok: 10,
        hargaBeli: "65000",
        hargaJual: "85000",
      },
    ].map((item) =>
      prisma.sparepart.upsert({
        where: { kode: item.kode },
        update: { ...item, status: "AKTIF" },
        create: { ...item, status: "AKTIF" },
      })
    )
  );

  const paket = await prisma.paketServis.upsert({
    where: { kode: "PKT-001" },
    update: {
      nama: "Paket Servis Ringan",
      jenisKendaraan: "Mobil",
      estimasiMenit: 90,
      hargaPaket: "250000",
      catatan: "Paket awal untuk servis berkala ringan",
      status: "AKTIF",
    },
    create: {
      kode: "PKT-001",
      nama: "Paket Servis Ringan",
      jenisKendaraan: "Mobil",
      estimasiMenit: 90,
      hargaPaket: "250000",
      catatan: "Paket awal untuk servis berkala ringan",
      status: "AKTIF",
    },
  });

  await prisma.paketServisJasa.upsert({
    where: {
      paketServisId_jasaServisId: {
        paketServisId: paket.id,
        jasaServisId: jasa[0].id,
      },
    },
    update: {
      estimasiMenit: 60,
      hargaNormal: "150000",
    },
    create: {
      paketServisId: paket.id,
      jasaServisId: jasa[0].id,
      estimasiMenit: 60,
      hargaNormal: "150000",
    },
  });

  await prisma.paketServisSparepart.upsert({
    where: {
      paketServisId_sparepartId: {
        paketServisId: paket.id,
        sparepartId: spareparts[1].id,
      },
    },
    update: {
      qty: "1",
      hargaNormal: "85000",
    },
    create: {
      paketServisId: paket.id,
      sparepartId: spareparts[1].id,
      qty: "1",
      hargaNormal: "85000",
    },
  });

  await Promise.all(
    [
      ["RTR-001", "Barang Rusak", "Pembelian", "Barang rusak saat diterima"],
      ["RTR-002", "Salah Kirim", "Pembelian", "Sparepart tidak sesuai pesanan"],
    ].map(([kode, nama, jenis, deskripsi]) =>
      prisma.alasanRetur.upsert({
        where: { kode },
        update: { nama, jenis, deskripsi, status: "AKTIF" },
        create: { kode, nama, jenis, deskripsi, status: "AKTIF" },
      })
    )
  );

  await Promise.all(
    [
      ["KON-001", "Baik", "Diterima", "Barang diterima dalam kondisi baik"],
      ["KON-002", "Rusak", "Diterima", "Barang diterima dalam kondisi rusak"],
    ].map(([kode, nama, kelompok, deskripsi]) =>
      prisma.kondisiBarang.upsert({
        where: { kode },
        update: { nama, kelompok, deskripsi, status: "AKTIF" },
        create: { kode, nama, kelompok, deskripsi, status: "AKTIF" },
      })
    )
  );

  await Promise.all(
    [
      ["PAY-001", "Tunai", "Cash", "Pembayaran tunai"],
      ["PAY-002", "Transfer Bank", "Transfer", "Pembayaran transfer bank"],
      ["PAY-003", "QRIS", "Digital", "Pembayaran QRIS"],
    ].map(([kode, nama, tipe, deskripsi]) =>
      prisma.metodePembayaran.upsert({
        where: { kode },
        update: { nama, tipe, deskripsi, status: "AKTIF" },
        create: { kode, nama, tipe, deskripsi, status: "AKTIF" },
      })
    )
  );

  await Promise.all(
    [
      {
        kode: "AKN-001",
        nama: "Kas Bengkel",
        tipe: "Kas",
        saldoAwal: "0",
      },
      {
        kode: "AKN-002",
        nama: "Bank Operasional",
        tipe: "Bank",
        namaBank: "BCA",
        noRekening: "1234567890",
        saldoAwal: "0",
      },
      {
        kode: "AKN-003",
        nama: "QRIS Bengkel",
        tipe: "Digital",
        namaBank: "QRIS",
        noRekening: "AUTO7-QRIS",
        saldoAwal: "0",
      },
    ].map((item) =>
      prisma.akunKasBank.upsert({
        where: { kode: item.kode },
        update: { ...item, status: "AKTIF" },
        create: { ...item, status: "AKTIF" },
      })
    )
  );
};

const main = async () => {
  await seedRoles();
  await seedUsers();
  await seedMasterData();

  const [roles, permissions, users] = await Promise.all([
    prisma.role.count(),
    prisma.permission.count(),
    prisma.user.count(),
  ]);

  console.log(
    `Seed selesai: ${roles} role, ${permissions} permission, ${users} user.`
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

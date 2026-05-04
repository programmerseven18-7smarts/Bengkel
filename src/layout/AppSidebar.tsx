"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  DatabaseIcon,
  GridIcon,
  HorizontaLDots,
  InventoryIcon,
  LockIcon,
  ReceiptIcon,
  ReportIcon,
  WalletIcon,
  WrenchIcon,
} from "../icons/index";
import { hasPermission, makePermissionCode } from "@/lib/access-control";
import type { AuthUser } from "@/lib/auth/types";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string;
  subItems?: {
    name: string;
    path: string;
    permission: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
    permission: makePermissionCode("dashboard", "view"),
  },
  {
    icon: <WrenchIcon />,
    name: "Servis",
    subItems: [
      {
        name: "Antrian & Jadwal",
        path: "/servis/antrian-jadwal",
        permission: makePermissionCode("antrian_jadwal", "view"),
        pro: false,
      },
      {
        name: "Work Order",
        path: "/servis/work-order",
        permission: makePermissionCode("work_order", "view"),
        pro: false,
      },
      {
        name: "Riwayat Servis",
        path: "/servis/riwayat",
        permission: makePermissionCode("riwayat_servis", "view"),
        pro: false,
      },
      {
        name: "Reminder Servis",
        path: "/servis/reminder",
        permission: makePermissionCode("reminder_servis", "view"),
        pro: false,
      },
    ],
  },
  {
    icon: <InventoryIcon />,
    name: "Inventory",
    subItems: [
      {
        name: "Sparepart",
        path: "/inventory/sparepart",
        permission: makePermissionCode("sparepart", "view"),
        pro: false,
      },
      {
        name: "Stok Masuk",
        path: "/inventory/stok-masuk",
        permission: makePermissionCode("stok_masuk", "view"),
        pro: false,
      },
      {
        name: "Stok Keluar",
        path: "/inventory/stok-keluar",
        permission: makePermissionCode("stok_keluar", "view"),
        pro: false,
      },
      {
        name: "Mutasi Stok",
        path: "/inventory/mutasi",
        permission: makePermissionCode("mutasi_stok", "view"),
        pro: false,
      },
      {
        name: "Stok Minimum",
        path: "/inventory/stok-minimum",
        permission: makePermissionCode("stok_minimum", "view"),
        pro: false,
      },
    ],
  },
  {
    icon: <ReceiptIcon />,
    name: "Pembelian",
    subItems: [
      {
        name: "Purchase Order",
        path: "/pembelian/purchase-order",
        permission: makePermissionCode("purchase_order", "view"),
        pro: false,
      },
      {
        name: "Penerimaan Barang",
        path: "/pembelian/penerimaan-barang",
        permission: makePermissionCode("penerimaan_barang", "view"),
        pro: false,
      },
      {
        name: "Retur Pembelian",
        path: "/pembelian/retur-pembelian",
        permission: makePermissionCode("retur_pembelian", "view"),
        pro: false,
      },
    ],
  },
  {
    icon: <WalletIcon />,
    name: "Keuangan",
    subItems: [
      {
        name: "Invoice",
        path: "/keuangan/invoice",
        permission: makePermissionCode("invoice", "view"),
        pro: false,
      },
      {
        name: "Pembayaran",
        path: "/keuangan/pembayaran",
        permission: makePermissionCode("pembayaran", "view"),
        pro: false,
      },
      {
        name: "Kas & Bank",
        path: "/keuangan/kas-bank",
        permission: makePermissionCode("kas_bank", "view"),
        pro: false,
      },
      {
        name: "Piutang",
        path: "/keuangan/piutang",
        permission: makePermissionCode("piutang", "view"),
        pro: false,
      },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <DatabaseIcon />,
    name: "Master Data",
    subItems: [
      {
        name: "Pelanggan",
        path: "/master/pelanggan",
        permission: makePermissionCode("pelanggan", "view"),
        pro: false,
      },
      {
        name: "Kendaraan",
        path: "/master/kendaraan",
        permission: makePermissionCode("kendaraan", "view"),
        pro: false,
      },
      {
        name: "Mekanik",
        path: "/master/mekanik",
        permission: makePermissionCode("mekanik", "view"),
        pro: false,
      },
      {
        name: "Supplier",
        path: "/master/supplier",
        permission: makePermissionCode("supplier", "view"),
        pro: false,
      },
      {
        name: "Jasa Servis",
        path: "/master/jasa-servis",
        permission: makePermissionCode("jasa_servis", "view"),
        pro: false,
      },
      {
        name: "Paket Servis",
        path: "/master/paket-servis",
        permission: makePermissionCode("paket_servis", "view"),
        pro: false,
      },
      {
        name: "Kategori Sparepart",
        path: "/master/kategori-sparepart",
        permission: makePermissionCode("kategori_sparepart", "view"),
        pro: false,
      },
      {
        name: "Kategori Jasa",
        path: "/master/kategori-jasa-servis",
        permission: makePermissionCode("kategori_jasa_servis", "view"),
        pro: false,
      },
      {
        name: "Satuan",
        path: "/master/satuan",
        permission: makePermissionCode("satuan", "view"),
        pro: false,
      },
      {
        name: "Lokasi Stok",
        path: "/master/lokasi-stok",
        permission: makePermissionCode("lokasi_stok", "view"),
        pro: false,
      },
      {
        name: "Merk Kendaraan",
        path: "/master/merk-kendaraan",
        permission: makePermissionCode("merk_kendaraan", "view"),
        pro: false,
      },
      {
        name: "Alasan Retur",
        path: "/master/alasan-retur",
        permission: makePermissionCode("alasan_retur", "view"),
        pro: false,
      },
      {
        name: "Kondisi Barang",
        path: "/master/kondisi-barang",
        permission: makePermissionCode("kondisi_barang", "view"),
        pro: false,
      },
      {
        name: "Metode Pembayaran",
        path: "/master/metode-pembayaran",
        permission: makePermissionCode("metode_pembayaran", "view"),
        pro: false,
      },
    ],
  },
  {
    icon: <ReportIcon />,
    name: "Laporan",
    subItems: [
      {
        name: "Laporan Servis",
        path: "/laporan/servis",
        permission: makePermissionCode("laporan_servis", "view"),
        pro: false,
      },
      {
        name: "Laporan Keuangan",
        path: "/laporan/keuangan",
        permission: makePermissionCode("laporan_keuangan", "view"),
        pro: false,
      },
      {
        name: "Laporan Stok",
        path: "/laporan/stok",
        permission: makePermissionCode("laporan_stok", "view"),
        pro: false,
      },
    ],
  },
  {
    icon: <LockIcon />,
    name: "Pengaturan",
    subItems: [
      {
        name: "Pengguna",
        path: "/pengaturan/pengguna",
        permission: makePermissionCode("pengguna", "view"),
        pro: false,
      },
      {
        name: "Role & Hak Akses",
        path: "/pengaturan/role",
        permission: makePermissionCode("role_hak_akses", "view"),
        pro: false,
      },
      {
        name: "Audit Log",
        path: "/pengaturan/audit-log",
        permission: makePermissionCode("audit_log", "view"),
        pro: false,
      },
    ],
  },
];

const filterNavItems = (items: NavItem[], permissions: string[]) =>
  items
    .map((item) => {
      if (!item.subItems) {
        return item;
      }

      return {
        ...item,
        subItems: item.subItems.filter((subItem) =>
          hasPermission(permissions, subItem.permission)
        ),
      };
    })
    .filter((item) =>
      item.subItems
        ? item.subItems.length > 0
        : hasPermission(permissions, item.permission)
    );

type AppSidebarProps = {
  user: AuthUser;
};

const AppSidebar: React.FC<AppSidebarProps> = ({ user }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const visibleNavItems = useMemo(
    () => filterNavItems(navItems, user.permissions),
    [user.permissions]
  );
  const visibleOthersItems = useMemo(
    () => filterNavItems(othersItems, user.permissions),
    [user.permissions]
  );

  type OpenSubmenu = {
    type: "main" | "others";
    index: number;
  };

  const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu | "closed" | null>(
    null
  );
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) =>
      path === "/"
        ? pathname === path
        : pathname === path || pathname.startsWith(`${path}/`),
    [pathname]
  );

  const activeSubmenu: OpenSubmenu | null = (() => {
    for (const menuType of ["main", "others"] as const) {
      const items = menuType === "main" ? visibleNavItems : visibleOthersItems;
      const activeIndex = items.findIndex((nav) =>
        nav.subItems?.some((subItem) => isActive(subItem.path))
      );

      if (activeIndex >= 0) {
        return {
          type: menuType,
          index: activeIndex,
        };
      }
    }

    return null;
  })();

  const currentOpenSubmenu =
    openSubmenu === "closed" ? null : openSubmenu ?? activeSubmenu;

  const renderMenuItems = (
    items: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                currentOpenSubmenu?.type === menuType && currentOpenSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  currentOpenSubmenu?.type === menuType && currentOpenSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                    currentOpenSubmenu?.type === menuType &&
                    currentOpenSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  currentOpenSubmenu?.type === menuType && currentOpenSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="ml-9 mt-2 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="ml-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    if (currentOpenSubmenu !== null) {
      const key = `${currentOpenSubmenu.type}-${currentOpenSubmenu.index}`;

      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [currentOpenSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    if (
      currentOpenSubmenu &&
      currentOpenSubmenu.type === menuType &&
      currentOpenSubmenu.index === index
    ) {
      setOpenSubmenu("closed");
      return;
    }

    setOpenSubmenu({
      type: menuType,
      index,
    });
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:mt-0 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                Auto7
              </span>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
              <span className="text-xl font-bold text-white">A</span>
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs uppercase leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu Utama"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(visibleNavItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-4 flex text-xs uppercase leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Lainnya"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(visibleOthersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

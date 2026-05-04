"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import ActionNoticeToast from "@/components/common/ActionNoticeToast";
import type { HeaderNotification } from "@/components/header/NotificationDropdown";
import type { AuthUser } from "@/lib/auth/types";
import React, { Suspense } from "react";

type AdminShellProps = {
  children: React.ReactNode;
  user: AuthUser;
  notifications: HeaderNotification[];
};

export default function AdminShell({
  children,
  user,
  notifications,
}: AdminShellProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <Suspense fallback={null}>
        <ActionNoticeToast />
      </Suspense>
      <AppSidebar user={user} />
      <Backdrop />
      <div
        className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader user={user} notifications={notifications} />
        <div className="mx-auto w-full max-w-(--breakpoint-2xl) overflow-x-hidden p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

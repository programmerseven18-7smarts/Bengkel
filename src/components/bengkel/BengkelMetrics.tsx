"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, ArrowDownIcon, WrenchIcon, BoxIconLine, DollarLineIcon, GroupIcon } from "@/icons";

const metrics = [
  {
    title: "Total Servis Hari Ini",
    value: "24",
    change: "+12.5%",
    isUp: true,
    icon: <WrenchIcon className="text-gray-800 size-6 dark:text-white/90" />,
  },
  {
    title: "Work Order Aktif",
    value: "8",
    change: "+5.2%",
    isUp: true,
    icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
  },
  {
    title: "Penjualan Sparepart",
    value: "Rp 4.850.000",
    change: "+8.7%",
    isUp: true,
    icon: <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />,
  },
  {
    title: "Pendapatan Bulan Ini",
    value: "Rp 127.500.000",
    change: "-2.3%",
    isUp: false,
    icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
  },
];

export const BengkelMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {metric.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>
            <Badge color={metric.isUp ? "success" : "error"}>
              {metric.isUp ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
              {metric.change}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

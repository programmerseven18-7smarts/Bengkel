"use client";

import React from "react";
import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  DollarLineIcon,
  GroupIcon,
  WrenchIcon,
} from "@/icons";

export type BengkelMetricIcon = "servis" | "work-order" | "sparepart" | "pendapatan";

export interface BengkelMetric {
  title: string;
  value: string;
  change?: string;
  isUp?: boolean;
  icon: BengkelMetricIcon;
}

interface BengkelMetricsProps {
  metrics: BengkelMetric[];
}

const icons: Record<BengkelMetricIcon, React.ReactNode> = {
  servis: <WrenchIcon className="text-gray-800 size-6 dark:text-white/90" />,
  "work-order": <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
  sparepart: <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />,
  pendapatan: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
};

export const BengkelMetrics = ({ metrics }: BengkelMetricsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            {icons[metric.icon]}
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>
            {metric.change && (
              <Badge color={metric.isUp ? "success" : "error"}>
                {metric.isUp ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon className="text-error-500" />
                )}
                {metric.change}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

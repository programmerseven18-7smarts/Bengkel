"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function RingkasanServis() {
  const series = [24, 8, 5, 3];
  const labels = ["Selesai", "Dikerjakan", "Antri", "Menunggu Part"];

  const options: ApexOptions = {
    colors: ["#12b76a", "#465fff", "#98a2b3", "#f79009"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: 330,
    },
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 500,
              color: "#667085",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: 600,
              color: "#1D2939",
              formatter: (val) => val,
            },
            total: {
              show: true,
              label: "Total Servis",
              fontSize: "14px",
              fontWeight: 500,
              color: "#667085",
              formatter: () => "40",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit",
      fontSize: "14px",
      fontWeight: 500,
      markers: {
        size: 8,
        shape: "circle",
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8,
      },
    },
    stroke: {
      width: 0,
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Ringkasan Servis
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Status servis hari ini
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Lihat Detail
              </DropdownItem>
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Export
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative py-6">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={300}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5 border-t border-gray-200 dark:border-gray-800">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Selesai Hari Ini
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-success-600 dark:text-success-500 sm:text-lg">
            24
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Sedang Proses
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-brand-500 dark:text-brand-400 sm:text-lg">
            8
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Menunggu
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-warning-600 dark:text-warning-500 sm:text-lg">
            8
          </p>
        </div>
      </div>
    </div>
  );
}

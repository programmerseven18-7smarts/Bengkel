"use client";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

interface AntrianItem {
  id: string;
  noAntrian: string;
  noWorkOrder: string;
  pelanggan: string;
  kendaraan: string;
  platNomor: string;
  keluhan: string;
  status: "Antri" | "Dikerjakan" | "Menunggu Part";
  mekanik: string | null;
  waktuMasuk: string;
}

const antrianData: AntrianItem[] = [
  {
    id: "1",
    noAntrian: "A01",
    noWorkOrder: "WO-2024-007",
    pelanggan: "Eko Prasetyo",
    kendaraan: "Honda PCX",
    platNomor: "B 4455 MNO",
    keluhan: "Ganti oli dan filter",
    status: "Dikerjakan",
    mekanik: "Rudi",
    waktuMasuk: "08:30",
  },
  {
    id: "2",
    noAntrian: "A02",
    noWorkOrder: "WO-2024-008",
    pelanggan: "Rina Susanti",
    kendaraan: "Toyota Innova",
    platNomor: "B 6677 PQR",
    keluhan: "Servis AC dan tune up",
    status: "Dikerjakan",
    mekanik: "Dimas",
    waktuMasuk: "09:15",
  },
  {
    id: "3",
    noAntrian: "A03",
    noWorkOrder: "WO-2024-009",
    pelanggan: "Hendra Gunawan",
    kendaraan: "Yamaha Aerox",
    platNomor: "B 8899 STU",
    keluhan: "Cek kelistrikan",
    status: "Menunggu Part",
    mekanik: "Ahmad",
    waktuMasuk: "09:45",
  },
  {
    id: "4",
    noAntrian: "A04",
    noWorkOrder: "WO-2024-010",
    pelanggan: "Maya Putri",
    kendaraan: "Honda Brio",
    platNomor: "B 1122 VWX",
    keluhan: "Ganti kampas rem",
    status: "Antri",
    mekanik: null,
    waktuMasuk: "10:00",
  },
  {
    id: "5",
    noAntrian: "A05",
    noWorkOrder: "WO-2024-011",
    pelanggan: "Doni Saputra",
    kendaraan: "Suzuki GSX",
    platNomor: "B 3344 YZA",
    keluhan: "Service berkala",
    status: "Antri",
    mekanik: null,
    waktuMasuk: "10:30",
  },
];

const getStatusColor = (status: AntrianItem["status"]) => {
  switch (status) {
    case "Antri":
      return "light";
    case "Dikerjakan":
      return "primary";
    case "Menunggu Part":
      return "warning";
    default:
      return "light";
  }
};

export default function AntrianServis() {
  const antri = antrianData.filter((item) => item.status === "Antri");
  const dikerjakan = antrianData.filter((item) => item.status === "Dikerjakan");
  const menungguPart = antrianData.filter((item) => item.status === "Menunggu Part");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Kolom Antri */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Antri
            </h3>
            <Badge color="light">{antri.length}</Badge>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {antri.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {item.noAntrian}
                </span>
                <Badge size="sm" color={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90 mb-1">
                {item.pelanggan}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {item.kendaraan} - {item.platNomor}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {item.keluhan}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Masuk: {item.waktuMasuk}
                </span>
                <Button size="sm" variant="primary">
                  Proses
                </Button>
              </div>
            </div>
          ))}
          {antri.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Tidak ada antrian
            </p>
          )}
        </div>
      </div>

      {/* Kolom Dikerjakan */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-4 bg-brand-50 dark:bg-brand-500/10 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-brand-600 dark:text-brand-400">
              Sedang Dikerjakan
            </h3>
            <Badge color="primary">{dikerjakan.length}</Badge>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {dikerjakan.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {item.noAntrian}
                </span>
                <Badge size="sm" color={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90 mb-1">
                {item.pelanggan}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {item.kendaraan} - {item.platNomor}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {item.keluhan}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                  Mekanik: {item.mekanik}
                </span>
                <Button size="sm" variant="outline">
                  Selesai
                </Button>
              </div>
            </div>
          ))}
          {dikerjakan.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Tidak ada yang dikerjakan
            </p>
          )}
        </div>
      </div>

      {/* Kolom Menunggu Part */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-4 bg-warning-50 dark:bg-warning-500/10 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-warning-600 dark:text-warning-400">
              Menunggu Part
            </h3>
            <Badge color="warning">{menungguPart.length}</Badge>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {menungguPart.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-warning-200 dark:border-warning-500/30 bg-warning-50/50 dark:bg-warning-500/5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                  {item.noAntrian}
                </span>
                <Badge size="sm" color={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90 mb-1">
                {item.pelanggan}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {item.kendaraan} - {item.platNomor}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {item.keluhan}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-warning-600 dark:text-warning-400 font-medium">
                  Mekanik: {item.mekanik}
                </span>
                <Button size="sm" variant="primary">
                  Part Tersedia
                </Button>
              </div>
            </div>
          ))}
          {menungguPart.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Tidak ada yang menunggu part
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

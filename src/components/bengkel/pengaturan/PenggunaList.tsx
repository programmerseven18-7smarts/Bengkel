"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { Modal } from "@/components/ui/modal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "@/lib/users/actions";

type UserStatus = "AKTIF" | "NONAKTIF";

export type UserRow = {
  id: string;
  nama: string;
  email: string;
  noHp: string | null;
  roleId: string | null;
  roleKode: string;
  roleNama: string;
  terakhirLogin: string | null;
  status: UserStatus;
};

export type RoleOption = {
  id: string;
  kode: string;
  nama: string;
};

type UserModalState =
  | {
      mode: "create";
      user?: undefined;
    }
  | {
      mode: "edit";
      user: UserRow;
    };

type PenggunaListProps = {
  users: UserRow[];
  roles: RoleOption[];
};

const roleColor = (roleCode: string) => {
  if (roleCode === "SUPER_ADMIN") return "primary";
  if (roleCode === "ADMIN") return "info";
  if (roleCode === "MEKANIK") return "warning";
  if (roleCode === "KASIR") return "success";
  return "light";
};

const formatLoginDate = (value: string | null) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export default function PenggunaList({ users, roles }: PenggunaListProps) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<UserModalState | null>(null);

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) =>
      `${user.nama} ${user.email} ${user.noHp ?? ""} ${user.roleNama} ${
        user.roleKode
      }`
        .toLowerCase()
        .includes(keyword)
    );
  }, [query, users]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Cari pengguna..."
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Button
            size="md"
            variant="primary"
            onClick={() => setModal({ mode: "create" })}
          >
            Tambah Pengguna
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[920px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    No
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Pengguna
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Role
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Terakhir Login
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.nama}
                      </p>
                      <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {user.email} | {user.noHp || "-"}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex flex-col items-start gap-1">
                        <Badge size="sm" color={roleColor(user.roleKode)}>
                          {user.roleNama}
                        </Badge>
                        <span className="font-mono text-theme-xs text-gray-500 dark:text-gray-400">
                          {user.roleKode}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {formatLoginDate(user.terakhirLogin)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={user.status === "AKTIF" ? "success" : "light"}
                      >
                        {user.status === "AKTIF" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setModal({ mode: "edit", user })}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400"
                          aria-label={`Edit ${user.nama}`}
                        >
                          <PencilIcon className="size-5" />
                        </button>
                        <form
                          action={deleteUserAction}
                          onSubmit={(event) => {
                            if (!confirm(`Hapus pengguna ${user.nama}?`)) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={user.id} />
                          <button
                            type="submit"
                            className="text-gray-500 hover:text-error-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400"
                            disabled={user.roleKode === "SUPER_ADMIN"}
                            aria-label={`Hapus ${user.nama}`}
                          >
                            <TrashBinIcon className="size-5" />
                          </button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500 dark:border-white/[0.05] dark:text-gray-400">
          Total pengguna: {filteredUsers.length}
        </div>
      </div>

      <UserFormModal
        modal={modal}
        roles={roles}
        onClose={() => setModal(null)}
      />
    </>
  );
}

function UserFormModal({
  modal,
  roles,
  onClose,
}: {
  modal: UserModalState | null;
  roles: RoleOption[];
  onClose: () => void;
}) {
  const user = modal?.mode === "edit" ? modal.user : undefined;
  const isEdit = modal?.mode === "edit";

  return (
    <Modal
      isOpen={!!modal}
      onClose={onClose}
      showCloseButton={false}
      className="mx-4 w-full max-w-3xl max-h-[90vh] overflow-hidden p-0"
    >
      <form
        action={isEdit ? updateUserAction : createUserAction}
        onSubmit={onClose}
        className="flex max-h-[90vh] flex-col"
      >
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pilih role dari data role yang aktif.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 overflow-y-auto px-6 py-5 md:grid-cols-2">
          {user && <input type="hidden" name="id" value={user.id} />}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Nama
            </label>
            <Input name="nama" placeholder="Nama pengguna" defaultValue={user?.nama} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Email
            </label>
            <Input
              name="email"
              type="email"
              placeholder="nama@auto7.id"
              defaultValue={user?.email}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              No. HP
            </label>
            <Input name="noHp" placeholder="08xxxxxxxxxx" defaultValue={user?.noHp ?? ""} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Role
            </label>
            <select
              name="roleId"
              defaultValue={user?.roleId ?? roles[0]?.id ?? ""}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.nama} ({role.kode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Status
            </label>
            <select
              name="status"
              defaultValue={user?.status ?? "AKTIF"}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Password
            </label>
            <Input
              name="password"
              type="password"
              placeholder={isEdit ? "Kosongkan jika tidak diganti" : "Password awal"}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit">
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
}

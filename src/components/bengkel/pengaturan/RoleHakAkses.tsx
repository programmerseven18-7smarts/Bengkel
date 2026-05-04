"use client";

import { Fragment, useMemo, useState } from "react";
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
import { LockIcon, PencilIcon, TrashBinIcon } from "@/icons";
import {
  createRoleAction,
  deleteRoleAction,
  updateRoleAction,
  updateRolePermissionsAction,
} from "@/lib/roles/actions";
import {
  makePermissionCode,
  permissionActions,
  permissionResources,
  type PermissionAction,
} from "@/lib/access-control";

export type RoleRow = {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string | null;
  isDefault: boolean;
  status: "AKTIF" | "TIDAK_AKTIF";
  userCount: number;
  permissionCodes: string[];
};

type RoleModalState =
  | {
      mode: "create";
      role?: undefined;
    }
  | {
      mode: "edit";
      role: RoleRow;
    };

type RoleHakAksesProps = {
  roles: RoleRow[];
};

const countRoleResources = (permissionCodes: string[]) =>
  new Set(permissionCodes.map((code) => code.split(".").slice(0, 2).join(".")))
    .size;

const formatRoleCode = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export default function RoleHakAkses({ roles }: RoleHakAksesProps) {
  const [roleModal, setRoleModal] = useState<RoleModalState | null>(null);
  const [permissionRole, setPermissionRole] = useState<RoleRow | null>(null);

  const selectedPermissionCodes = useMemo(
    () => new Set(permissionRole?.permissionCodes ?? []),
    [permissionRole]
  );
  const isSuperAdmin = permissionRole?.kode === "SUPER_ADMIN";

  const isChecked = (resourceKey: string, action: PermissionAction) => {
    const code = makePermissionCode(resourceKey, action);
    return isSuperAdmin || selectedPermissionCodes.has(code);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Daftar Role
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Kode role dipakai sebagai identitas akses, misalnya SUPER_ADMIN,
              ADMIN, MEKANIK, dan KASIR.
            </p>
          </div>
          <Button
            size="md"
            variant="primary"
            onClick={() => setRoleModal({ mode: "create" })}
          >
            Tambah Role
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[980px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    No
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Role
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Kode
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    User
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    Resource
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
                {roles.map((role, index) => (
                  <TableRow key={role.id}>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {role.nama}
                      </p>
                      <p className="max-w-[360px] text-gray-500 text-theme-xs dark:text-gray-400">
                        {role.deskripsi || "-"}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-theme-xs font-semibold text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                        {role.kode}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-800 text-theme-sm dark:text-white/90">
                      {role.userCount}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center text-gray-800 text-theme-sm dark:text-white/90">
                      {countRoleResources(role.permissionCodes)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={role.status === "AKTIF" ? "success" : "light"}
                      >
                        {role.status === "AKTIF" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                      {role.isDefault && (
                        <span className="ml-2 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-theme-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                          Default
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPermissionRole(role)}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400"
                          aria-label={`Kelola hak akses ${role.nama}`}
                          title="Kelola Hak Akses"
                        >
                          <LockIcon className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoleModal({ mode: "edit", role })}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400"
                          aria-label={`Edit role ${role.nama}`}
                          title="Edit Role"
                        >
                          <PencilIcon className="size-5" />
                        </button>
                        <form
                          action={deleteRoleAction}
                          onSubmit={(event) => {
                            if (
                              !confirm(`Hapus role ${role.nama}?`)
                            ) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={role.id} />
                          <button
                            type="submit"
                            className="text-gray-500 hover:text-error-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400"
                            disabled={role.isDefault || role.userCount > 0}
                            aria-label={`Hapus role ${role.nama}`}
                            title="Hapus Role"
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
      </div>

      <RoleFormModal
        key={
          roleModal
            ? roleModal.mode === "edit"
              ? roleModal.role.id
              : "create"
            : "closed"
        }
        modal={roleModal}
        onClose={() => setRoleModal(null)}
      />
      <PermissionModal
        role={permissionRole}
        selectedPermissionCodes={selectedPermissionCodes}
        isSuperAdmin={isSuperAdmin}
        onClose={() => setPermissionRole(null)}
        isChecked={isChecked}
      />
    </>
  );
}

function RoleFormModal({
  modal,
  onClose,
}: {
  modal: RoleModalState | null;
  onClose: () => void;
}) {
  const role = modal?.mode === "edit" ? modal.role : undefined;
  const isEdit = modal?.mode === "edit";
  const [namaDraft, setNamaDraft] = useState(role?.nama ?? "");

  const roleCode = isEdit ? role?.kode ?? "" : formatRoleCode(namaDraft);

  return (
    <Modal
      isOpen={!!modal}
      onClose={onClose}
      showCloseButton={false}
      className="mx-4 w-full max-w-2xl max-h-[90vh] overflow-hidden p-0"
    >
      <form
        action={isEdit ? updateRoleAction : createRoleAction}
        onSubmit={onClose}
        className="flex max-h-[90vh] flex-col"
      >
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit Role" : "Tambah Role"}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kode role dibuat otomatis dari nama role dan dipakai sebagai
            identitas akses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 overflow-y-auto px-6 py-5 md:grid-cols-2">
          {role && <input type="hidden" name="id" value={role.id} />}
          <input type="hidden" name="kode" value={roleCode} />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Kode Role
            </label>
            <Input
              placeholder="Otomatis dari nama role"
              value={roleCode}
              readOnly
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Nama Role
            </label>
            <Input
              name="nama"
              placeholder="Owner"
              value={namaDraft}
              onChange={(event) => setNamaDraft(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Status
            </label>
            <select
              name="status"
              defaultValue={role?.status ?? "AKTIF"}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="AKTIF">Aktif</option>
              <option value="TIDAK_AKTIF">Tidak Aktif</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              placeholder="Deskripsi role"
              defaultValue={role?.deskripsi ?? ""}
              className="min-h-24 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
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

function PermissionModal({
  role,
  selectedPermissionCodes,
  isSuperAdmin,
  onClose,
  isChecked,
}: {
  role: RoleRow | null;
  selectedPermissionCodes: Set<string>;
  isSuperAdmin: boolean;
  onClose: () => void;
  isChecked: (resourceKey: string, action: PermissionAction) => boolean;
}) {
  return (
    <Modal
      isOpen={!!role}
      onClose={onClose}
      showCloseButton={false}
      className="mx-4 w-full max-w-6xl max-h-[90vh] overflow-hidden p-0"
    >
      <form
        action={updateRolePermissionsAction}
        onSubmit={onClose}
        className="flex max-h-[90vh] flex-col"
      >
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Kelola Hak Akses
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Role:{" "}
            <span className="font-medium text-gray-800 dark:text-white/90">
              {role?.nama}
            </span>{" "}
            <span className="font-mono text-xs text-gray-500">
              ({role?.kode})
            </span>
          </p>
        </div>

        {role && <input type="hidden" name="roleId" value={role.id} />}

        <div className="max-h-[calc(90vh-150px)] overflow-auto px-6 py-5">
          <div className="min-w-[1080px] overflow-hidden rounded-lg border border-gray-200 dark:border-white/[0.05]">
            <Table>
              <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
                <TableRow>
                  <TableCell isHeader className="w-[300px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Resource
                  </TableCell>
                  {permissionActions.map((action) => (
                    <TableCell key={action.key} isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      {action.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {permissionResources.map((resource, index) => {
                  const showModule =
                    index === 0 ||
                    permissionResources[index - 1].module !== resource.module;

                  return (
                    <Fragment key={resource.key}>
                      {showModule && (
                        <TableRow>
                          <TableCell
                            colSpan={permissionActions.length + 1}
                            className="bg-gray-50 px-5 py-3 text-theme-xs font-semibold text-gray-600 dark:bg-white/[0.03] dark:text-gray-300"
                          >
                            MODUL: {resource.moduleLabel.toUpperCase()}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">
                          {resource.name}
                        </TableCell>
                        {permissionActions.map((action) => {
                          const allowed = resource.actions.includes(action.key);
                          const permissionCode = allowed
                            ? makePermissionCode(resource.key, action.key)
                            : "";

                          return (
                            <TableCell key={action.key} className="px-5 py-4 text-center">
                              {allowed ? (
                                <input
                                  type="checkbox"
                                  name="permissionCodes"
                                  value={permissionCode}
                                  defaultChecked={
                                    isChecked(resource.key, action.key) ||
                                    selectedPermissionCodes.has(permissionCode)
                                  }
                                  disabled={isSuperAdmin}
                                  className="h-5 w-5 cursor-pointer rounded-md border-gray-300 text-brand-500 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700"
                                />
                              ) : (
                                <span className="text-gray-400 dark:text-gray-600">-</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit">
            Simpan Hak Akses
          </Button>
        </div>
      </form>
    </Modal>
  );
}

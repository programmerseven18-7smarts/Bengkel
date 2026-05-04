"use client";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  message?: string;
  hiddenFields?: Record<string, string | number | undefined>;
  formAction?: (formData: FormData) => void | Promise<void>;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  title = "Hapus Data",
  itemName,
  message,
  hiddenFields,
  formAction,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const content = (
    <>
      {hiddenFields &&
        Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={String(value ?? "")} />
        ))}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {message ||
          `Yakin ingin menghapus ${itemName ? `"${itemName}"` : "data ini"}? Data yang dihapus tidak bisa dikembalikan.`}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button
          variant="primary"
          type={formAction ? "submit" : "button"}
          onClick={formAction ? undefined : onConfirm}
          className="bg-error-500 hover:bg-error-600 disabled:bg-error-300"
        >
          Hapus
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto p-0"
    >
      {formAction ? (
        <form action={formAction} onSubmit={onClose} className="p-6">
          {content}
        </form>
      ) : (
        <div className="p-6">{content}</div>
      )}
    </Modal>
  );
}

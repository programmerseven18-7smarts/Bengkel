"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";

type FieldType = "text" | "number" | "email" | "date" | "select";

export interface MasterRecordField {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: "full";
  readOnly?: boolean;
}

export type MasterRecordValue = string | number | undefined;
export type MasterRecordData = Record<string, MasterRecordValue>;
type MasterRecordFormAction = (formData: FormData) => void | Promise<void>;

interface MasterRecordModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  fields: MasterRecordField[];
  initialValues?: MasterRecordData;
  hiddenFields?: Record<string, MasterRecordValue>;
  formAction?: MasterRecordFormAction;
  onClose: () => void;
  onSubmit?: (values: MasterRecordData) => void;
}

export default function MasterRecordModal({
  isOpen,
  title,
  description,
  fields,
  initialValues,
  hiddenFields,
  formAction,
  onClose,
  onSubmit,
}: MasterRecordModalProps) {
  const initialSelectValues = useMemo(() => {
    return fields.reduce<Record<string, string>>((acc, field) => {
      if (field.type === "select") {
        acc[field.name] = String(initialValues?.[field.name] || "");
      }
      return acc;
    }, {});
  }, [fields, initialValues]);

  const [selectValues, setSelectValues] = useState(initialSelectValues);

  useEffect(() => {
    setSelectValues(initialSelectValues);
  }, [initialSelectValues]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (formAction) {
      onClose();
      return;
    }

    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = fields.reduce<MasterRecordData>((acc, field) => {
      const value = field.type === "select" ? selectValues[field.name] : formData.get(field.name);
      acc[field.name] = field.type === "number" ? Number(value || 0) : String(value || "");
      return acc;
    }, {});
    onSubmit?.(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="mx-4 w-full max-w-3xl max-h-[90vh] overflow-hidden p-0"
    >
      <form
        action={formAction}
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] flex-col"
      >
        {hiddenFields &&
          Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={String(value ?? "")} />
          ))}

        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.colSpan === "full" ? "md:col-span-2" : ""}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <>
                  <Select
                    options={field.options || []}
                    placeholder={field.placeholder || `Pilih ${field.label.toLowerCase()}`}
                    defaultValue={selectValues[field.name] || ""}
                    onChange={(value) => setSelectValues((prev) => ({ ...prev, [field.name]: value }))}
                  />
                  <input
                    type="hidden"
                    name={field.name}
                    value={selectValues[field.name] || ""}
                  />
                  </>
                ) : (
                  <Input
                    name={field.name}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    defaultValue={initialValues?.[field.name] ?? (field.readOnly ? field.placeholder : undefined)}
                    readOnly={field.readOnly}
                  />
                )}
              </div>
            ))}
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

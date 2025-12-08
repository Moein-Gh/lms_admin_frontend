"use client";

import React, { useRef } from "react";
import { Controller, Control, FieldValues, Path, ControllerRenderProps } from "react-hook-form";

type UploadFieldProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  onFilesChange?: (files: File[]) => void;
};

/**
 * A small, accessible file upload field integrated with react-hook-form's Controller.
 * - RTL-friendly labels (Persian by default)
 * - Uses a hidden native file input and exposes a styled drop/select area
 * - Controlled through `control` and `name` from react-hook-form
 */
export function UploadField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
  name,
  control,
  label = "بارگذاری فایل‌ها",
  description,
  accept,
  multiple = false,
  maxFiles = 5,
  disabled = false,
  onFilesChange
}: UploadFieldProps<TFieldValues, TName>) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Controller<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field, fieldState }: { field: ControllerRenderProps<TFieldValues, TName>; fieldState: any }) => {
        const files: File[] = Array.isArray(field.value) ? (field.value as File[]) : [];

        const openPicker = () => {
          if (disabled) return;
          inputRef.current?.click();
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const picked = e.target.files ? Array.from(e.target.files) : [];
          const next = multiple ? picked.slice(0, maxFiles) : picked.slice(0, 1);
          field.onChange(next);
          onFilesChange?.(next);
        };

        const removeAt = (index: number) => {
          const next = files.filter((_, i) => i !== index);
          field.onChange(next);
          onFilesChange?.(next);
        };

        return (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}

            <div className="mt-2">
              <div
                role="button"
                tabIndex={0}
                onClick={openPicker}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
                className={
                  "flex items-center justify-center gap-3 rounded-md border border-dashed p-4 text-sm text-gray-600 dark:text-gray-300 " +
                  (disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800")
                }
                aria-disabled={disabled}
                data-slot="upload"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4 4 4" />
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 21H3" />
                </svg>
                <span>{multiple ? "فایل‌ها را انتخاب یا رها کنید" : "فایل را انتخاب یا رها کنید"}</span>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
                className="hidden"
                aria-hidden
              />

              {fieldState.error && <p className="text-xs text-red-600 mt-2">{String(fieldState.error.message)}</p>}

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                      <div className="truncate">{f.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">{Math.round(f.size / 1024)} KB</div>
                        <button
                          type="button"
                          onClick={() => removeAt(i)}
                          className="text-red-600 hover:underline"
                          aria-label={`حذف ${f.name}`}
                        >
                          حذف
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}

export default UploadField;

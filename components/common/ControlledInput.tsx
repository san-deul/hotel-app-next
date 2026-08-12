"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";

type ControlledInputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  format?: (value: string) => string;
};

export function ControlledInput<T extends FieldValues>({
  label,
  name,
  control,
  error,
  type = "text",
  placeholder = "",
  disabled = false,
  readOnly = false,
  format,
}: ControlledInputProps<T>) {
  return (
    <div className="mb-4">
      <label className="font-semibold block mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            onChange={(e) => {
              const value = format ? format(e.target.value) : e.target.value;
              field.onChange(value);
            }}
            className="border rounded w-full p-2 disabled:bg-gray-100 disabled:text-gray-600"
          />
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
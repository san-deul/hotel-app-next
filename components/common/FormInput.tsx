import { FieldError, UseFormRegister, FieldValues, Path } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  type?: string;
  placeholder?: string;
};

export function FormInput<T extends FieldValues>({
  label,
  name,
  register,
  error,
  type = "text",
  placeholder = "",
}: FormInputProps<T>) {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full border rounded px-3 py-2"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
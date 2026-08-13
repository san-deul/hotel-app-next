"use client";

import { Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { ReserveFormValues } from "@/lib/schemas/reserveSchema";
import { formatPhone, handleFormattedBackspace } from "@/lib/utils/format";


interface Props {
  register: UseFormRegister<ReserveFormValues>;
  control: Control<ReserveFormValues>;
  errors: FieldErrors<ReserveFormValues>;
}

export default function CustomerInfoSection({ register, control, errors }: Props) {
  return (
    <section className="bg-white border rounded-xl p-6 shadow">
      <h2 className="text-2xl font-semibold mb-1">예약 고객 정보 입력</h2>
      <p className="text-sm text-gray-500 mb-6">* 필수 입력 항목입니다.</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">
            성명 (한글)<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            {...register("name")}
            className="border p-3 rounded w-full"
            placeholder="홍길동"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            연락처<span className="text-red-500 ml-1">*</span>
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(formatPhone (e.target.value))}
                onKeyDown={(e) => handleFormattedBackspace(e, formatPhone, field.onChange)}
                inputMode="numeric"
                className="border p-3 rounded w-full"
                placeholder="010-1234-5678"
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block font-medium mb-1">
            이메일<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            {...register("email")}
            className="border p-3 rounded w-full"
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
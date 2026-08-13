// components/reserve/CardInfoSection.tsx
"use client";

import { type UseFormRegister, type FieldErrors, type Control, Controller } from "react-hook-form";
import type { ReserveFormValues } from "@/lib/schemas/reserveSchema";
import { formatCardNo, handleFormattedBackspace } from "@/lib/utils/format";

interface Props {
  register: UseFormRegister<ReserveFormValues>;
  control: Control<ReserveFormValues>;
  errors: FieldErrors<ReserveFormValues>;
}

export default function CardInfoSection({ register, control, errors }: Props) {
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <section className="bg-white border rounded-xl p-6 shadow">
      <h2 className="text-2xl font-semibold mb-6">신용카드 정보 입력</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            카드번호<span className="text-red-500 ml-1">*</span>
          </label>
          <Controller
            name="cardNo"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(formatCardNo(e.target.value))}
                onKeyDown={(e) => handleFormattedBackspace(e, formatCardNo, field.onChange)}
                inputMode="numeric"
                className="border p-3 rounded w-full"
                placeholder="0000-0000-0000-0000"
              />
            )}
          />
          {errors.cardNo && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNo.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              유효기간(년)<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("cardExpYear")}
              inputMode="numeric"
              className="border p-3 rounded w-full"
              placeholder="2025"
            />
            {errors.cardExpYear && (
              <p className="text-red-500 text-sm mt-1">{errors.cardExpYear.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              유효기간(월)<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("cardExpMonth")}
              inputMode="numeric"
              className="border p-3 rounded w-full"
              placeholder="12"
            />
            {errors.cardExpMonth && (
              <p className="text-red-500 text-sm mt-1">{errors.cardExpMonth.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            생년월일<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            {...register("cardAuthBirth")}
            inputMode="numeric"
            maxLength={6}
            className="border p-3 rounded w-full"
            placeholder="900101"
          />
          {errors.cardAuthBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.cardAuthBirth.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
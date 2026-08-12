"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema, type CategoryFormValues } from "@/lib/schemas/roomSchema";
import { useUpdateCategory } from "@/hooks/mutations/useUpdateCategory";
import type { RoomRow } from "@/lib/api/room";

interface CategoryDetailProps {
  category: RoomRow;
}

export default function CategoryDetail({ category }: CategoryDetailProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      room_name: category.room_name,
    },
  });

  const updateMutation = useUpdateCategory(category.room_no);

  const onSubmit = (values: CategoryFormValues) => {
    updateMutation.mutate(values, {
      onSuccess: () => {
        alert("수정완료!");
      },
      onError: (err) => {
        alert("수정 중 오류: " + err.message);
      },
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">객실 상세정보</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">객실명</label>
          <input className="border p-2 w-full" {...register("room_name")} />
          {errors.room_name && (
            <p className="text-red-500 text-sm">{errors.room_name.message}</p>
          )}
        </div>

        <button className="bg-[#696cff] text-white px-4 py-2 rounded">
          수정완료
        </button>
      </form>
    </div>
  );
}
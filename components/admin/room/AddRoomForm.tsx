"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { roomSchema, type RoomFormValues } from "@/lib/schemas/roomSchema";
import { useAddRoom } from "@/hooks/mutations/useAddRoom";
import { useRooms } from "@/hooks/queries/useRooms";

export default function AddRoomForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: yupResolver(roomSchema),
  });

  const parentNo = watch("parentNo");

  const { data: rooms } = useRooms();
  const addRoomMutation = useAddRoom();

  const categories = (rooms ?? [])
    .filter((r) => r.depth === 0)
    .sort((a, b) => a.room_no - b.room_no);

  const childRooms = (rooms ?? []).filter(
    (r) => r.depth === 1 && String(r.parent_no) === String(parentNo)
  );

  const newRoomNo = parentNo ? Number(parentNo) + childRooms.length + 1 : null;

  const onSubmit = (values: RoomFormValues) => {
    if (!newRoomNo) {
      alert("대분류를 먼저 선택해주세요.");
      return;
    }

    addRoomMutation.mutate(
      { ...values, newRoomNo },
      {
        onSuccess: () => {
          alert("객실 유형이 추가되었습니다!");
          reset();
        },
        onError: (err) => {
          alert("추가 실패: " + err.message);
        },
      }
    );
  };

  return (
    <div className="mt-10 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-2">객실유형 추가하기 ▼</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <select className="border px-2 py-1" {...register("parentNo")}>
            <option value="">대분류 선택</option>
            {categories.map((cat) => (
              <option key={cat.room_no} value={cat.room_no}>
                {cat.room_no} {cat.room_name}
              </option>
            ))}
          </select>
          {errors.parentNo && (
            <p className="text-red-500 text-sm">{errors.parentNo.message}</p>
          )}
        </div>

        <div className="mt-3">
          <label>객실명</label>
          <input className="border w-full" {...register("room_name")} />
          {errors.room_name && (
            <p className="text-red-500 text-sm">{errors.room_name.message}</p>
          )}
        </div>

        <div className="mt-3">
          <label>정보</label>
          <input className="border w-full" {...register("info")} />
        </div>

        <div className="mt-3">
          <label>가격</label>
          <input className="border w-full" {...register("price")} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        <div className="mt-3">
          <label>인원수</label>
          <input className="border w-full" {...register("guest_count")} />
          {errors.guest_count && (
            <p className="text-red-500 text-sm">{errors.guest_count.message}</p>
          )}
        </div>

        <div className="mt-3">
          <label>객실수</label>
          <input className="border w-full" {...register("total_room")} />
          {errors.total_room && (
            <p className="text-red-500 text-sm">{errors.total_room.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={addRoomMutation.isPending}
          className="mt-4 px-3 py-2 bg-[#696cff] text-white rounded disabled:opacity-50"
        >
          {addRoomMutation.isPending ? "추가 중..." : "객실유형 추가하기"}
        </button>
      </form>
    </div>
  );
}
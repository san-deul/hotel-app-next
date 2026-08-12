"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { addCategory } from "@/lib/api/room";

import { roomsKey, useRooms } from "@/hooks/queries/useRooms";


const POSSIBLE_NUMBERS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export default function AddCategoryForm() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [selectedNo, setSelectedNo] = useState<number | "">("");
  const [roomName, setRoomName] = useState("");

  const { data: rooms } = useRooms();

  const existing = (rooms ?? [])
    .filter((r) => r.depth === 0)
    .map((r) => r.room_no);

  const availableNumbers = POSSIBLE_NUMBERS.filter((num) => !existing.includes(num));

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      selectedNo,
      roomName,
    }: {
      selectedNo: number | "";
      roomName: string;
    }) => {
      if (!selectedNo || !roomName.trim()) {
        throw new Error("필수 항목을 입력해주세요");
      }
      await addCategory(supabase, { room_no: selectedNo, room_name: roomName });
    },
    onSuccess: () => {
      alert("대분류가 추가되었습니다!");
      queryClient.invalidateQueries({ queryKey: roomsKey });
      setSelectedNo("");
      setRoomName("");
    },
    onError: (err: Error) => {
      alert("추가 중 오류: " + err.message);
    },
  });

  return (
    <div className="mt-10 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-3">객실 대분류 추가하기 ▼</h3>

      <select
        value={selectedNo}
        onChange={(e) => setSelectedNo(e.target.value ? Number(e.target.value) : "")}
        className="border px-2 py-1"
      >
        <option value="">번호 선택</option>
        {availableNumbers.map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="객실명"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="border ml-2 px-2 py-1"
      />

      <button
        onClick={() => mutate({ selectedNo, roomName })}
        disabled={isPending}
        className="bg-[#696cff] text-white ml-2 border px-3 py-1 disabled:opacity-50"
      >
        {isPending ? "추가 중..." : "대분류 추가하기"}
      </button>
    </div>
  );
}
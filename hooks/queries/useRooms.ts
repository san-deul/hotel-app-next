"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchRooms, type RoomRow } from "@/lib/api/room";

// 다른 컴포넌트(AddRoomForm, AddCategoryForm 등)에서
// invalidateQueries할 때 이 키를 그대로 import해서 씁니다.
// 문자열을 직접 타이핑하지 않게 해서 오타 버그를 막는 게 목적이에요.
export const roomsKey = ["rooms"] as const;

export function useRooms(initialRooms?: RoomRow[]) {
  const supabase = createClient();

  return useQuery({
    queryKey: roomsKey,
    queryFn: () => fetchRooms(supabase),
    initialData: initialRooms,
  });
}
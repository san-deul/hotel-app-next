"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchRoomImages, type RoomImage } from "@/lib/api/room";

export const roomImagesKey = (room_no: number) => ["room-images", room_no] as const;

export function useRoomImages(room_no: number, initialImages?: RoomImage[]) {
  const supabase = createClient();

  return useQuery({
    queryKey: roomImagesKey(room_no),
    queryFn: () => fetchRoomImages(supabase, room_no),
    initialData: initialImages,
  });
}
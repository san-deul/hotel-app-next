import { useQuery } from "@tanstack/react-query";
import { fetchRoomById, fetchRooms, RoomRow } from "@/lib/api/roomApi";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const useRooms = () => {
  return useQuery<RoomRow[]>({
    queryKey: ["rooms"],
    queryFn:  () => fetchRooms(supabase),
  });
};


export const useRoom = (roomNo: string) => {
  return useQuery({
    queryKey: ["room", roomNo],
    queryFn: () => fetchRoomById(supabase, roomNo),
    enabled: !!roomNo, // roomNo 없으면 쿼리 안 날림
  });
};
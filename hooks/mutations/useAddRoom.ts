"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { addRoom } from "@/lib/api/room";
import { roomsKey } from "@/hooks/queries/useRooms";
import type { RoomFormValues } from "@/lib/schemas/roomSchema";

export function useAddRoom() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: RoomFormValues & { newRoomNo: number }) => {
      const { room_name, info, price, guest_count, total_room, parentNo, newRoomNo } = values;

      await addRoom(supabase, {
        room_no: newRoomNo,
        room_name,
        parent_no: parentNo,
        info,
        price,
        guest_count,
        total_room,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey });
    },
  });
}
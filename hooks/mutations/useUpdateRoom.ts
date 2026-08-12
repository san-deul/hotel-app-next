"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { updateRoom } from "@/lib/api/room";
import { roomsKey } from "@/hooks/queries/useRooms";
import type { RoomFormValues } from "@/lib/schemas/roomSchema";

export function useUpdateRoom(room_no: number) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RoomFormValues) => updateRoom(supabase, room_no, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey });
    },
  });
}
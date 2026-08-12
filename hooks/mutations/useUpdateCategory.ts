"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { updateCategory } from "@/lib/api/room";
import { roomsKey } from "@/hooks/queries/useRooms";
import type { CategoryFormValues } from "@/lib/schemas/roomSchema";

export function useUpdateCategory(room_no: number) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CategoryFormValues) =>
      updateCategory(supabase, room_no, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomsKey });
    },
  });
}
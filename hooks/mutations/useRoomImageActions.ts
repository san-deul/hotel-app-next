"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  uploadRoomImage,
  deleteRoomImage,
  setMainRoomImage,
  type RoomImage,
} from "@/lib/api/room";

import { roomsKey } from "@/hooks/queries/useRooms";
import { roomImagesKey } from "./useRoomImages";

function useInvalidateRoomImages(room_no: number) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: roomImagesKey(room_no) });
    queryClient.invalidateQueries({ queryKey: roomsKey });
  };
}

export function useUploadRoomImage(room_no: number) {
  const supabase = createClient();
  const invalidate = useInvalidateRoomImages(room_no);

  return useMutation({
    mutationFn: (file: File) => uploadRoomImage(supabase, room_no, file),
    onSuccess: invalidate,
  });
}

export function useDeleteRoomImage(room_no: number) {
  const supabase = createClient();
  const invalidate = useInvalidateRoomImages(room_no);

  return useMutation({
    mutationFn: (img: RoomImage) => deleteRoomImage(supabase, img),
    onSuccess: invalidate,
  });
}

export function useSetMainRoomImage(room_no: number) {
  const supabase = createClient();
  const invalidate = useInvalidateRoomImages(room_no);

  return useMutation({
    mutationFn: (img: RoomImage) => setMainRoomImage(supabase, room_no, img.room_img_no),
    onSuccess: invalidate,
  });
}
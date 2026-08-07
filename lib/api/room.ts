import type { SupabaseClient } from "@supabase/supabase-js";
import { getRoomImageUrl } from "@/lib/utils/image";
import { cache } from "react";

export interface RoomImage {
  room_img_no: string | number;
  upload_path: string;
  is_main: boolean;
  [key: string]: unknown;
}

export interface RoomRow {
  room_no: number;
  parent_no: string | null;
  room_name: string;
  depth: number;
  info?: string;
  price?: number;
  guest_count?: number;
  room_img: RoomImage[] | null;
  [key: string]: unknown;
}

/* 메인 페이지용 */
export interface MainRoomCarouselItem {
  id: string | number;
  title: string;
  image: string;
}

export interface RoomNavItem {
  room_no: number;
  parent_no: string | null;
  room_name: string;
  depth: number;
}


export const fetchRooms = cache (async (supabase: SupabaseClient): Promise<RoomRow[]> => {
  const { data, error } = await supabase
    .from("room")
    .select(`*, room_img(*)`)
    .order("room_no", { ascending: true });

  if (error) throw error;
  return data as RoomRow[];
});

export const fetchRoomNavList = cache(
  async (supabase: SupabaseClient): Promise<RoomNavItem[]> => {
    const { data, error } = await supabase
      .from("room")
      .select("room_no, parent_no, room_name, depth") // 이미지/설명 등 제외
      .order("room_no", { ascending: true });

    if (error) throw error;
    return data as RoomNavItem[];
  }
);

export const fetchRoomById = cache(async (
  supabase: SupabaseClient,
  roomNo: string
): Promise<RoomRow | null> => {
  const { data, error } = await supabase
    .from("room")
    .select(`*, room_img(*)`)
    .eq("room_no", roomNo)
    .maybeSingle();

  if (error) throw error;
  return data as RoomRow | null;
});

/* 메인 페이지용 */
export const fetchRoomsForMain = async (
  supabase: SupabaseClient
): Promise<MainRoomCarouselItem[]> => {
  const { data, error } = await supabase
    .from("room")
    .select(`*, room_img(*)`)
    .neq("depth", 0)
    .order("room_no", { ascending: true });

  if (error) throw error;

  return (data as RoomRow[]).map((room) => {
    const mainImagePath = room.room_img?.find((img) => img.is_main)?.upload_path;
    return {
      id: room.room_no,
      title: room.room_name,
      image: getRoomImageUrl(mainImagePath),
    };
  });
};
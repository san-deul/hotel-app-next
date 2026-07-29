import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export interface RoomImage {
  room_img_no: string | number;
  upload_path: string;
  is_main: boolean;
  [key: string]: unknown;
}

export interface RoomRow {
  parent_no: string;
  room_no: string | number;
  room_name: string;
  depth: number;
  info?: string;
  price?: number;
  guest_count?: number;
  room_img: RoomImage[] | null;
  [key: string]: unknown;
}

export const getRoomImageUrl = (path?: string) => {
  if (!path) return "/images/no-image.jpg";

  const { data } = supabase.storage.from("room_images").getPublicUrl(path);

  return data.publicUrl;
};

export const fetchRooms = async (): Promise<RoomRow[]> => {
  const { data, error } = await supabase
    .from("room")
    .select(`*,room_img(*)`)
    .order("room_no", { ascending: true });

  if (error) throw error;
  return data as RoomRow[];
};

// room 단건 조회 ((RoomDetailContnet))

export const fetchRoomById = async (roomNo: string): Promise<RoomRow | null> => {
  const { data, error } = await supabase
    .from("room")
    .select(`*, room_img(*)`)
    .eq("room_no", roomNo)
    .maybeSingle();

  if (error) throw error;
  return data as RoomRow | null;
};
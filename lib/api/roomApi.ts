import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export interface RoomImage {
  upload_path: string;
  is_main: boolean;
  [key: string]: unknown;
}

export interface RoomRow {
  room_no: string | number;
  room_name: string;
  depth: number;
  room_img: RoomImage[] | null;
  [key: string]: unknown;
}

export const getRoomImageUrl = (path?: string) => {
  if (!path) return "/images/no-image.jpg";

  const { data } = supabase.storage.from("room_images").getPublicUrl(path);

  return data.publicUrl;
};

// room 테이블에서 데이터 가져옴
export const fetchRooms = async (): Promise<RoomRow[]> => {
  const { data, error } = await supabase
    .from("room")
    .select(
      `
      *,
      room_img(*)
    `
    )
    .order("room_no", { ascending: true });

  if (error) throw error;
  return data as RoomRow[];
};
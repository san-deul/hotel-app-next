import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function fetchIsFavorite(roomNo: number): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("room_no", roomNo)
    .eq("user_id", user.id)
    .maybeSingle();

  return !!data;
}

export async function toggleFavorite(roomNo: number, isFavorite?: boolean) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인 필요");

  if (isFavorite) {
    return supabase
      .from("favorites")
      .delete()
      .eq("room_no", roomNo)
      .eq("user_id", user.id);
  } else {
    return supabase.from("favorites").insert({
      room_no: roomNo,
      user_id: user.id,
    });
  }
}

interface RoomImage {
  upload_path: string;
  is_main: boolean;
  publicUrl?: string;
}

interface FavoriteRoom {
  room_no: string | number;
  room_name: string;
  price?: number;
  guest_count?: number;
  room_img: RoomImage[] | null;
}

interface FavoriteRow {
  room_no: string | number;
  room: FavoriteRoom | null;
}

export async function fetchFavoriteList() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      room_no,
      room:room_no (
        room_no,
        room_name,
        price,
        guest_count,
        room_img (
          upload_path,
          is_main
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as FavoriteRow[]).map((fav) => {
    const mainImgs = fav.room?.room_img?.filter((img) => img.is_main) ?? [];

    const imagesWithUrl = mainImgs.map((img) => {
      const { data } = supabase.storage
        .from("room_images")
        .getPublicUrl(img.upload_path);

      return {
        ...img,
        publicUrl: data.publicUrl,
      };
    });

    return {
      ...fav,
      room: fav.room
        ? {
            ...fav.room,
            room_img: imagesWithUrl,
          }
        : null,
    };
  });
}
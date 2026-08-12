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


export const fetchRooms = cache(async (supabase: SupabaseClient): Promise<RoomRow[]> => {
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

export const fetchAvailableRooms = cache(async (
  supabase: SupabaseClient,
  minGuestCount: number
): Promise<RoomRow[]> => {
  const { data, error } = await supabase
    .from("room")
    .select('*, room_img(*)')
    .eq("depth", 1)
    .gte("guest_count", minGuestCount);

  if (error) throw error;
  return data as RoomRow[];

});


export type RoomWithThumbnail = RoomRow & { thumbnail: string };


export function withThumbnail(room: RoomRow): RoomWithThumbnail {
  const mainImagePath = room.room_img?.find((img) => img.is_main)?.upload_path;
  return {
    ...room,
    thumbnail: getRoomImageUrl(mainImagePath),
  };
}



export async function deleteRoom(supabase: SupabaseClient, room: RoomRow) {
  const { data: reservations, error: resError } = await supabase
    .from("reservation")
    .select("id")
    .eq("room_no", room.room_no);
  if (resError) throw resError;

  if (reservations.length > 0) {
    throw new Error("HAS_RESERVATION");
  }

  const { error: imgError } = await supabase
    .from("room_img")
    .delete()
    .eq("room_no", room.room_no);
  if (imgError) throw imgError;

  const { error: detailError } = await supabase
    .from("room_detail")
    .delete()
    .eq("room_no", room.room_no);
  if (detailError) throw detailError;

  const { error: roomError } = await supabase
    .from("room")
    .delete()
    .eq("room_no", room.room_no);
  if (roomError) throw roomError;
}

export async function deleteRoomGroup(supabase: SupabaseClient, room: RoomRow) {
  await supabase.from("room_img").delete().eq("room_no", room.room_no);
  await supabase.from("room_detail").delete().eq("room_no", room.room_no);

  const { data: children } = await supabase
    .from("room")
    .select("room_no")
    .eq("parent_no", room.room_no);

  const childRoomNos = (children ?? []).map((c) => c.room_no);

  if (childRoomNos.length > 0) {
    const { data: reservations } = await supabase
      .from("reservation")
      .select("id")
      .in("room_no", childRoomNos);

    if (reservations && reservations.length > 0) {
      throw new Error("CHILD_HAS_RESERVATION");
    }
  }

  await supabase.from("room").delete().eq("parent_no", room.room_no);
  await supabase.from("room").delete().eq("room_no", room.room_no);
}


export async function addCategory(
  supabase: SupabaseClient,
  { room_no, room_name }: { room_no: number; room_name: string }
) {
  const { error } = await supabase.from("room").insert({
    room_no,
    room_name,
    depth: 0,
    parent_no: "#",
  });
  if (error) throw error;
}


export async function addRoom(
  supabase: SupabaseClient,
  values: {
    room_no: number;
    room_name: string;
    parent_no: string;
    info?: string;
    price: number;
    guest_count: number;
    total_room: number;
  }
) {
  const { error } = await supabase.from("room").insert({
    room_no: values.room_no,
    room_name: values.room_name,
    depth: 1,
    parent_no: values.parent_no,
    info: values.info,
    price: values.price,
    guest_count: values.guest_count,
    total_room: values.total_room,
  });
  if (error) throw error;
}


export async function updateCategory(
  supabase: SupabaseClient,
  room_no: number,
  values: { room_name: string }
) {
  const { error } = await supabase.from("room").update(values).eq("room_no", room_no);
  if (error) throw error;
}


export async function updateRoom(
  supabase: SupabaseClient,
  room_no: number,
  values: {
    room_name: string;
    info?: string;
    price: number;
    guest_count: number;
    total_room: number;
  }
) {
  const { error } = await supabase.from("room").update(values).eq("room_no", room_no);
  if (error) throw error;
}

export async function fetchRoomImages(
  supabase: SupabaseClient,
  room_no: number
): Promise<RoomImage[]> {
  const { data, error } = await supabase
    .from("room_img")
    .select("*")
    .eq("room_no", room_no)
    .order("is_main", { ascending: false });
  if (error) throw error;
  return data as RoomImage[];
}

export async function uploadRoomImage(
  supabase: SupabaseClient,
  room_no: number,
  file: File
) {
  const filePath = `${room_no}/${Date.now()}-${file.name}`;

  const { error: storageError } = await supabase.storage
    .from("room_images")
    .upload(filePath, file);
  if (storageError) throw new Error("STORAGE_UPLOAD_FAILED");

  const { error: dbError } = await supabase.from("room_img").insert({
    room_no,
    room_img_name: file.name,
    filesystem_name: filePath,
    upload_path: filePath,
  });
  if (dbError) throw new Error("DB_INSERT_FAILED");
}

export async function deleteRoomImage(supabase: SupabaseClient, img: RoomImage) {
  await supabase.storage.from("room_images").remove([img.upload_path]);
  const { error } = await supabase
    .from("room_img")
    .delete()
    .eq("room_img_no", img.room_img_no);
  if (error) throw error;
}

export async function setMainRoomImage(
  supabase: SupabaseClient,
  room_no: number,
  room_img_no: RoomImage["room_img_no"]
) {
  await supabase.from("room_img").update({ is_main: false }).eq("room_no", room_no);

  const { error } = await supabase
    .from("room_img")
    .update({ is_main: true })
    .eq("room_img_no", room_img_no);
  if (error) throw new Error("SET_MAIN_FAILED");
}
import RoomDetailContent from "@/components/room/RoomDetailContent";
import { fetchRoomById } from "@/lib/api/room";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface RoomDetailPageProps {
  params: Promise<{ room_no: string }>;
}


export async function generateMetadata({
  params,
}: RoomDetailPageProps): Promise<Metadata> {
  const { room_no } = await params;
  const supabase = await createClient();
  const room = await fetchRoomById(supabase, room_no);

  if (!room) {
    return { title: "객실 정보 없음 | SD HOTEL" };
  }

  return {
    title: `${room.room_name} | SD HOTEL`,
    description: room.info || "SD HOTEL & Suites 객실 상세 정보입니다.",
  };
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { room_no } = await params;
  const supabase = await createClient();
  const room = await fetchRoomById(supabase, room_no);

  if (!room) {
    notFound();
  }

  return <RoomDetailContent room={room} />;
}
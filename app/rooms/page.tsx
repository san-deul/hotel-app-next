import RoomsListContent from "@/components/room/RoomsListContent";
import { fetchRooms } from "@/lib/api/room";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "객실 안내 | SD HOTEL",
  description: "SD HOTEL & Suites의 다양한 객실을 만나보세요.",
};

export default async   function RoomsPage() {
  const supabase = await createClient();
  const rooms = await fetchRooms(supabase);
  return <RoomsListContent rooms={rooms}/>;
}
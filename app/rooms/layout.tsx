import RoomNav from "@/components/room/RoomNav";
import { fetchRoomNavList } from "@/lib/api/room";
import { createClient } from "@/lib/supabase/server";

export default async function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createClient(); // server.ts 버전
  const rooms = await fetchRoomNavList(supabase);

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
      <RoomNav rooms={rooms}/>
      <div className="flex-1 p-10">{children}</div>
    </div>
  );
}
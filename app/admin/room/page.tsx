import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchMemberById } from "@/lib/api/user";
import { fetchRooms } from "@/lib/api/room";
import AdminRoomPageContent from "@/components/admin/room/AdminRoomPageContent";


export const metadata: Metadata = {
  title: "객실 관리 | 관리자페이지",
};

export default async function AdminRoomPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const member = await fetchMemberById(supabase, authUser.id).catch(() => null);

  if (member?.role !== "admin" && member?.role !== "manager") {
    redirect("/admin");
  }

  const rooms = await fetchRooms(supabase);

  return <AdminRoomPageContent initialRooms={rooms} />;
}
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchMemberById } from "@/lib/api/user";
import { fetchRoomById } from "@/lib/api/room";
import ReserveFormContent from "@/components/reservation/ReserveFormContent";

export const metadata: Metadata = {
  title: "예약자 정보 입력 | SD HOTEL",
};

interface ReservePageProps {
  searchParams: Promise<{
    room_no?: string;
    start?: string;
    end?: string;
    adult?: string;
    child?: string;
  }>;
}

export default async function ReservePage({ searchParams }: ReservePageProps) {
  const { room_no, start, end, adult, child } = await searchParams;

  // 예약에 필요한 필수 파라미터 없으면 진입 자체가 잘못된 흐름
  if (!room_no || !start || !end) {
    redirect("/rooms");
  }

  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const member = await fetchMemberById(supabase, authUser.id).catch(() => null);

  const room = await fetchRoomById(supabase, room_no);

  if (!room) redirect("/rooms");

  return (
    <ReserveFormContent
      room={room}
      userId={authUser.id}
      searchInfo={{
        start,
        end,
        adult: Number(adult ?? 0),
        child: Number(child ?? 0),
      }}
      initialCustomer={{
        name: member?.name ?? "",
        phone: member?.phone ?? "",
        email: member?.email ?? "",
      }}
    />
  );
}
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchMyReservations } from "@/lib/api/reservation";
import MyReservationContent from "@/components/mypage/MyReservationContent";
import dayjs from "dayjs";

export const metadata: Metadata = {
  title: "예약 목록 | 마이페이지",
};

function toDateStr(date: Date) {
  return date.toISOString().split("T")[0];
}

export default async function MyReservationPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const from = dayjs().subtract(3, "month").format("YYYY-MM-DD");
  const to = dayjs().format("YYYY-MM-DD");

  const reservations = await fetchMyReservations(supabase, authUser.id, from, to);

  return (
    <MyReservationContent
      userId={authUser.id}
      initialFrom={from}
      initialTo={to}
      initialReservations={reservations}
    />
  );
}
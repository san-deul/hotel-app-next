import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchMemberById } from "@/lib/api/user";
import { fetchReservationCalendar } from "@/lib/api/reservation";
import ReservationCalendarContent from "@/components/admin/reservation/ReservationCalendarContent";

export const metadata: Metadata = {
  title: "예약 현황 | 관리자페이지",
};

export default async function ReservationCalendarPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const member = await fetchMemberById(supabase, authUser.id).catch(() => null);
  if (member?.role !== "admin" && member?.role !== "manager") {
    redirect("/admin");
  }

  const { events, occupancy } = await fetchReservationCalendar(supabase);

  return <ReservationCalendarContent initialEvents={events} initialOccupancy={occupancy} />;
}
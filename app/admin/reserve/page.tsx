import type { Metadata } from "next";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { createClient } from "@/lib/supabase/server";
import { fetchMemberById } from "@/lib/api/user";
import { fetchReservations } from "@/lib/api/reservation";
import ReservationListContent from "@/components/admin/reservation/ReservationListContent";

export const metadata: Metadata = {
  title: "예약 관리 | 관리자페이지",
};

interface AdminReservationsPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function AdminReservationsPage({
  searchParams,
}: AdminReservationsPageProps) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const member = await fetchMemberById(supabase, authUser.id).catch(() => null);
  if (member?.role !== "admin" && member?.role !== "manager") {
    redirect("/admin");
  }

  const { date } = await searchParams;
  const initialStartDate = date || dayjs().format("YYYY-MM-DD");

  const reservations = await fetchReservations(supabase, { startDate: initialStartDate });

  return (
    <ReservationListContent
      initialReservations={reservations}
      initialStartDate={initialStartDate}
    />
  );
}
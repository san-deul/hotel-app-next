// app/admin/page.tsx
import AdminDashboardContent from "@/components/admin/dashboard/AdminDashboardContent";
import { createClient } from "@/lib/supabase/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드 | 관리자페이지",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const todayStr = new Date().toISOString().slice(0, 10);
  const range = { gte: `${todayStr} 00:00:00`, lte: `${todayStr} 23:59:59` };

  const [checkin, checkout, confirmed, pending, cancelled, checkinList, checkoutList] =
    await Promise.all([
      supabase.from("reservation").select("id", { count: "exact", head: true }).eq("start_date", todayStr),
      supabase.from("reservation").select("id", { count: "exact", head: true }).eq("end_date", todayStr),
      supabase.from("reservation").select("id", { count: "exact", head: true }).eq("status", "confirmed").gte("created_at", range.gte).lte("created_at", range.lte),
      supabase.from("reservation").select("id", { count: "exact", head: true }).eq("status", "pending").gte("created_at", range.gte).lte("created_at", range.lte),
      supabase.from("reservation").select("id", { count: "exact", head: true }).eq("status", "cancelled").gte("created_at", range.gte).lte("created_at", range.lte),
      supabase.from("reservation").select(`id, guest_name, guest_phone, room:room_no ( room_name )`).eq("start_date", todayStr).order("created_at").limit(3),
      supabase.from("reservation").select(`id, guest_name, guest_phone, room:room_no ( room_name )`).eq("end_date", todayStr).order("created_at").limit(3),
    ]);

  return (
    <AdminDashboardContent
      todayStr={todayStr}
      summary={{
        checkin: checkin.count || 0,
        checkout: checkout.count || 0,
        confirmed: confirmed.count || 0,
        pending: pending.count || 0,
        cancelled: cancelled.count || 0,
      }}
      checkinList={checkinList.data || []}
      checkoutList={checkoutList.data || []}
    />
  );
}
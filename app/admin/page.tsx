import AdminDashboardContent from "@/components/admin/dashboard/AdminDashboardContent";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const todayStr = new Date().toISOString().slice(0, 10);
  const range = { gte: `${todayStr} 00:00:00`, lte: `${todayStr} 23:59:59` };

  const results = await Promise.all([
    supabase.from("reservation").select("id", { count: "exact", head: true }).eq("start_date", todayStr),
    supabase.from("reservation").select("id", { count: "exact", head: true }).eq("end_date", todayStr),
    supabase.from("reservation").select("id", { count: "exact", head: true }).eq("status", "confirmed").gte("created_at", range.gte).lte("created_at", range.lte),
    supabase.from("reservation").select("id", { count: "exact", head: true }).eq("status", "pending").gte("created_at", range.gte).lte("created_at", range.lte),
    supabase.from("reservation").select("id", { count: "exact", head: true }).eq("status", "cancelled").gte("created_at", range.gte).lte("created_at", range.lte),
    supabase.from("reservation").select(`id, guest_name, guest_phone, room:room_no ( room_name )`).eq("start_date", todayStr).order("created_at").limit(3),
    supabase.from("reservation").select(`id, guest_name, guest_phone, room:room_no ( room_name )`).eq("end_date", todayStr).order("created_at").limit(3),
  ]);

  const [checkin, checkout, confirmed, pending, cancelled, checkinList, checkoutList] = results;



  const failed = results.filter((r) => r.error);
  if (failed.length > 0) {
    console.error(
      "[AdminDashboardPage] 예약 데이터 조회 중 오류 발생:",
      failed.map((r) => r.error)
    );
  }

  const formatList = (list: typeof checkinList.data) =>
    (list ?? []).map((item) => ({
      ...item,
      room: Array.isArray(item.room) ? item.room[0] : item.room,
    }));

  return (

    <AdminDashboardContent
      todayStr={todayStr}
      hasError={failed.length > 0}
      summary={{
        checkin: checkin.count ?? 0,
        checkout: checkout.count ?? 0,
        confirmed: confirmed.count ?? 0,
        pending: pending.count ?? 0,
        cancelled: cancelled.count ?? 0,
      }}
      checkinList={formatList(checkinList.data)}
      checkoutList={formatList(checkoutList.data)}
    />
  );
}
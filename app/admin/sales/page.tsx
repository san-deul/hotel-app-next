// app/admin/sales/page.tsx
import type { Metadata } from "next";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchMemberById } from "@/lib/api/user";
import { fetchSalesSummary } from "@/lib/api/sales";
import SalesPageContent from "@/components/admin/sales/SalesPageContent";

export const metadata: Metadata = {
  title: "매출관리 | 관리자페이지",
};

export default async function SalesPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const member = await fetchMemberById(supabase, authUser.id).catch(() => null);

  if (member?.role !== "admin" && member?.role !== "manager") {
    redirect("/admin");
  }

  const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const endDate = dayjs().endOf("month").format("YYYY-MM-DD");

  const initialData = await fetchSalesSummary(supabase, startDate, endDate);

  return (
    <SalesPageContent
      initialStartDate={startDate}
      initialEndDate={endDate}
      initialData={initialData}
    />
  );
}
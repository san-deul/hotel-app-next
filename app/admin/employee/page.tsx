import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import EmployeeListContent from "@/components/admin/employee/EmployeeListContent";

export const metadata: Metadata = {
  title: "직원 목록 | 관리자페이지",
};

export default async function EmployeeListPage() {
  const supabase = await createClient();

  const { data: employees } = await supabase
    .from("member")
    .select("id, name, phone, email, role, created_at")
    .eq("role", "manager");

  return <EmployeeListContent employees={employees ?? []} />;
}
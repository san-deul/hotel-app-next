import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import EmployeeListContent from "@/components/admin/employee/EmployeeListContent";
import { fetchEmployees } from "@/lib/api/employee";

export const metadata: Metadata = {
  title: "직원 목록 | 관리자페이지",
};

export default async function EmployeeListPage() {
  const supabase = await createClient();

  const employees = await fetchEmployees(supabase);


  return <EmployeeListContent employees={employees ?? []} />;
}
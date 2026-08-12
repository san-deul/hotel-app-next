import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditEmployeeForm from "@/components/admin/employee/EditEmployeeForm";
import { fetchMemberById } from "@/lib/api/user";
import { fetchEmployeeById } from "@/lib/actions/employee";

export const metadata: Metadata = {
  title: "직원 정보 수정 | 관리자페이지",
};

interface EditEmployeePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const member = await fetchMemberById(supabase, authUser.id).catch(() => null);

  if (member?.role !== "admin") {
    redirect("/admin/employee");
  }

  const employee = await fetchEmployeeById(supabase, id);

  if (!employee) {
    notFound();
  }

  return <EditEmployeeForm employee={employee} />;
}
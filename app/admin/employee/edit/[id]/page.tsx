import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditEmployeeForm from "@/components/admin/employee/EditEmployeeForm";

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

  const { data: caller } = await supabase
    .from("member")
    .select("role")
    .eq("id", authUser!.id)
    .single();

  if (caller?.role !== "admin") {
    redirect("/admin/employee");
  }

  const { data: employee, error } = await supabase
    .from("member")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !employee) {
    notFound();
  }

  return <EditEmployeeForm employee={employee} />;
}
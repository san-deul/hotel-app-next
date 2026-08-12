import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddEmployeeForm from "@/components/admin/employee/AddEmployeeForm";
import { fetchMemberById } from "@/lib/api/user";
import { generateNextManagerEmail } from "@/lib/api/employee";

export const metadata: Metadata = {
  title: "직원 추가 | 관리자페이지",
};

export default async function AddEmployeePage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");


  const member = await fetchMemberById(supabase, authUser.id ).catch(()=>null)

  if (member?.role !== "admin") {
    redirect("/admin/employee");
  }

  const generatedEmail = await generateNextManagerEmail(supabase);

  

  return <AddEmployeeForm generatedEmail={generatedEmail} />;
}
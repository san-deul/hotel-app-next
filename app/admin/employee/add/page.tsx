import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddEmployeeForm from "@/components/admin/employee/AddEmployeeForm";

export const metadata: Metadata = {
  title: "직원 추가 | 관리자페이지",
};

export default async function AddEmployeePage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: member } = await supabase
    .from("member")
    .select("role")
    .eq("id", authUser!.id)
    .single();

  // layout은 admin/manager 둘 다 통과시키지만, 이 페이지는 admin만 허용
  if (member?.role !== "admin") {
    redirect("/admin/employee");
  }

  // 자동 생성 이메일 서버에서 미리 계산
  const { data: managers } = await supabase
    .from("member")
    .select("email")
    .eq("role", "manager");

  let maxNumber = 0;
  managers?.forEach((m) => {
    const match = m.email?.match(/^manager(\d+)@test\.com$/);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxNumber) maxNumber = num;
    }
  });

  return <AddEmployeeForm generatedEmail={`manager${maxNumber + 1}@test.com`} />;
}
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChangePasswordContent from "@/components/mypage/ChangePasswordContent";


export const metadata = {
  title: "비밀번호 변경 | SD HOTEL",
};

export default async function ChangePasswordPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  return <ChangePasswordContent />;
}
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchMemberById, fetchMemberProfileById } from "@/lib/api/user";
import MyInfoContent from "@/components/mypage/MyInfoContent";


export const metadata = {
  title: "내 정보 수정 | SD HOTEL",
};

export default async function MyInfoPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const member = await fetchMemberProfileById(supabase, authUser.id);

  if (!member) redirect("/login"); 
  return <MyInfoContent email={authUser.email ?? ""} initialMember={member} />;
}
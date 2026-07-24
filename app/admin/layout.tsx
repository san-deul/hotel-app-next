// app/admin/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // 경로 아래 참고
import AdminShell from "./layout/AdminShell";

export const metadata: Metadata = {
  title: "관리자페이지 | SD HOTEL",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const { data: member } = await supabase
    .from("member")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (member?.role !== "admin" && member?.role !== "manager") {
    redirect("/");
  }

  return (
    <AdminShell user={{ ...authUser, ...member }}>{children}</AdminShell>
  );
}
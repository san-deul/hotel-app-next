import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "마이페이지 | SD HOTEL",
};

const MENU_ITEMS = [
  { href: "/mypage/info", label: "내 정보 수정" },
  { href: "/mypage/reservations", label: "예약 목록" },
  { href: "/mypage/favorites", label: "찜 목록" },
];

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">마이페이지</h2>
      <ul className="divide-y pt-5">
        {MENU_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block w-full bg-black text-white py-3 pl-5 rounded mt-4 h-12 hover:bg-[#a67c52] hover:shadow-lg transition duration-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
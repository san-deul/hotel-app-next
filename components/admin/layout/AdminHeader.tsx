"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


export default function AdminHeader({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b bg-white">
      <div className="max-w-[1280px] mx-auto px-4 h-[70px] flex items-center justify-between">
        <div className="text-xl font-semibold text-gray-800">
          <Link href="/admin">관리자페이지</Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1 border rounded-full hover:bg-gray-50 transition"
          >
            <span className="text-sm text-gray-700">{user.email ?? "Unknown User"}</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-2">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
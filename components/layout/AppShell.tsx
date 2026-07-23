"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { useAuthStore } from "@/lib/store/authStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 메인 페이지인지 체크
  const isMain = pathname === "/";
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 메인 페이지는 pt 제거, 서브는 70px 적용 */}
      <main className={`${isMain ? "" : "pt-[70px]"} flex-1`}>
        {children}
        {/* TODO: ChatContainer 연동 ,, 추후에 
        {(user?.role === "admin" || user?.role === "manager") && (
          <ChatContainer />
        )}
        */}
      </main>

      <Footer />
    </div>
  );
}
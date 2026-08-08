"use client";

import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminNavi from "@/components/admin/layout/AdminNavi";
import { useSidebarResize } from "@/hooks/useSidebarResize";
import { AppUser } from "@/lib/api/user";

export default function AdminShell({
  user,
  children,
}: {
  user: AppUser;
  children: React.ReactNode;
}) {
  const { width, collapsed, startDragging, toggleCollapsed } = useSidebarResize();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader user={user} />
      <div className="flex flex-1">
        <div className="relative bg-white border-r flex flex-col transition-all" style={{ width }}>
          <div className="h-14 flex items-center justify-between px-3 border-b">
            {!collapsed && <span className="font-semibold text-sm">관리자 메뉴</span>}
            <button
              onClick={toggleCollapsed}
              className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center"
            >
              {collapsed ? "❯" : "❮"}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminNavi collapsed={collapsed} />
          </div>
          <div
            onMouseDown={startDragging}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-300"
          />
        </div>
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminNavi from "@/components/admin/layout/AdminNavi";


const COLLAPSE_THRESHOLD = 90;
const ICON_WIDTH = 64;
const EXPANDED_WIDTH = 260;

export default function AdminShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(EXPANDED_WIDTH);
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging) return;
      let w = e.clientX;
      if (w > 420) w = 420;
      if (w <= COLLAPSE_THRESHOLD) {
        setCollapsed(true);
        setSidebarWidth(ICON_WIDTH);
        return;
      }
      if (collapsed && w > COLLAPSE_THRESHOLD + 20) setCollapsed(false);
      setSidebarWidth(w);
    }
    function onMouseUp() {
      setDragging(false);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, collapsed]);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader user={user} />
      <div className="flex flex-1">
        <div
          className="relative bg-white border-r flex flex-col transition-all"
          style={{ width: sidebarWidth }}
        >
          <div className="h-14 flex items-center justify-between px-3 border-b">
            {!collapsed && (
              <span className="font-semibold text-sm">관리자 메뉴</span>
            )}
            <button
              onClick={() => {
                if (collapsed) {
                  setCollapsed(false);
                  setSidebarWidth(EXPANDED_WIDTH);
                } else {
                  setCollapsed(true);
                  setSidebarWidth(ICON_WIDTH);
                }
              }}
              className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center"
            >
              {collapsed ? "❯" : "❮"}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminNavi collapsed={collapsed} />
          </div>
          <div
            onMouseDown={() => setDragging(true)}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-300"
          />
        </div>
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";

interface NavSubItem {
  label: string;
  href: string;
}

interface NavItem {
  key: string;
  label: string;
  icon: string;
  href?: string;     
  subItems?: NavSubItem[];
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "홈 (Dashboard)", icon: "🏠", href: "/admin" },
  {
    key: "staff",
    label: "직원 관리",
    icon: "👤",
    subItems: [
      { label: "직원 추가", href: "/admin/employee/add" },
      { label: "직원 목록", href: "/admin/employee" },
    ],
  },
  { key: "room", label: "객실 관리", icon: "🏨", href: "/admin/room" },
  { key: "facility", label: "부대시설", icon: "🏪", href: "/admin/facility" },
  {
    key: "reserve",
    label: "예약 관리",
    icon: "📅",
    subItems: [
      { label: "예약 페이지", href: "/admin/reserve" },
      { label: "예약 현황", href: "/admin/reserve/condition" },
    ],
  },
  { key: "sales", label: "매출 관리", icon: "📊", href: "/admin/sales" },
  { key: "home", label: "메인페이지", icon: "🏠", href: "/" },
];

const ITEM_CLASS = (collapsed: boolean) =>
  `w-full flex items-center rounded hover:bg-gray-100 px-2 py-2 ${collapsed ? "justify-center" : "gap-3"
  }`;

export default function AdminNavi({ collapsed }: { collapsed: boolean }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggleMenu = (menu: string) =>
    setOpenMenu((prev) => (prev === menu ? null : menu));

  return (
    <aside className="h-full bg-white shadow-sm py-6 px-2">
      {!collapsed && <h2 className="text-xl font-semibold mb-8 px-2">관리자 메뉴</h2>}

      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => {
          if (!item.subItems) {
            return (
              <Link
                key={item.key}
                href={item.href!}
                className={ITEM_CLASS(collapsed)}
                title={item.label}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          }

          if (collapsed) {
            return (
              <Link
                key={item.key}
                href={item.subItems[0].href}
                className={ITEM_CLASS(collapsed)}
                title={item.label}
              >
                <span className="text-lg">{item.icon}</span>
              </Link>
            );
          }
          const isOpen = openMenu === item.key;
          return (
            <div key={item.key}>
              <button onClick={() => toggleMenu(item.key)} className={ITEM_CLASS(collapsed)} title={item.label}>
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                <FiChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((sub) => (
                    <Link key={sub.href} href={sub.href} className="block text-sm hover:text-blue-600">
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

      </nav>
    </aside>
  );
}
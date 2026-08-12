"use client";

import Link from "next/link";
import type { EmployeeRow } from "@/lib/api/employee";
import { useDeleteEmployee } from "@/hooks/useDeleteEmployee";
import RoleBadge from "./RoleBadge";

export default function EmployeeListContent({
  employees,
}: {
  employees: EmployeeRow[];
}) {
  const { handleDelete, deletingId } = useDeleteEmployee();

  if (employees.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        등록된 직원이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h1 className="text-xl font-semibold mb-6">직원 목록</h1>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500 text-sm border-b">
            <th className="pb-3">이름</th>
            <th className="pb-3">이메일</th>
            <th className="pb-3">연락처</th>
            <th className="pb-3">역할</th>
            <th className="pb-3">가입일</th>
            <th className="pb-3 text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-4 font-medium text-gray-800">{emp.name}</td>
              <td className="py-4 text-gray-600">{emp.email}</td>
              <td className="py-4 text-gray-600">{emp.phone ?? "-"}</td>
              <td className="py-4">
                <RoleBadge role={emp.role} />
              </td>
              <td className="py-4 text-gray-500 text-sm">
                {new Date(emp.created_at).toLocaleDateString()}
              </td>
              <td className="py-4 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    className="text-red-500 hover:underline text-sm disabled:opacity-50"
                    onClick={() => handleDelete(emp.id)}
                    disabled={deletingId === emp.id}
                  >
                    {deletingId === emp.id ? "삭제 중..." : "삭제"}
                  </button>
                  <Link
                    href={`/admin/employee/edit/${emp.id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    수정
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
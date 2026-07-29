"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  created_at: string;
}

export default function EmployeeListContent({
  employees,
}: {
  employees: Employee[];
}) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch("/api/admin/employee", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });

    const result = await res.json();

    if (!result.success) {
      alert("삭제 실패: " + result.message);
      return;
    }

    alert("삭제가 완료되었습니다.");
    router.refresh(); // 서버에서 목록 다시 fetch
  };

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
              <td className="py-4 text-gray-600">{emp.phone}</td>
              <td className="py-4">
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {emp.role.toUpperCase()}
                </span>
              </td>
              <td className="py-4 text-gray-500 text-sm">
                {new Date(emp.created_at).toLocaleDateString()}
              </td>
              <td className="py-4 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => handleDelete(emp.id)}
                  >
                    삭제
                  </button>
                  <Link
                    href={`/admin/employee/edit/${emp.id}`}
                    className="text-red-500 hover:underline text-sm"
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
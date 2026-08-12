"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEmployee } from "@/lib/actions/employee";

export function useDeleteEmployee() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setDeletingId(id);
    try {
      await deleteEmployee(id);
      alert("삭제가 완료되었습니다.");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  return { handleDelete, deletingId };
}
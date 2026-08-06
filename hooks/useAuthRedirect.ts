"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { isAdminRole } from "@/lib/constants/role";

export function useAuthRedirect() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;
    if (!user.role) return; 

    router.replace(isAdminRole(user.role) ? "/admin" : "/");
  }, [user, isLoading, router]);
}
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/components/providers/AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  // 컴포넌트가 리렌더링되어도 QueryClient가 새로 생성되지 않도록 useState로 고정
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
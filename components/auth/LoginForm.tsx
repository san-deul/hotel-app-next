"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/authStore";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAdminRole } from "@/lib/constants/role";


type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.authError);
  const setAuthError = useAuthStore((state) => state.setAuthError);

  // 로그인 성공 후 role에 따라 리다이렉트
  useEffect(() => {
    if (isLoading) return; // 매우 중요
    if (!user) return;
    if (!user.role) return; // role 완성 대기

    const role = user.role.toLowerCase().trim();

    router.replace(isAdminRole(user.role) ? "/admin" : "/");
  }, [user, isLoading, router]);

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      setAuthError("아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해주세요.");
      return;
    }


    // 로그인 성공 → user 저장 (role이 채워지면 위 useEffect가 리다이렉트 처리)
    await setUser(data.user);
  };

  return (
    <div className="w-full max-w-md mx-auto py-24 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">로그인</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="example@hotel.com"
            className="w-full border px-4 py-3 rounded-lg focus:outline-[#9c836a]"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            className="w-full border px-4 py-3 rounded-lg focus:outline-[#9c836a]"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {authError && <p className="text-red-600 text-sm mt-2">{authError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#9c836a] text-white py-3 rounded-lg hover:bg-[#8b745e] transition disabled:opacity-50"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="w-full bg-[#9c836a] text-white py-3 rounded-lg hover:bg-[#8b745e] transition"
        >
          회원가입
        </button>
        <p>
          ※ 관리자 화면은 <br />
          아래 테스트 계정으로 로그인하시면 확인하실 수 있습니다. <br />
          id:admin@test.com // pw: 1234
        </p>
      </form>
    </div>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/authStore";

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
    formState: { errors },
  } = useForm<LoginFormValues>();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [loginError, setLoginError] = useState("");

  // 로그인 성공 후 role에 따라 리다이렉트
  useEffect(() => {
    if (isLoading) return; // 매우 중요
    if (!user) return;
    if (!user.role) return; // role 완성 대기

    const role = user.role.toLowerCase().trim();

    if (["admin", "manager"].includes(role)) {
      router.replace("/admin");
    } else {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setLoginError("");

    let data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"] | null =
      null;
    let error: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["error"] | null =
      null;

    try {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
    } catch (err) {
      console.error("LOGIN TRY/CATCH ERROR:", err);
      setLoginError("로그인 중 오류가 발생했습니다.");
      return;
    }

    if (error || !data?.user) {
      setLoginError("아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해주세요.");
      return;
    }

    // 로그인 성공 → user 저장 (role이 채워지면 위 useEffect가 리다이렉트 처리)
    await setUser(data.user);
  };

  return (
    <div className="w-full max-w-md mx-auto py-24 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">로그인</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 이메일 */}
        <div>
          <label className="block mb-1 text-sm font-medium">이메일</label>
          <input
            type="email"
            placeholder="example@hotel.com"
            className="w-full border px-4 py-3 rounded-lg focus:outline-[#9c836a]"
            {...register("email", { required: "이메일을 입력해주세요." })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block mb-1 text-sm font-medium">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full border px-4 py-3 rounded-lg focus:outline-[#9c836a]"
            {...register("password", { required: "비밀번호를 입력해주세요." })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* 로그인 실패 메시지 영역 */}
        {loginError && <p className="text-red-600 text-sm mt-2">{loginError}</p>}

        {/* 버튼 */}
        <button
          type="submit"
          className="w-full bg-[#9c836a] text-white py-3 rounded-lg hover:bg-[#8b745e] transition"
        >
          로그인
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
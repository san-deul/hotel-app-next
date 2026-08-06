"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/authStore";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "@/components/common/FormInput";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  useAuthRedirect(); // 기존 useEffect 블록을 대체

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const setUser = useAuthStore((state) => state.setUser);
  const authError = useAuthStore((state) => state.authError);
  const setAuthError = useAuthStore((state) => state.setAuthError);

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

    await setUser(data.user);
  };

  return (
    <div className="w-full max-w-md mx-auto py-24 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">로그인</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="이메일"
          name="email"
          register={register}
          error={errors.email}
          placeholder="example@hotel.com"
        />
        <FormInput
          type="password"
          label="비밀번호"
          name="password"
          register={register}
          error={errors.password}
          placeholder="비밀번호"
        />

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
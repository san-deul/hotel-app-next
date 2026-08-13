"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { changePasswordSchema, ChangePasswordFormValues } from "@/lib/schemas/changePasswordSchema";
import { FormInput } from "@/components/common/FormInput";
import { toast } from "sonner";

export default function ChangePasswordContent() {
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("비밀번호가 성공적으로 변경되었습니다.");
    router.push("/mypage");
  };

  return (
    <form className="w-full max-w-lg mx-auto mt-10 min-h-screen" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 변경</h2>

      <FormInput
        type="password"
        label="새 비밀번호"
        name="password"
        register={register}
        error={errors.password}
      />
      <FormInput
        type="password"
        label="비밀번호 확인"
        name="password_confirm"
        register={register}
        error={errors.password_confirm}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-3 rounded mt-4 disabled:opacity-50"
      >
        {isSubmitting ? "처리중..." : "비밀번호 변경"}
      </button>
    </form>
  );
}
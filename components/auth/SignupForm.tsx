"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/authStore";
import { signupSchema, SignupFormValues } from "@/lib/schemas/signupSchema";
import { signUpWithMember } from "@/lib/api/auth";
import { formatPhone } from "@/lib/utils/format";
import { FormInput } from "@/components/common/FormInput";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";

type DaumPostcodeData = {
  address: string;
  bname: string;
  buildingName: string;
  zonecode: string;
};

export default function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const openDaumPopup = useDaumPostcodePopup();

  useAuthRedirect(); // 가입 성공 후 role 보고 자동 리다이렉트

  const setUser = useAuthStore((state) => state.setUser);
  const authError = useAuthStore((state) => state.authError);
  const setAuthError = useAuthStore((state) => state.setAuthError);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
  });

  const handlePostcodeComplete = (data: DaumPostcodeData) => {
    let full = data.address;
    let extra = "";

    if (data.bname !== "") extra = data.bname;
    if (data.buildingName !== "")
      extra += extra ? `, ${data.buildingName}` : data.buildingName;
    if (extra) full += ` (${extra})`;

    setValue("zipcode", data.zonecode);
    setValue("basic_address", full);
    setValue("detail_address", "");
  };

  const handleOpenPostcode = () => {
    openDaumPopup({ onComplete: handlePostcodeComplete });
  };

  const onSubmit = async (data: SignupFormValues) => {
    setAuthError(null);

    const result = await signUpWithMember(supabase, data);

    if (!result.ok) {
      setAuthError(result.message);
      return;
    }

    toast.success(`${data.name}님, 회원이 되신 것을 환영합니다.`);
    await setUser(result.user);
  };

  return (
    <form className="w-full max-w-lg mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

      <FormInput label="이름" name="name" register={register} error={errors.name} />
      <FormInput
        label="이메일"
        name="email"
        register={register}
        error={errors.email}
        placeholder="example@example.com"
      />
      <FormInput
        type="password"
        label="비밀번호"
        name="password"
        register={register}
        error={errors.password}
        placeholder="6자 이상 입력해주세요"
      />
      <FormInput
        type="password"
        label="비밀번호 확인"
        name="password_confirm"
        register={register}
        error={errors.password_confirm}
      />

      <div className="mb-4">
        <label className="block mb-1">휴대폰</label>
        <input
          {...register("phone")}
          onChange={(e) => setValue("phone", formatPhone(e.target.value))}
          className="w-full border rounded px-3 py-2"
          placeholder="010-1234-5678"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">생년월일 (8자리)</label>
        <input
          type="text"
          maxLength={8}
          placeholder="예: 19991231"
          {...register("birth")}
          onChange={(e) =>
            setValue("birth", e.target.value.replace(/[^0-9]/g, ""))
          }
          className="w-full border rounded-md px-3 py-2"
        />
        {errors.birth && (
          <p className="text-red-500 text-sm mt-1">{errors.birth.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">우편번호</label>
        <div className="flex w-full gap-2">
          <input
            type="text"
            {...register("zipcode")}
            readOnly
            placeholder="00000"
            className="flex-1 border rounded-md px-3 py-2"
          />
          <button
            type="button"
            onClick={handleOpenPostcode}
            className="px-4 py-2 bg-black text-white rounded-md whitespace-nowrap"
          >
            검색
          </button>
        </div>
        {errors.zipcode && (
          <p className="text-red-500 text-sm mt-1">{errors.zipcode.message}</p>
        )}
      </div>

      <FormInput
        label="기본 주소"
        name="basic_address"
        register={register}
        error={errors.basic_address}
      />
      <FormInput
        label="상세 주소"
        name="detail_address"
        register={register}
        error={errors.detail_address}
      />

      {authError && <p className="text-red-600 text-sm mt-2">{authError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-3 rounded mt-4 disabled:opacity-50"
      >
        {isSubmitting ? "처리중..." : "회원가입"}
      </button>
    </form>
  );
}
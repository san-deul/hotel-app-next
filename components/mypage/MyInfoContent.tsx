"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { myInfoSchema, MyInfoFormValues } from "@/lib/schemas/myInfoSchema";
import { updateMemberProfile, MemberProfile } from "@/lib/api/user";
import { formatPhone, handleFormattedBackspace } from "@/lib/utils/format";
import { FormInput } from "@/components/common/FormInput";
import { toast } from "sonner";

type DaumPostcodeData = {
  address: string;
  bname: string;
  buildingName: string;
  zonecode: string;
};

interface MyInfoContentProps {
  email: string;
  initialMember: MemberProfile;
}

export default function MyInfoContent({ email, initialMember }: MyInfoContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const openDaumPopup = useDaumPostcodePopup();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MyInfoFormValues>({
    resolver: yupResolver(myInfoSchema),
    defaultValues: {
      name: initialMember.name,
      phone: initialMember.phone,
      birth: initialMember.birth,
      zipcode: initialMember.zipcode,
      basic_address: initialMember.basic_address,
      detail_address: initialMember.detail_address ?? "",
    },
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

  const onSubmit = async (data: MyInfoFormValues) => {
    const result = await updateMemberProfile(supabase, initialMember.id, {
      name: data.name,
      phone: data.phone,
      birth: data.birth,
      zipcode: data.zipcode,
      basic_address: data.basic_address,
      detail_address: data.detail_address ?? "",
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("회원 정보가 수정되었습니다.");
    router.refresh();
  };

  return (
    <form className="w-full max-w-lg mx-auto mt-10 min-h-screen" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-6 text-center">마이페이지</h2>

      <div className="mb-4">
        <label className="block mb-1">이메일</label>
        <input
          className="w-full border rounded px-3 py-2 bg-gray-100"
          disabled
          value={email}
          readOnly
        />
      </div>

      <FormInput label="이름" name="name" register={register} error={errors.name} />

      <div className="mb-4">
        <label className="block mb-1">연락처</label>
        <input
          {...register("phone")}
          onChange={(e) => setValue("phone", formatPhone(e.target.value))}
          onKeyDown={(e) =>
            handleFormattedBackspace(e, formatPhone, (value) => setValue("phone", value))
          }
          className="w-full border rounded px-3 py-2"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1">생년월일 (8자리)</label>
        <input
          {...register("birth")}
          maxLength={8}
          onChange={(e) => setValue("birth", e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full border rounded px-3 py-2"
        />
        {errors.birth && (
          <p className="text-red-500 text-sm mt-1">{errors.birth.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1">우편번호</label>
        <div className="flex w-full gap-2">
          <input
            {...register("zipcode")}
            readOnly
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

      <FormInput label="기본 주소" name="basic_address" register={register} error={errors.basic_address} />
      <FormInput label="상세 주소" name="detail_address" register={register} error={errors.detail_address} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-3 rounded mt-4 disabled:opacity-50"
      >
        {isSubmitting ? "저장중..." : "정보 수정"}
      </button>

      <button
        type="button"
        onClick={() => router.push("/mypage/password")}
        className="w-full bg-black text-white py-3 rounded mt-2 hover:bg-[#a67c52] hover:shadow-lg transition duration-200"
      >
        비밀번호 수정
      </button>
    </form>
  );
}
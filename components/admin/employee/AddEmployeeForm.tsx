"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = yup.object({
  name: yup.string().required("이름을 입력해주세요."),
  phone: yup.string().required("휴대폰 번호를 입력해주세요."),
  birth: yup
    .string()
    .required("생년월일은 필수 입력 항목입니다.")
    .matches(/^[0-9]{8}$/, "생년월일은 8자리 숫자여야 합니다.")
    .test("valid-date", "올바른 날짜가 아닙니다.", (value) => {
      if (!value) return false;
      const year = Number(value.slice(0, 4));
      const month = Number(value.slice(4, 6));
      const day = Number(value.slice(6, 8));
      const date = new Date(`${year}-${month}-${day}`);
      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
      );
    }),
  email: yup.string(),
});

type FormValues = {
  name: string;
  phone: string;
  birth: string;
  email?: string;
};

export default function AddEmployeeForm({
  generatedEmail,
}: {
  generatedEmail: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: generatedEmail },
  });

  const formatPhone = (value: string) => {
    const onlyNums = value.replace(/[^0-9]/g, "");
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };

  const onSubmit = async (form: FormValues) => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "직원 추가 중 오류가 발생했습니다.");
      }

      alert(`직원 추가 완료!\n아이디: ${form.email}`);
      router.push("/admin/employee");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "직원 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-8 text-[#696cff]">직원 추가</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded shadow p-8 w-full max-w-3xl">
        <div className="mb-4">
          <label className="font-semibold block mb-1">이메일 (자동 생성)</label>
          <input {...register("email")} readOnly disabled className="border rounded w-full p-2 bg-gray-100 text-gray-600" />
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-1">이름</label>
          <input placeholder="직원 이름" {...register("name")} className="border rounded w-full p-2" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-1">연락처</label>
          <input
            {...register("phone")}
            onChange={(e) => setValue("phone", formatPhone(e.target.value))}
            className="border rounded w-full p-2"
            placeholder="010-1234-5678"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-1">생년월일 (8자리)</label>
          <input
            type="text"
            maxLength={8}
            {...register("birth")}
            placeholder="19991231"
            onChange={(e) => setValue("birth", e.target.value.replace(/[^0-9]/g, ""))}
            className="border rounded w-full p-2"
          />
          {errors.birth && <p className="text-red-500 text-sm mt-1">{errors.birth.message}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button type="submit" className="bg-[#696cff] text-white px-5 py-2 rounded">
            {loading ? "처리중..." : "추가하기"}
          </button>
          <button type="button" className="px-5 py-2 rounded border" onClick={() => router.back()}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
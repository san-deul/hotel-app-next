"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addEmployee } from "@/lib/actions/employee";
import { employeeSchema, EmployeeFormValues } from "@/lib/schemas/employeeSchema";
import { formatPhone } from "@/lib/utils/format";
import { ControlledInput } from "@/components/common/ControlledInput";

const formatBirth = (value: string) => value.replace(/[^0-9]/g, "");

export default function AddEmployeeForm({ generatedEmail }: { generatedEmail: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: yupResolver(employeeSchema),
    defaultValues: { email: generatedEmail },
  });

  const onSubmit = async (form: EmployeeFormValues) => {
    try {
      setLoading(true);
      const result = await addEmployee(form);
      toast.success(`직원 추가 완료! 아이디: ${result.email} / 임시 비밀번호: ${result.tempPassword}`);
      router.push("/admin/employee");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "직원 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-8 text-[#696cff]">직원 추가</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded shadow p-8 w-full max-w-3xl">
        <ControlledInput<EmployeeFormValues> label="이메일 (자동 생성)" name="email" control={control} disabled readOnly />
        <ControlledInput<EmployeeFormValues> label="이름" name="name" control={control} placeholder="직원 이름" error={errors.name?.message} />
        <ControlledInput<EmployeeFormValues> label="연락처" name="phone" control={control} placeholder="010-1234-5678" format={formatPhone} error={errors.phone?.message} />
        <ControlledInput<EmployeeFormValues> label="생년월일 (8자리)" name="birth" control={control} placeholder="19991231" format={formatBirth} error={errors.birth?.message} />

        <div className="flex gap-3 mt-6">
          <button type="submit" disabled={loading} className="bg-[#696cff] text-white px-5 py-2 rounded disabled:opacity-50">
            {loading ? "처리중..." : "추가하기"}
          </button>
          <button type="button" disabled={loading} className="px-5 py-2 rounded border" onClick={() => router.back()}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
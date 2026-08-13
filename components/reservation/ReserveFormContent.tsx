"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { reserveSchema, type ReserveFormValues } from "@/lib/schemas/reserveSchema";
import { getRoomImageUrl } from "@/lib/utils/image";
import type { RoomRow } from "@/lib/api/room";
import CustomerInfoSection from "./CustomerInfoSection";
import CardInfoSection from "./CardInfoSection";
import ReservationSummary from "./ReservationSummary";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { createReservation } from "@/lib/api/reservation";

interface SearchInfo {
  start: string;
  end: string;
  adult: number;
  child: number;
}

interface InitialCustomer {
  name: string;
  phone: string;
  email: string;
}

interface Props {
  room: RoomRow;
  searchInfo: SearchInfo;
  initialCustomer: InitialCustomer;
  userId: string;
}

export default function ReserveFormContent({ room, searchInfo, initialCustomer, userId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReserveFormValues>({
    resolver: yupResolver(reserveSchema),
    defaultValues: {
      name: initialCustomer.name,
      phone: initialCustomer.phone,
      email: initialCustomer.email,
      cardNo: "",
      cardExpYear: "",
      cardExpMonth: "",
      cardAuthBirth: "",
      agree: false,
    },
  });

  const onSubmit = async (values: ReserveFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await createReservation(supabase, {
        user_id: userId,
        room_no: room.room_no,
        start_date: searchInfo.start,
        end_date: searchInfo.end,
        adult: searchInfo.adult,
        child: searchInfo.child,
        total_price: room.price ?? 0,
        payment_method: "card",
        guest_name: values.name,
        guest_phone: values.phone,
        guest_email: values.email,
      });

      router.push("/mypage/reservations");
    } catch (error) {
      console.error(error);
      setSubmitError("예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  const mainImagePath = room.room_img?.find((img) => img.is_main)?.upload_path;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 pt-6 lg:pt-10 pb-20 px-4 lg:px-0"
    >
      <div className="flex-1 space-y-10">
        <CustomerInfoSection register={register} control={control} errors={errors} />
        <CardInfoSection register={register} control={control} errors={errors} />

        {/* 취소 규정 — 정적 텍스트라 컴포넌트로 안 뺌 */}
        <section className="bg-white border rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">취소 규정</h2>
          <p className="text-gray-600 leading-relaxed">
            • 당일 예약의 경우 예약 완료와 동시에 취소 및 변경이 불가합니다.
            <br />
            • 노쇼(No-Show) 발생 시 동일한 위약금이 청구될 수 있습니다.
          </p>
        </section>

        {/* 개인정보 동의 */}
        <section className="bg-white border rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">개인정보 수집 및 활용 동의</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("agree")} />
            <span className="font-medium">
              [필수] 개인정보 수집 및 이용에 동의합니다.
            </span>
          </label>
          {errors.agree && (
            <p className="text-red-500 text-sm mt-1">{errors.agree.message}</p>
          )}
        </section>

        <button
          type="submit"
          className="w-full bg-[#3c2b27] text-white py-4 rounded-xl text-lg font-semibold cursor-pointer"
        >
          결제하기
        </button>
      </div>

      <ReservationSummary
        room={room}
        imageUrl={getRoomImageUrl(mainImagePath)}
        searchInfo={searchInfo}
      />
    </form>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useReservations } from "@/hooks/queries/useReservations";
import { ReservationRow, ReservationStatus } from "@/lib/api/reservation";

interface ReservationListContentProps {
  initialReservations: ReservationRow[];
  initialStartDate: string;
}

export default function ReservationListContent({
  initialReservations,
  initialStartDate,
}: ReservationListContentProps) {


  const router = useRouter();

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<ReservationStatus | "">("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const isInitialFilterState =
    startDate === initialStartDate && !endDate && !status && !keyword;

  const { data: reservations, isLoading } = useReservations(
    { startDate, endDate, status, keyword },
    { initialData: isInitialFilterState ? initialReservations : undefined }
  );

  const renderStatus = (status: ReservationStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">확정</span>
        );
      case "cancelled":
        return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">취소</span>;
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">대기</span>
        );
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">예약 관리</h1>

      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ReservationStatus | "")}
          className="border rounded px-3 py-2"
        >
          <option value="">전체 상태</option>
          <option value="pending">대기</option>
          <option value="confirmed">확정</option>
          <option value="cancelled">취소</option>
        </select>
        <input
          type="text"
          placeholder="예약자명 / 전화번호"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setKeyword(keywordInput);
          }}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={() => setKeyword(keywordInput)}
          className="px-4 py-2 bg-[#696cff] text-white rounded"
        >
          검색
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">예약번호</th>
              <th className="px-4 py-3 text-left">예약자</th>
              <th className="px-4 py-3 text-left">객실</th>
              <th className="px-4 py-3 text-left">체크인</th>
              <th className="px-4 py-3 text-left">체크아웃</th>
              <th className="px-4 py-3 text-left">상태</th>
              <th className="px-4 py-3 text-right">금액</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="text-center py-10">
                  불러오는 중...
                </td>
              </tr>
            )}

            {!isLoading && reservations?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  예약 내역이 없습니다.
                </td>
              </tr>
            )}

            {reservations?.map((r) => (
              <tr
                key={r.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/admin/reservations/${r.id}`)}
              >
                <td className="px-4 py-3">{r.id}</td>
                <td className="px-4 py-3">{r.guest_name}</td>
                <td className="px-4 py-3">{r.room?.room_name}</td>
                <td className="px-4 py-3">{dayjs(r.start_date).format("YYYY-MM-DD")}</td>
                <td className="px-4 py-3">{dayjs(r.end_date).format("YYYY-MM-DD")}</td>
                <td className="px-4 py-3">{renderStatus(r.status)}</td>
                <td className="px-4 py-3 text-right">{r.total_price.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
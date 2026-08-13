"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DateRange } from "react-date-range";
import { differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { getRoomImageUrl } from "@/lib/utils/image";
import { buildReservationGroups, type MyReservationRow } from "@/lib/api/reservation";
import { useCancelReservations, useMyReservations } from "@/hooks/queries/useReservations";
import dayjs from "dayjs";

const PAGE_SIZE = 5;

interface Props {
  userId: string;
  initialFrom: string;
  initialTo: string;
  initialReservations: MyReservationRow[];
}



export default function MyReservationContent({
  userId,
  initialFrom,
  initialTo,
  initialReservations,
}: Props) {
  const router = useRouter();

  const [range, setRange] = useState([
    {
      startDate: dayjs(initialFrom).toDate(),
      endDate: dayjs(initialTo).toDate(),
      key: "selection",
    },
  ]);

  const from = dayjs(range[0].startDate).format("YYYY-MM-DD");
  const to = dayjs(range[0].endDate).format("YYYY-MM-DD");

  const [openCalendar, setOpenCalendar] = useState(false);
  const [orderNoInput, setOrderNoInput] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [page, setPage] = useState(1);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setOpenCalendar(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // from/to가 서버에서 받아온 초기값과 같을 때만 initialData 사용
  // (다른 기간을 조회하면 서버 데이터는 무효 — 새로 fetch해야 함)
  const { data: reservations = [], isLoading } = useMyReservations(userId, from, to, {
    initialData:
      from === initialFrom && to === initialTo ? initialReservations : undefined,
  });

  const cancelMutation = useCancelReservations(userId);

  const filteredReservations = useMemo(() => {
    if (!orderNo.trim()) return reservations;
    return reservations.filter((r) => String(r.order_no ?? r.id).includes(orderNo));
  }, [reservations, orderNo]);

  const groups = useMemo(
    () => buildReservationGroups(filteredReservations),
    [filteredReservations]
  );

  const startIndex = (page - 1) * PAGE_SIZE;
  const pagedGroups = groups.slice(startIndex, startIndex + PAGE_SIZE);

  const applyRange = (months: number) => {
    setRange([
      {
        startDate: dayjs().subtract(months, "month").toDate(),
        endDate: dayjs().toDate(),
        key: "selection",
      },
    ]);
    setPage(1);
  };

  const handleCancel = (ids: number[]) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    cancelMutation.mutate(ids);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">나의 예약 확인</h1>

      <div className="bg-white border rounded p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex gap-2 md:hidden">
            <button className="flex-1 border py-2 rounded" onClick={() => applyRange(6)}>
              최근 6개월
            </button>
            <button className="flex-1 border py-2 rounded" onClick={() => applyRange(12)}>
              최근 1년
            </button>
            <button className="flex-1 border py-2 rounded" onClick={() => setOpenCalendar(true)}>
              기간 선택
            </button>
          </div>

          <div className="hidden md:flex gap-3 items-center relative" ref={calendarRef}>
            <div
              className="cursor-pointer border px-4 py-2 rounded"
              onClick={() => setOpenCalendar((prev) => !prev)}
            >
              {from} ~ {to}
            </div>
            {openCalendar && (
              <div className="absolute z-50 top-full left-0 mt-2 bg-white border rounded shadow">
                <DateRange
                  locale={ko}
                  ranges={range}
                  onChange={(item) => {
                    const selection = item.selection;
                    setRange([
                      {
                        startDate: selection.startDate ?? new Date(),
                        endDate: selection.endDate ?? new Date(),
                        key: selection.key ?? "selection",
                      },
                    ]);
                  }}
                  months={1}
                  direction="horizontal"
                />
              </div>
            )}
            <button className="border px-4 py-2 rounded" onClick={() => applyRange(6)}>
              최근 6개월
            </button>
            <button className="border px-4 py-2 rounded" onClick={() => applyRange(12)}>
              최근 1년
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:justify-end">
          <select disabled className="border px-3 py-2 rounded bg-gray-100 text-gray-500">
            <option>예약상태 전체</option>
          </select>

          <div className="flex gap-2">
            <input
              value={orderNoInput}
              onChange={(e) => setOrderNoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setOrderNo(orderNoInput);
                  setPage(1);
                }
              }}
              placeholder="예약번호 입력"
              className="border px-3 py-2 rounded w-full md:w-48"
            />
            <button
              className="border px-4 py-2 rounded"
              onClick={() => {
                setOrderNo(orderNoInput);
                setPage(1);
              }}
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {openCalendar && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute bottom-0 w-full bg-white rounded-t-xl">
            <DateRange
              locale={ko}
              ranges={range}
              onChange={(item) => {
                const selection = item.selection;
                setRange([
                  {
                    startDate: selection.startDate ?? new Date(),
                    endDate: selection.endDate ?? new Date(),
                    key: selection.key ?? "selection",
                  },
                ]);
              }}
              months={1}
              direction="vertical"
              minDate={new Date()}
            />
            <div className="p-4">
              <button
                className="w-full bg-[#a67c52] text-white py-3 rounded"
                onClick={() => setOpenCalendar(false)}
              >
                조회하기
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <div className="text-center py-10">로딩중...</div>}

      {!isLoading && pagedGroups.length === 0 && (
        <div className="text-center py-10 text-gray-500">조회된 예약이 없습니다.</div>
      )}

      <div className="space-y-6">
        {pagedGroups.map((g) => (
          <div key={`${g.start_date}_${g.end_date}`} className="border rounded-xl bg-white">
            <div className="p-4 border-b flex justify-between">
              <div>
                <p className="font-semibold">{g.start_date} ~ {g.end_date}</p>
                <p className="text-sm text-gray-500">
                  {differenceInDays(new Date(g.end_date), new Date(g.start_date))}박
                </p>
              </div>
              <div className="font-semibold text-[#a67c52]">
                ₩{g.total_price.toLocaleString()}
              </div>
            </div>

            <div className="divide-y">
              {g.items.map((r) => (
                <div
                  key={r.id}
                  className={`p-4 flex flex-col md:flex-row gap-4 ${r.status === "cancelled" ? "opacity-60" : ""
                    }`}
                >
                  <div className="relative w-full md:w-32 h-40 md:h-24 overflow-hidden rounded">
                    <Image
                      src={getRoomImageUrl(r.room?.room_img?.[0]?.upload_path)}
                      alt={r.room?.room_name ?? ""}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">{r.room?.room_name}</p>
                    <p className="text-sm text-gray-500">예약번호: {r.order_no || r.id}</p>
                    <p className="text-sm">₩{r.room?.price?.toLocaleString()}</p>
                  </div>

                  <div className="flex md:flex-col gap-3">
                    <button
                      className="text-blue-600"
                      onClick={() => router.push(`/mypage/reservations/${r.id}`)}
                    >
                      상세보기
                    </button>
                    {r.status !== "cancelled" && (
                      <button className="text-red-500" onClick={() => handleCancel([r.id])}>
                        예약취소
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* <Pagination total={groups.length} page={page} pageSize={PAGE_SIZE} onChange={setPage} />*/}
    </div>
  );
}
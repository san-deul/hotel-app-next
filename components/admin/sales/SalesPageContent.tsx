"use client";

import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import SalesFilter from "./SalesFilter";
import SalesChart from "./SalesChart";
import { useSalesSummary } from "@/hooks/queries/useSalesSummary";
import type { SalesSummaryResult, RangeType } from "@/lib/api/sales";
import SalesSummary from "./SalesSummary";
import SalesRoomOccupancySection from "./SalesRoomOccupancySection";

interface SalesPageContentProps {
  initialStartDate: string;
  initialEndDate: string;
  initialData: SalesSummaryResult;
}

export default function SalesPageContent({
  initialStartDate,
  initialEndDate,
  initialData,
}: SalesPageContentProps) {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [rangeType, setRangeType] = useState<RangeType>("month");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const periodLabel = useMemo(() => {
    switch (rangeType) {
      case "today":
        return currentDate.format("YYYY년 M월 D일");
      case "week":
        return `${currentDate.format("YYYY년 M월")} 주간`;
      case "month":
        return currentDate.format("YYYY년 M월");
      case "custom":
        return `${dayjs(startDate).format("YYYY년 M월 D일")} ~ ${dayjs(
          endDate
        ).format("YYYY년 M월 D일")}`;
      default:
        return "매출 요약";
    }
  }, [rangeType, currentDate, startDate, endDate]);

  const setToday = () => {
    const today = dayjs();
    setRangeType("today");
    setCurrentDate(today);
    setStartDate(today.format("YYYY-MM-DD"));
    setEndDate(today.format("YYYY-MM-DD"));
  };

  const setWeek = () => {
    setRangeType("week");
    setStartDate(currentDate.startOf("week").format("YYYY-MM-DD"));
    setEndDate(currentDate.endOf("week").format("YYYY-MM-DD"));
  };

  const setMonth = () => {
    setRangeType("month");
    setStartDate(currentDate.startOf("month").format("YYYY-MM-DD"));
    setEndDate(currentDate.endOf("month").format("YYYY-MM-DD"));
  };

  const moveMonth = (direction: number) => {
    const next = currentDate.add(direction, "month");
    setCurrentDate(next);
    setRangeType("month");
    setStartDate(next.startOf("month").format("YYYY-MM-DD"));
    setEndDate(next.endOf("month").format("YYYY-MM-DD"));
  };

  const setCustomDate = (date: Date) => {
    const d = dayjs(date);
    setCurrentDate(d);
    setRangeType("custom");
    setStartDate(d.format("YYYY-MM-DD"));
    setEndDate(d.format("YYYY-MM-DD"));
  };

  const isInitialRange =
    startDate === initialStartDate && endDate === initialEndDate;

  const { data } = useSalesSummary(
    startDate,
    endDate,
    isInitialRange ? initialData : undefined
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">매출관리</h1>

      <SalesFilter
        startDate={startDate}
        endDate={endDate}
        currentDate={currentDate}
        rangeType={rangeType}
        onToday={setToday}
        onWeek={setWeek}
        onMonth={setMonth}
        onMoveMonth={moveMonth}
        onSelectDate={setCustomDate}
      />

      {data && (
        <>
          <SalesSummary periodLabel={periodLabel} summary={data.summary} />
          <div className="grid grid-cols-1 gap-6">
            <SalesChart data={data.dailySales} />
            <SalesRoomOccupancySection data={data.roomOccupancy} />
          </div>
        </>
      )}
    </div>
  );
}
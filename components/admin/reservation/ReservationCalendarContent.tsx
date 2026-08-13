"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DayCellContentArg, EventClickArg } from "@fullcalendar/core";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useReservationCalendar } from "@/hooks/queries/useReservations";
import type { CalendarEvent, DailyOccupancyMap } from "@/lib/api/reservation";
import "@/styles/fullcalendar.css";

interface ReservationCalendarContentProps {
  initialEvents: CalendarEvent[];
  initialOccupancy: DailyOccupancyMap;
}

export default function ReservationCalendarContent({
  initialEvents,
  initialOccupancy,
}: ReservationCalendarContentProps) {
  const router = useRouter();

  const { data, isLoading } = useReservationCalendar({
    initialData: { events: initialEvents, occupancy: initialOccupancy },
  });

  const dayCellClassNames = (arg: DayCellContentArg) => {
    const date = dayjs(arg.date).format("YYYY-MM-DD");
    const daily = data?.occupancy[date];
    if (!daily) return "";

    const isFull = Object.values(daily).some((info) => info.count >= info.total);
    return isFull ? "bg-red-50" : "";
  };

  if (isLoading) {
    return <div className="p-6">불러오는 중...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">예약 현황</h1>

      <div className="bg-white rounded shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          locale="ko"
          events={data?.events ?? []}
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          dayCellClassNames={dayCellClassNames}
          eventClick={(info: EventClickArg) => {
            const date = dayjs(info.event.start).format("YYYY-MM-DD");
            router.push(`/admin/reservations?date=${date}`);
          }}
        />
      </div>
    </div>
  );
}
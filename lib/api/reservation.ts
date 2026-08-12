// lib/api/reservation.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface ReservationRow {
  id: number;
  guest_name: string;
  room_no: number;
  start_date: string;
  end_date: string;
  status: ReservationStatus;
  total_price: number;
  room: { room_name: string } | null;
  [key: string]: unknown;
}

export interface ReservationFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  keyword?: string;
}

export async function fetchReservations(
  supabase: SupabaseClient,
  filters: ReservationFilters
): Promise<ReservationRow[]> {
  let query = supabase
    .from("reservation")
    .select(`*, room:room_no ( room_name )`)
    .order("start_date", { ascending: true });

  if (filters.startDate) query = query.gte("start_date", filters.startDate);
  if (filters.endDate) query = query.lte("end_date", filters.endDate);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.keyword) query = query.or(`guest_name.ilike.%${filters.keyword}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data as ReservationRow[];
}


export interface RoomCalendarInfo {
  room_name: string;
  parent_no: string;
  total_room: number;
}

export interface ReservationWithRoom extends ReservationRow {
  room: RoomCalendarInfo;
}

interface OccupancyInfo {
  count: number;
  total: number;
  parent: string;
}

// { "2026-08-10": { "스탠다드": { count, total, parent } } }
export type DailyOccupancyMap = Record<string, Record<string, OccupancyInfo>>;

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    count: number;
    total: number;
    roomName: string;
  };
}

const ROOM_COLORS: Record<string, string> = {
  "100": "#2563eb",
  "200": "#4ccc72",
  "300": "#f59e0b",
};

function buildDailyOccupancy(reservations: ReservationWithRoom[]): DailyOccupancyMap {
  const map: DailyOccupancyMap = {};

  reservations.forEach((r) => {
    let cur = dayjs(r.start_date);
    const end = dayjs(r.end_date);

    while (cur.isBefore(end)) {
      const dateKey = cur.format("YYYY-MM-DD");

      if (!map[dateKey]) map[dateKey] = {};

      const roomName = r.room.room_name;

      map[dateKey][roomName] = {
        count: (map[dateKey][roomName]?.count ?? 0) + 1,
        total: r.room.total_room,
        parent: r.room.parent_no,
      };

      cur = cur.add(1, "day");
    }
  });

  return map;
}

function buildCalendarEvents(occupancy: DailyOccupancyMap): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  Object.entries(occupancy).forEach(([date, rooms]) => {
    Object.entries(rooms).forEach(([roomName, info]) => {
      events.push({
        id: `${date}-${roomName}`,
        title: `${roomName} (${info.count}/${info.total})`,
        date,
        start: date,
        end: dayjs(date).add(1, "day").format("YYYY-MM-DD"),
        backgroundColor: ROOM_COLORS[info.parent] ?? "#6b7280",
        borderColor: ROOM_COLORS[info.parent] ?? "#6b7280",
        extendedProps: { count: info.count, total: info.total, roomName },
      });
    });
  });

  return events;
}

export async function fetchReservationCalendar(
  supabase: SupabaseClient
): Promise<{ events: CalendarEvent[]; occupancy: DailyOccupancyMap }> {
  const { data, error } = await supabase
    .from("reservation")
    .select(`*, room:room_no ( room_name, parent_no, total_room )`)
    .neq("status", "cancelled");

  if (error) throw error;

  const occupancy = buildDailyOccupancy(data as ReservationWithRoom[]);
  const events = buildCalendarEvents(occupancy);

  return { events, occupancy };
}
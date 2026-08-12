"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarEvent,
  DailyOccupancyMap,
  fetchReservationCalendar,
  fetchReservations,
  type ReservationRow,
  type ReservationStatus,
} from "@/lib/api/reservation";

export interface ReservationFilters {
  startDate: string;
  endDate?: string;
  status?: ReservationStatus | "";
  keyword?: string;
}


export const reservationKeys = {
  all: ["admin-reservations"] as const,
  list: (filters: ReservationFilters) => [...reservationKeys.all, "list", filters] as const,
  calendar: () => [...reservationKeys.all, "calendar"] as const,
};

interface UseReservationsOptions {
  initialData?: ReservationRow[];
}

export function useReservations(
  filters: ReservationFilters,
  options?: UseReservationsOptions
) {
  const supabase = createClient();

  return useQuery({
    queryKey: reservationKeys.list(filters),
    queryFn: () => fetchReservations(supabase, filters),
    initialData: options?.initialData,
  });
}


interface UseReservationCalendarOptions {
  initialData?: { events: CalendarEvent[]; occupancy: DailyOccupancyMap };
}

export function useReservationCalendar(options?: UseReservationCalendarOptions) {
  const supabase = createClient();

  return useQuery({
    queryKey: reservationKeys.calendar(),
    queryFn: () => fetchReservationCalendar(supabase),
    initialData: options?.initialData,
  });
}
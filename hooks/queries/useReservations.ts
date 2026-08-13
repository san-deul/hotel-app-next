"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarEvent,
  DailyOccupancyMap,
  fetchReservationCalendar,
  fetchReservations,
  fetchMyReservations,
  cancelMyReservations,
  type MyReservationRow,
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

/* =========================
 * 마이페이지(내 예약) — admin과 키 네임스페이스 분리
 * ========================= */

export const myReservationKeys = {
  all: ["my-reservations"] as const,
  list: (userId: string, from: string, to: string) =>
    [...myReservationKeys.all, userId, from, to] as const,
};

interface UseMyReservationsOptions {
  initialData?: MyReservationRow[];
}

export function useMyReservations(
  userId: string,
  from: string,
  to: string,
  options?: UseMyReservationsOptions
) {
  const supabase = createClient();

  return useQuery({
    queryKey: myReservationKeys.list(userId, from, to),
    queryFn: () => fetchMyReservations(supabase, userId, from, to),
    initialData: options?.initialData,
  });
}

export function useCancelReservations(userId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => cancelMyReservations(supabase, userId, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReservationKeys.all });
    },
  });
}
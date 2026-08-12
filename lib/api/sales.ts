import type { SupabaseClient } from "@supabase/supabase-js";

export interface RoomJoin {
  room_name: string;
  [key: string]: unknown;
}

export interface ReservationRow {
  id: string;
  created_at: string;
  total_price: number | string | null;
  status: string;
  room_no: number;
  room: RoomJoin;
}

export interface SalesSummary {
  total: number;
  cancelled: number;
  net: number;
  count: number;
  avg: number;
}

export interface DailySales {
  date: string;
  total_amount: number;
}

export interface RoomOccupancy {
  roomName: string;
  count: number;
}

export interface SalesSummaryResult {
  summary: SalesSummary;
  dailySales: DailySales[];
  roomOccupancy: RoomOccupancy[];
}

// 순수 함수 — supabase 몰라도 됨, 테스트하기 쉬움
export function buildSalesSummary(reservations: ReservationRow[]): SalesSummaryResult {
  let total = 0;
  let cancelled = 0;
  let count = 0;

  const dailyMap: Record<string, number> = {};
  const roomMap: Record<string, number> = {};

  reservations.forEach((r) => {
    const price = Number(r.total_price) || 0;
    const date = r.created_at.slice(0, 10);

    total += price;

    if (r.status === "cancelled") {
      cancelled += price;
      return;
    }

    count += 1;
    dailyMap[date] = (dailyMap[date] || 0) + price;

    const roomName = r.room?.room_name;
    if (roomName) {
      roomMap[roomName] = (roomMap[roomName] || 0) + 1;
    }
  });

  return {
    summary: {
      total,
      cancelled,
      net: total - cancelled,
      count,
      avg: count ? Math.round((total - cancelled) / count) : 0,
    },
    dailySales: Object.entries(dailyMap).map(([date, total_amount]) => ({
      date,
      total_amount,
    })),
    roomOccupancy: Object.entries(roomMap).map(([roomName, count]) => ({
      roomName,
      count,
    })),
  };
}

// supabase client를 인자로 받는 이유: 서버(server.ts)/클라이언트(client.ts)
// 양쪽에서 같은 함수를 재사용하기 위해서야. room 관리 페이지 때랑 같은 패턴.
export async function fetchSalesSummary(
  supabase: SupabaseClient,
  startDate: string,
  endDate: string
): Promise<SalesSummaryResult> {
  const { data, error } = await supabase
    .from("reservation")
    .select(`*, room:room_no(*)`)
    .gte("created_at", `${startDate} 00:00:00`)
    .lte("created_at", `${endDate} 23:59:59`);

  if (error) throw error;

  return buildSalesSummary(data as ReservationRow[]);
}
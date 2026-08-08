
import ReservationBar from "@/components/reservation/ReserveationBar";
import RoomSearchList from "@/components/reservation/RoomSearchList";
import { fetchAvailableRooms, withThumbnail } from "@/lib/api/room";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "예약페이지 | SD HOTEL",
  description: "SD HOTEL 예약 페이지입니다.",
};

interface RoomSearchPageProps {
  searchParams: Promise<{
    start?: string;
    end?: string;
    adult?: string;
    child?: string;
  }>;
}

export default async function RoomSearchPage({ searchParams }: RoomSearchPageProps) {
  const { start, end, adult, child } = await searchParams;

  return (

    <div className="min-h-screen bg-[#faf8f4]">
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-6xl mx-auto py-6">
          <ReservationBar />
        </div>
      </div>

      {!start || !end ? (
        <div className="max-w-6xl mx-auto py-20 text-center">
          <p className="text-2xl text-gray-600 font-medium">
            예약을 원하시는 날짜, 인원을 선택해주세요.
          </p>
        </div>
      ) : (
        <SearchResult start={start} end={end} adult={adult} child={child} />
      )}
    </div>

  );
}

async function SearchResult({
  start,
  end,
  adult,
  child,
}: {
  start: string;
  end: string;
  adult?: string;
  child?: string;
}) {
  const supabase = await createClient();
  const minGuestCount = Number(adult ?? 0) + Number(child ?? 0);

  const rooms = await fetchAvailableRooms(supabase, minGuestCount);
  const roomsWithThumbnail = rooms.map(withThumbnail);

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h2 className="text-xl font-semibold mb-6">
        예약 가능한 객실 {rooms.length}개
      </h2>
      <RoomSearchList
        rooms={roomsWithThumbnail}
        start={start}
        end={end}
        adult={Number(adult ?? 0)}
        child={Number(child ?? 0)}
        />
    </div>
  );
}
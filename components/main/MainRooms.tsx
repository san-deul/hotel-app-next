import CarouselSection from "@/components/common/CarouselSection";
import { fetchRoomsForMain, MainRoomCarouselItem } from "@/lib/api/roomApi";
import { createClient } from "@/lib/supabase/server";

export default async function MainRooms() {
  const supabase = await createClient();

  let items: MainRoomCarouselItem[] = [];

  try {
    items = await fetchRoomsForMain(supabase);
  } catch (e) {
    console.error("메인페이지 객실 목록 조회 실패:", e);
    return (
      <div className="w-full py-16 text-center text-gray-500">
        객실 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="w-full">
      <CarouselSection title="객실 소개" items={items} />
    </div>
  );
}
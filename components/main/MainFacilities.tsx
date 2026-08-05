import { createClient } from "@/lib/supabase/server";

import CarouselSection from "@/components/common/CarouselSection";
import { fetchFacilitiesForMain, MainFacilityCarouselItem } from "@/lib/api/facilities";

export default async function MainFacilities() {
  const supabase = await createClient();

  let items: MainFacilityCarouselItem[] = [];

  try {
    items = await fetchFacilitiesForMain(supabase);
  } catch (e) {
    console.error("메인페이지 부대시설 목록 조회 실패:", e);
    return (
      <div className="w-full py-16 text-center text-gray-500">
        부대시설 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="w-full">
      <CarouselSection title="부대시설 안내" items={items} />
    </div>
  );
}
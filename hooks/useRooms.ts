import { useQuery } from "@tanstack/react-query";
import { fetchRooms, RoomRow } from "@/lib/api/roomApi";

// RoomNav(부모/자식 카테고리 트리)에서 쓰는 원본(raw) 데이터.
// depth===0(부모)도 포함, 필드 가공 없음.
// 카러셀용으로 가공된 데이터가 필요하면 useRoomsCarousel을 쓰세요.
export const useRooms = () => {
  return useQuery<RoomRow[]>({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
  });
};
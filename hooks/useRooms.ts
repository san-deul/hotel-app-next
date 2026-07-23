import { useQuery } from "@tanstack/react-query";
import { fetchRooms, getRoomImageUrl, RoomRow } from "@/lib/api/roomApi";
import { CarouselItem } from "@/components/common/CarouselSection";

export const useRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
    select: (rooms: RoomRow[]): CarouselItem[] =>
      rooms
        .filter((room) => room.depth !== 0)
        .map((room) => {
          const mainImg = room.room_img?.find((img) => img.is_main);
          const imagePath = mainImg?.upload_path;

          return {
            id: room.room_no,
            title: room.room_name,
            image: imagePath
              ? getRoomImageUrl(imagePath)
              : "/images/no-image.jpg",
          };
        }),
  });
};